"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";
import { restoreSession } from "@/core/api/client";
import "react-toastify/dist/ReactToastify.css";

export function CoreProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      }),
  );

  // After a full page load the access token (memory-only) is gone but the
  // "signed in" hint may remain: get a fresh token from the refresh cookie, which
  // also refreshes the user's profile (e.g. email_verified).
  useEffect(() => {
    void restoreSession("customer");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        theme="colored"
      />
    </QueryClientProvider>
  );
}
