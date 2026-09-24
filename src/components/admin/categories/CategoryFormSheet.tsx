"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify, type AdminCategory, type CategoryInput } from "@/core/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = creating a new category */
  category: AdminCategory | null;
  saving: boolean;
  error: string | null;
  onSubmit: (values: CategoryInput) => void;
  onDelete: (category: AdminCategory) => void;
}

const EMPTY: CategoryInput = { name: "", slug: "", description: "", is_active: true };

export function CategoryFormSheet({ open, onOpenChange, category, saving, error, onSubmit, onDelete }: Props) {
  // The parent remounts this (new `key`) each time it opens, so the form
  // starts from the category being edited, or empty for a new one.
  const [values, setValues] = useState<CategoryInput>(() =>
    category
      ? { name: category.name, slug: category.slug, description: category.description ?? "", is_active: category.is_active }
      : EMPTY,
  );
  // While creating, the slug follows the name until the admin edits it by hand.
  const [slugTouched, setSlugTouched] = useState(!!category);

  const slugChanged = !!category && slugify(values.slug) !== category.slug;
  const canSave = values.name.trim().length >= 2 && slugify(values.slug).length >= 2 && !saving;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-gray-100 p-6">
          <SheetTitle className="font-serif text-xl">{category ? "Edit category" : "New category"}</SheetTitle>
          <SheetDescription>
            {category
              ? `${category.product_count} product${category.product_count === 1 ? "" : "s"} in this category`
              : "Group products so customers can browse them together."}
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSave)
              onSubmit({ ...values, name: values.name.trim(), slug: slugify(values.slug), description: values.description?.trim() || null });
          }}
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                autoFocus
                value={values.name}
                maxLength={60}
                placeholder="e.g. Goat Parts"
                onChange={(e) => {
                  const name = e.target.value;
                  setValues((v) => ({ ...v, name, slug: slugTouched ? v.slug : slugify(name) }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={values.slug}
                maxLength={60}
                className="font-mono text-sm"
                placeholder="goat-parts"
                onChange={(e) => {
                  setSlugTouched(true);
                  // Keep a trailing hyphen while typing; it's trimmed on save.
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-{2,}/g, "-");
                  setValues((v) => ({ ...v, slug }));
                }}
              />
              <p className="text-xs text-gray-500">
                {slugChanged && category!.product_count > 0
                  ? `The ${category!.product_count} product${category!.product_count === 1 ? "" : "s"} in this category will move to the new slug automatically.`
                  : "Used in links and to file products. Lower-case letters, numbers and hyphens."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-desc">
                Description <span className="font-normal text-gray-400">(optional)</span>
              </Label>
              <Textarea
                id="cat-desc"
                rows={3}
                maxLength={300}
                value={values.description ?? ""}
                placeholder="Specific cuts: legs, ribs, head, organs"
                onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4">
              <div>
                <Label htmlFor="cat-active" className="text-sm font-medium">Show in store</Label>
                <p className="mt-1 text-xs text-gray-500">
                  Inactive categories are hidden from shoppers. Their products stay as they are.
                </p>
              </div>
              <Switch
                id="cat-active"
                checked={values.is_active}
                onCheckedChange={(is_active) => setValues((v) => ({ ...v, is_active }))}
              />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            {category && (
              <div className="rounded-xl border border-red-100 p-4">
                <p className="text-sm font-medium text-gray-900">Delete category</p>
                <p className="mt-1 text-xs text-gray-500">
                  {category.product_count > 0
                    ? "Move its products to another category first, or switch it off above instead."
                    : "This can't be undone."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={category.product_count > 0}
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" /> Delete category
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 p-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave} className="bg-[#3f7a55] hover:bg-[#2d583d]">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? "Save changes" : "Create category"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
