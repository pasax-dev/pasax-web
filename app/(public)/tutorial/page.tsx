import type { Metadata } from "next"
import { createMetadata } from "@/lib/metadata"
import { TutorialClient } from "./_components/tutorial-client"

export const metadata: Metadata = createMetadata({
  title: "Tutorial Tahap Demi Tahap | Pasax Security Suite",
  description:
    "Panduan langkah demi langkah mulai dari pendaftaran akun Free Trial 14 Hari, instalasi agen Sentinel di VPS Linux, integrasi WAF Laravel, Web Terminal SSH, hingga delegasi tim.",
})

export default function TutorialPage() {
  return <TutorialClient />
}
