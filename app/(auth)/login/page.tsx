import type { Metadata } from "next"
import { LoginHeader } from "./_components/login-header"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Masuk ke Pasax Suite — SOC Console Access",
  description:
    "Pusat kendali pertahanan web Laravel, daemon Sentinel, dan kluster server Pasax Suite.",
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] sm:p-8">
        {/* Neobrutalist Corner Decorative Stamps */}
        <div className="pointer-events-none absolute -top-3 -right-3 font-mono text-5xl font-black text-foreground/5 select-none">
          ✦
        </div>
        <div className="pointer-events-none absolute -bottom-5 -left-3 font-mono text-6xl font-black text-foreground/5 select-none">
          ✱
        </div>

        {/* Header (Server Component) */}
        <LoginHeader />

        {/* Form & Actions (Client Component with Suspense) */}
        <LoginForm />
      </div>
    </div>
  )
}
