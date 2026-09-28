import { CalendarClock, KeyRound, Scissors } from "lucide-react";

const steps = [
  {
    icon: Scissors,
    title: "Choose your cuts",
    body: "Pick the product, size and cut you want. Whole goats, parts or by the kilo.",
  },
  {
    icon: CalendarClock,
    title: "Pick a delivery slot",
    body: "Choose a date and a 1-hour window, or collect it yourself for free.",
  },
  {
    icon: KeyRound,
    title: "Pay, track and receive",
    body: "Pay securely online, follow your order, and give the courier your 4-digit PIN when it arrives.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-[#FFF8F1] py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3f7a55]">How it works</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
            From our butcher to your kitchen in three steps
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-[#f0e6da] bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f7f5] text-[#3f7a55]">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-serif text-4xl font-semibold text-[#e8dccd]">{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
