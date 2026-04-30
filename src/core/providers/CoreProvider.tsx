"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";
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
