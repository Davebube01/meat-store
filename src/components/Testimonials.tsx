import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Adebayo",
    role: "Home chef",
    content: "Everything Fresh makes shopping so easy. I can choose my portions, and I trust the quality every time!",
    rating: 5,
  },
  {
    id: 2,
    name: "Musa Ibrahim",
    role: "Restaurant owner",
    content:
      "I've been sourcing meat for my restaurant from here for months. Consistency and freshness are always 10/10. Highly recommended for bulk orders.",
    rating: 5,
  },
  {
    id: 3,
    name: "Chioma Okeke",
    role: "Loyal customer",
    content:
      "Finally, a reliable online fresh food store in Abuja! Ordering is seamless, and everything arrives fresh and well-packaged. It saves me so much time.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#FFF8F1] py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Customers</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
            What our customers say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-2xl border border-[#f0e6da] bg-white p-6">
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-gray-700">&ldquo;{t.content}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcebe1] text-sm font-semibold text-[#2d583d]">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{t.name}</span>
                  <span className="text-xs text-gray-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
