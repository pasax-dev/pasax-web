import { ForbiddenView } from "@/components/errors/forbidden-view"

export const metadata = {
  title: "403 Dilarang — Pasax Defense Suite",
  description: "Akses dihentikan oleh modul WAF pasax-secure-monitor atau Sentinel daemon.",
}

export default function ForbiddenPage() {
  return <ForbiddenView />
}
