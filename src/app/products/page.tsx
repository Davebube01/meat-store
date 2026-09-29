import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductList } from "./ProductList";
import { SORTS, type ListState } from "./listState";
import { getCategories, getProducts } from "@/core/api";

export const metadata = {
  title: "Shop | Everything Fresh",
  description: "Fresh goat meat, cuts, bundles and market produce, delivered across Abuja.",
};

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [products, categories, params] = await Promise.all([getProducts(), getCategories(), searchParams]);

  // Filters live in the URL (?category=&q=&sort=&stock=1), so links and the
  // back button bring you to the same view.
  const category = one(params.category);
  const sort = one(params.sort);
  const initial: ListState = {
    category: categories.some((c) => c.slug === category) ? category! : "all",
    q: one(params.q) ?? "",
    sort: SORTS.some((s) => s.key === sort) ? (sort as ListState["sort"]) : "featured",
    inStock: one(params.stock) === "1",
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 bg-[#FFF8F1]">
        <ProductList products={products} categories={categories} initial={initial} />
      </main>
      <Footer />
    </div>
  );
}
