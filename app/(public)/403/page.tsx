import { ForbiddenView } from "@/components/errors/forbidden-view"

export const metadata = {
  title: "403 Akses Ditolak — Pasak Defense Shield",
  description: "Akses dihentikan oleh modul WAF pasak-security-monitor atau Sentinel daemon.",
}

export default function Public403Page() {
  return <ForbiddenView />
}
