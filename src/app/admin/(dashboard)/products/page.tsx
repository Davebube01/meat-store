import { ProductList } from "@/components/admin/products/ProductList";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store's products inventory.
          </p>
        </div>
        <Link href="/admin/products/create">
          <Button className="bg-amber-900 hover:bg-amber-900/90 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  );
}
