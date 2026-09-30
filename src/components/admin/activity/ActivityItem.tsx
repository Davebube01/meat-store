import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { ActivityEntry } from "@/core/api";
import { cn } from "@/lib/utils";
import { FALLBACK_ICON, ICONS, fieldLabel, show, timeOf } from "./format";

export function ActivityItem({ entry, onPerson }: { entry: ActivityEntry; onPerson: (id: string) => void }) {
  const Icon = ICONS[entry.entity_type] ?? FALLBACK_ICON;
  const changes = entry.changes ? Object.entries(entry.changes) : [];
  return (
    <li className={cn("flex gap-3 px-5 py-4", entry.flagged && "bg-amber-50/40")}>
      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", entry.flagged ? "bg-amber-100 text-amber-700" : "bg-gray-50 text-gray-500")}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-gray-900">
            {entry.link ? (
              <Link href={entry.link} className="group inline hover:text-[#2d583d]">
                {entry.summary}
                <ChevronRight className="ml-0.5 inline h-3.5 w-3.5 text-gray-300 group-hover:text-[#3f7a55]" />
              </Link>
            ) : entry.summary}
          </p>
          <span className="shrink-0 text-xs tabular-nums text-gray-400">{timeOf(entry.created_at)}</span>
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
          {entry.actor_id ? (
            <button type="button" onClick={() => onPerson(entry.actor_id!)} className="font-medium hover:text-[#2d583d] hover:underline" title="Show only this person">
              {entry.actor_name ?? "Unknown"}
            </button>
          ) : (
            <span>{entry.actor_name ?? "System"}</span>
          )}
          {entry.flagged && (
            <span className="inline-flex items-center gap-1 font-medium text-amber-700">
              <AlertTriangle className="h-3 w-3" /> Worth a look
            </span>
          )}
        </p>
        {changes.length > 0 && (
          <dl className="mt-2 grid gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs sm:grid-cols-[auto_1fr] sm:gap-x-4">
            {changes.map(([field, change]) => (
              <div key={field} className="contents">
                <dt className="font-medium text-gray-500">{fieldLabel(field, entry.entity_type)}</dt>
                <dd className="text-gray-700">
                  <span className="text-gray-400 line-through">{show(change.from)}</span> → {show(change.to)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
}
