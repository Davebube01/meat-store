import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Adebayo",
    role: "Home Chef",
    content:
      "The quality of the goat meat is exceptional. It was perfectly cleaned and cut exactly how I wanted. Delivered right on time for my dinner party!",
    rating: 5,
  },
  {
    id: 2,
    name: "Musa Ibrahim",
    role: "Restaurant Owner",
    content:
      "I've been sourcing meat for my restaurant from here for months. Consistency and freshness are always 10/10. Highly recommended for bulk orders.",
    rating: 5,
  },
  {
    id: 3,
    name: "Chioma Okeke",
    role: "Loyal Customer",
    content:
      "Finally, a reliable online meat store in Abuja! The ordering process is so smooth, and the customer service is top-notch. Love the packaging too.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-[#FFF8F1]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-serif tracking-tight text-[#1a1a1a] md:text-4xl mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what our happy customers
            have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-8 right-8 h-8 w-8 text-orange-100" />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-orange-400"
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold text-[#1a1a1a]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
