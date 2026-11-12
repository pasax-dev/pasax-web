import { ForbiddenView } from "@/components/errors/forbidden-view"

export const metadata = {
  title: "403 Dilarang — Pasak Defense Suite",
  description: "Akses dihentikan oleh modul WAF pasak-security-monitor atau Sentinel daemon.",
}

export default function ForbiddenPage() {
  return <ForbiddenView />
}
