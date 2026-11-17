import type { Metadata } from "next"
import { RegisterHeader } from "./_components/register-header"
import { RegisterForm } from "./_components/register-form"

export const metadata: Metadata = {
  title: "Registrasi Operator Baru — Pasax Suite",
  description:
    "Daftarkan instansi atau operator Anda untuk memonitor kluster server dan pertahanan siber Pasax Suite.",
}

export default function RegisterPage() {
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
        <RegisterHeader />

        {/* Form & Actions (Client Component) */}
        <RegisterForm />
      </div>
    </div>
  )
}
