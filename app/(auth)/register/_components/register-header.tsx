import Link from "next/link"
import Image from "next/image"
import { UserCheck, Sparkles } from "lucide-react"

export function RegisterHeader() {
  return (
    <div className="relative z-10 space-y-4 pb-6 text-center">
      <div className="flex items-center justify-center">
        <Link
          href="/"
          className="group relative flex size-14 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-background shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)]"
        >
          <Image
            src="/icon.png"
            alt="Pasax Suite Logo"
            width={56}
            height={56}
            className="size-full object-contain p-1"
            priority
          />
          <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-border bg-emerald-400" />
        </Link>
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-emerald-400/20 px-3 py-0.5 font-mono text-[10px] font-black tracking-wider text-foreground uppercase shadow-[2px_2px_0px_0px_var(--border)]">
        <UserCheck className="size-3 text-emerald-500" />
        <span>New Node Operator Onboarding</span>
        <Sparkles className="size-2.5 text-emerald-500" />
      </div>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Registrasi Akun Baru
        </h1>
        <p className="font-sans text-xs font-semibold text-muted-foreground sm:text-sm">
          Daftarkan instansi atau operator Anda untuk memonitor kluster server Pasax.
        </p>
      </div>
    </div>
  )
}
