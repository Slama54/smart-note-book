import { Providers } from "@/components/providers";
import { AuthGuard } from "@/components/AuthGuard";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
      
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      
    
  );
}
