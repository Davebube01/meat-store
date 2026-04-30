import { ProductForm } from "@/components/admin/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Create Product
        </h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
