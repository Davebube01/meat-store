/**
 * A tiny, safe formatter for the Terms and Privacy text (edited in admin
 * Settings). Only these are understood; everything else is plain text, and
 * nothing is ever inserted as HTML:
 *
 *   ## Heading
 *   - bullet
 *   **bold**   [link text](/path | mailto:… | https://…)
 *
 * Blank lines separate paragraphs; consecutive lines join into one.
 */

export type Inline = { kind: "text" | "bold"; text: string } | { kind: "link"; text: string; href: string };

export type Block =
  | { kind: "heading"; id: string; text: string }
  | { kind: "paragraph"; inlines: Inline[] }
  | { kind: "list"; items: Inline[][] };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

const safeHref = (href: string) => /^(\/(?!\/)|mailto:|https:\/\/)/.test(href);

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ kind: "text", text: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: "bold", text: m[1] });
    else if (safeHref(m[3])) out.push({ kind: "link", text: m[2], href: m[3] });
    else out.push({ kind: "text", text: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

export function parseLegal(body: string): Block[] {
  const blocks: Block[] = [];
  const used = new Map<string, number>();
  let para: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (para.length) blocks.push({ kind: "paragraph", inlines: parseInline(para.join(" ")) });
    if (list) blocks.push({ kind: "list", items: list.map(parseInline) });
    para = [];
    list = null;
  };

  for (const raw of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith("## ")) {
      flush();
      const text = line.slice(3).trim();
      const base = slugify(text);
      const n = used.get(base) ?? 0;
      used.set(base, n + 1);
      blocks.push({ kind: "heading", id: n ? `${base}-${n + 1}` : base, text });
    } else if (/^[-*] /.test(line)) {
      if (para.length) {
        blocks.push({ kind: "paragraph", inlines: parseInline(para.join(" ")) });
        para = [];
      }
      (list ??= []).push(line.slice(2).trim());
    } else {
      if (list) {
        blocks.push({ kind: "list", items: list.map(parseInline) });
        list = null;
      }
      para.push(line);
    }
  }
  flush();
  return blocks;
}
