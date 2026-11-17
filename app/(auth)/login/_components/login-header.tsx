import Link from "next/link"
import Image from "next/image"

export function LoginHeader() {
  return (
    <div className="relative z-10 space-y-3 pb-6 text-center">
      <Link href="/" className="inline-flex items-center justify-center">
        <div className="flex size-14 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-background shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5">
          <Image
            src="/icon.png"
            alt="Pasax Suite Icon"
            width={56}
            height={56}
            className="size-full object-contain p-1"
            priority
          />
        </div>
      </Link>
      <div>
        <span className="inline-block -rotate-1 rounded-base border-2 border-border bg-main px-3 py-0.5 font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_var(--border)]">
          SOC CONSOLE ACCESS
        </span>
      </div>
      <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
        Masuk ke Pasax Suite
      </h1>
      <p className="text-xs font-medium text-foreground sm:text-sm">
        Pusat kendali pertahanan web Laravel, daemon Sentinel, & kontrol kluster.
      </p>
    </div>
  )
}
