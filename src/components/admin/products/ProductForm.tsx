"use client";

import { Product } from "@/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProduct, updateProduct } from "@/lib/api";

// Simple Select implementation since shadcn Select might be missing/complex to setup without cli
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      slug: "",
      price: 0,
      description: "",
      imageUrl: "",
      category: "full",
      weightOptions: [],
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as Product["category"],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedProduct: Product | undefined;

      if (initialData) {
        savedProduct = await updateProduct(initialData.slug, formData);
      } else {
        // Auto-generate slug from name if empty
        const submissionData = { ...formData };
        if (!submissionData.slug && submissionData.name) {
          submissionData.slug = submissionData.name
            .toLowerCase()
            .replace(/ /g, "-");
        }
        // Default weight options if empty
        if (
          !submissionData.weightOptions ||
          submissionData.weightOptions.length === 0
        ) {
          submissionData.weightOptions = ["1kg"];
        }

        savedProduct = await createProduct(
          submissionData as Omit<Product, "id">,
        );
      }

      if (savedProduct) {
        router.push(`/admin/products/${savedProduct.slug}`);
        router.refresh();
      } else {
        // Fallback if something went wrong or no product returned
        router.push("/admin/products");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Full Goat"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price (₦)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            {/* Fallback to native select if UI select is troublesome, but trying shadcn select first */}
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="full">Full</option>
              <option value="part">Part</option>
              <option value="kg">Per Kg</option>
            </select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (URL friendly name)</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Auto-generated if left blank"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-amber-900 hover:bg-amber-900/90"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
