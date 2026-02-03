import { Truck, ShieldCheck, Clock, Leaf } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your fresh meet delivered to your doorstep within 24 hours in Abuja.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description:
      "We source only the healthiest, premium goats from trusted local farms.",
  },
  {
    icon: Clock,
    title: "Fresh Daily",
    description:
      "Our meat is processed daily to ensure maximum freshness and flavor.",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "No preservatives or chemicals. Just pure, natural, grass-fed goat meat.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif tracking-tight text-[#1a1a1a] md:text-4xl mb-4">
            Why Choose Our Meat?
          </h2>
          <p className="text-lg text-gray-600">
            We take pride in providing the highest quality meat with exceptional
            service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FFF8F1] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-16 w-16 mb-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
