import { Truck, ShieldCheck, Clock, Leaf } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Delivered on your schedule",
    description: "Pick the day and the 1-hour slot that suits you, anywhere in our Abuja delivery zones.",
  },
  {
    icon: ShieldCheck,
    title: "Quality guaranteed",
    description: "We source only healthy, premium goats from trusted local farms.",
  },
  {
    icon: Clock,
    title: "Fresh daily",
    description: "Everything is handled daily to give you the best quality.",
  },
  {
    icon: Leaf,
    title: "100% natural",
    description: "No preservatives or chemicals. Just pure, natural, grass-fed goat meat.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">Why Everything Fresh</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
            Fresh food you can trust, every day
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-gray-200 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f7f5] text-[#3f7a55]">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
