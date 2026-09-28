"use client";

import { useState } from "react";
import { CheckCircle2, Copy, TriangleAlert } from "lucide-react";
import type { PaymentStatus } from "@/core/api";

export function PaymentsCard({ status }: { status: PaymentStatus }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Paystack</h2>
            <p className="mt-1 text-sm text-gray-500">Card, bank transfer and USSD payments for orders.</p>
          </div>
          {status.configured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              <TriangleAlert className="h-3.5 w-3.5" /> Not connected
            </span>
          )}
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Mode</dt>
            <dd className="mt-1.5">
              {status.mode === "live" ? (
                <span className="rounded-md bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-800">Live: real payments</span>
              ) : status.mode === "test" ? (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-800">Test: no real money moves</span>
              ) : (
                <span className="text-sm text-gray-500">—</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Public key</dt>
            <dd className="mt-1.5 font-mono text-sm text-gray-700">{status.public_key_hint ?? "Not set"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Webhook URL</dt>
            <dd className="mt-1.5 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{status.webhook_url}</code>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(status.webhook_url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {
                    // clipboard blocked: the URL is visible to copy by hand
                  }
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
              </button>
            </dd>
            <p className="mt-2 text-xs text-gray-500">
              Paste this into Paystack → Settings → API Keys &amp; Webhooks, so orders are marked paid automatically.
            </p>
          </div>
        </dl>
      </section>

      <p className="text-xs text-gray-500">
        Keys are set in the server&apos;s environment (<code className="font-mono">PAYSTACK_SECRET_KEY</code>,{" "}
        <code className="font-mono">PAYSTACK_PUBLIC_KEY</code>), not here, so they never pass through the browser.
      </p>
    </div>
  );
}
