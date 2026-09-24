"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertCircle, Loader2, Pencil, Plus, Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { CategoryFormSheet } from "@/components/admin/categories/CategoryFormSheet";
import {
  getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory,
  type AdminCategory, type CategoryInput,
} from "@/core/api";

const QUERY_KEY = ["admin-categories"];

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminCategory | null>(null);
  // Bumped on every open so the sheet remounts with fresh form state.
  const [sheetKey, setSheetKey] = useState(0);

  const { data: categories, isPending, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAdminCategories,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const save = useMutation({
    mutationFn: (values: CategoryInput) =>
      editing ? updateAdminCategory(editing.id, values) : createAdminCategory(values),
    onSuccess: (saved) => {
      toast.success(editing ? `Saved ${saved.name}` : `Created ${saved.name}`);
      setSheetOpen(false);
      refresh();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const toggle = useMutation({
    mutationFn: (c: AdminCategory) => updateAdminCategory(c.id, { is_active: !c.is_active }),
    // Flip it in place straight away; roll back if the API refuses.
    onMutate: async (c) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<AdminCategory[]>(QUERY_KEY);
      queryClient.setQueryData<AdminCategory[]>(QUERY_KEY, (list) =>
        list?.map((x) => (x.id === c.id ? { ...x, is_active: !c.is_active } : x)),
      );
      return { previous };
    },
    onError: (err: Error, _c, ctx) => {
      queryClient.setQueryData(QUERY_KEY, ctx?.previous);
      toast.error(err.message);
    },
    onSuccess: (saved) => toast.success(`${saved.name} is now ${saved.is_active ? "visible in the store" : "hidden from the store"}`),
    onSettled: refresh,
  });

  const remove = useMutation({
    mutationFn: (c: AdminCategory) => deleteAdminCategory(c.id),
    onSuccess: (_r, c) => {
      toast.success(`Deleted ${c.name}`);
      setConfirmDelete(null);
      setSheetOpen(false);
      refresh();
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setConfirmDelete(null);
    },
  });

  const openSheet = (category: AdminCategory | null) => {
    setEditing(category);
    setFormError(null);
    setSheetKey((k) => k + 1);
    setSheetOpen(true);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!categories || !q) return categories ?? [];
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q) || c.description?.toLowerCase().includes(q),
    );
  }, [categories, search]);

  const active = categories?.filter((c) => c.is_active).length ?? 0;
  const products = categories?.reduce((n, c) => n + c.product_count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Catalog</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            {categories
              ? `${active} of ${categories.length} shown in the store · ${products} products filed`
              : "How products are grouped in the store."}
          </p>
        </div>
        <Button onClick={() => openSheet(null)} className="bg-[#3f7a55] hover:bg-[#2d583d]">
          <Plus className="mr-1.5 h-4 w-4" /> New category
        </Button>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center p-24 text-gray-400">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
          <p>Loading categories…</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Couldn&apos;t load categories</p>
            <p className="text-sm opacity-90">{(error as Error)?.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-[#3f7a55]">
            <Tags className="h-6 w-6" />
          </span>
          <p className="font-semibold text-gray-900">No categories yet</p>
          <p className="max-w-sm text-sm text-gray-500">Create one so products can be grouped for shoppers, e.g. Goat Parts or Bundles.</p>
          <Button onClick={() => openSheet(null)} className="mt-2 bg-[#3f7a55] hover:bg-[#2d583d]">
            <Plus className="mr-1.5 h-4 w-4" /> New category
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories"
                className="pl-9"
                aria-label="Search categories"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Category</th>
                  <th className="hidden px-5 py-3 md:table-cell">Description</th>
                  <th className="px-5 py-3 text-right">Products</th>
                  <th className="px-5 py-3">In store</th>
                  <th className="px-5 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className={`hover:bg-green-50/40 ${c.is_active ? "" : "text-gray-400"}`}>
                    <td className="px-5 py-3.5">
                      <button onClick={() => openSheet(c)} className="text-left">
                        <p className={`font-medium ${c.is_active ? "text-gray-900" : "text-gray-500"} hover:text-[#3f7a55]`}>{c.name}</p>
                        <p className="font-mono text-xs text-gray-400">/{c.slug}</p>
                      </button>
                    </td>
                    <td className="hidden max-w-xs truncate px-5 py-3.5 text-gray-500 md:table-cell">
                      {c.description || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {c.product_count > 0 ? (
                        <Link href="/admin/products" className="font-semibold text-gray-900 hover:text-[#3f7a55]">
                          {c.product_count}
                        </Link>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={c.is_active}
                          disabled={toggle.isPending && toggle.variables?.id === c.id}
                          onCheckedChange={() => toggle.mutate(c)}
                          aria-label={`${c.is_active ? "Hide" : "Show"} ${c.name} in the store`}
                        />
                        <span className="text-xs">{c.is_active ? "Visible" : "Hidden"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openSheet(c)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      No categories match &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CategoryFormSheet
        key={sheetKey}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={editing}
        saving={save.isPending}
        error={formError}
        onSubmit={(values) => {
          setFormError(null);
          save.mutate(values);
        }}
        onDelete={setConfirmDelete}
      />

      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {confirmDelete?.name}?</DialogTitle>
            <DialogDescription>
              It will be removed permanently. No products use it, so nothing else changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Keep it
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={remove.isPending}
              onClick={() => confirmDelete && remove.mutate(confirmDelete)}
            >
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
