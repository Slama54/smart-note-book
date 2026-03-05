import { Providers } from "@/components/providers"
import type { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
      
                <Providers>{children}</Providers>
        
    )
}