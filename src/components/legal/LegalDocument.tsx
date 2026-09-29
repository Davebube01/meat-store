import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLegalPage, type LegalSlug } from "@/core/api/user/pages";
import { LegalText } from "./LegalText";
import { parseLegal } from "./parseLegal";

const OTHER: Record<LegalSlug, { href: string; label: string }> = {
  terms: { href: "/privacy", label: "Privacy policy" },
  privacy: { href: "/terms", label: "Terms of service" },
};

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });

/** The Terms and Privacy pages: the store's text, with a contents list. */
export async function LegalDocument({ slug, fallbackTitle }: { slug: LegalSlug; fallbackTitle: string }) {
  const page = await getLegalPage(slug).catch(() => null);
  const blocks = page ? parseLegal(page.body) : [];
  const headings = blocks.filter((b) => b.kind === "heading");
  const other = OTHER[slug];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="border-b border-[#f0e6da] bg-[#FFF8F1]">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Legal</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">{page?.title ?? fallbackTitle}</h1>
            {page && <p className="mt-2 text-sm text-gray-500">Last updated {longDate(page.updated_at)}</p>}
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14">
          {page ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
              {headings.length > 2 && (
                <nav aria-label="On this page" className="hidden lg:block">
                  <div className="sticky top-32">
                    <p className="px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">On this page</p>
                    <ul className="mt-2 space-y-0.5">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a href={`#${h.id}`} className="block rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-[#f4f7f5] hover:text-[#2d583d]">{h.text}</a>
                        </li>
                      ))}
                    </ul>
                    <Link href={other.href} className="mt-6 flex items-center gap-1.5 px-3 text-sm font-medium text-[#3f7a55] hover:underline">
                      {other.label} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </nav>
              )}
              <article className="max-w-2xl">
                <LegalText blocks={blocks} />
                <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-200 pt-6 text-sm">
                  <span className="text-gray-500">Questions about this page?</span>
                  <Link href="/contact" className="font-semibold text-[#3f7a55] hover:underline">Contact us</Link>
                  <Link href={other.href} className="font-semibold text-[#3f7a55] hover:underline lg:hidden">{other.label}</Link>
                </div>
              </article>
            </div>
          ) : (
            <p className="rounded-2xl bg-[#f4f7f5] p-6 text-gray-600">
              We couldn&apos;t load this page just now. Please try again in a moment, or <Link href="/contact" className="font-semibold text-[#3f7a55] hover:underline">contact us</Link>.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
