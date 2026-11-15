import { ForbiddenView } from "@/components/errors/forbidden-view"

export const metadata = {
  title: "403 Akses Ditolak — Pasax Defense Shield",
  description: "Akses dihentikan oleh modul WAF pasax-secure-monitor atau Sentinel daemon.",
}

export default function Public403Page() {
  return <ForbiddenView />
}
