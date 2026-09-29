import Link from "next/link";
import type { Block, Inline } from "./parseLegal";

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.kind === "bold" ? (
          <strong key={i} className="font-semibold text-gray-900">{p.text}</strong>
        ) : p.kind === "link" ? (
          p.href.startsWith("/") ? (
            <Link key={i} href={p.href} className="font-medium text-[#3f7a55] underline decoration-[#3f7a55]/30 underline-offset-2 hover:decoration-[#3f7a55]">{p.text}</Link>
          ) : (
            <a key={i} href={p.href} rel="noreferrer" target={p.href.startsWith("https") ? "_blank" : undefined} className="font-medium text-[#3f7a55] underline decoration-[#3f7a55]/30 underline-offset-2 hover:decoration-[#3f7a55]">{p.text}</a>
          )
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/** Renders parsed legal text. Shared by the storefront pages and the admin preview. */
export function LegalText({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[15px] leading-relaxed text-gray-700">
      {blocks.map((b, i) =>
        b.kind === "heading" ? (
          <h2 key={i} id={b.id} className="mb-3 mt-10 scroll-mt-32 font-serif text-2xl font-semibold text-[#1a1a1a] first:mt-0">{b.text}</h2>
        ) : b.kind === "list" ? (
          <ul key={i} className="my-4 space-y-2 pl-1">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f7a55]" />
                <span><Inlines parts={item} /></span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-4"><Inlines parts={b.inlines} /></p>
        ),
      )}
    </div>
  );
}
