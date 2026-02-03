import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-9xl font-black text-amber-900/10">404</h1>
      <div className="absolute flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-amber-900">
          Page not found
        </h2>
        <p className="text-muted-foreground max-w-[500px]">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been removed, renamed, or doesn&apos;t exist.
        </p>
        <Button asChild className="mt-4" variant="default">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
