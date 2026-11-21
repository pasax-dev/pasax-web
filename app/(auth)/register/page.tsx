import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { RegisterHeader } from "./_components/register-header"
import { RegisterForm } from "./_components/register-form"

export const metadata: Metadata = {
  title: "Registrasi Operator Baru — Pasax Suite",
  description:
    "Daftarkan instansi atau operator Anda untuk memonitor kluster server dan pertahanan siber Pasax Suite.",
}

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full max-w-lg">
      <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-6 shadow-[8px_8px_0px_0px_var(--border)] transition-all sm:p-8">
        {/* Subtle Tech Watermark Background */}
        <div className="pointer-events-none absolute -top-8 -right-8 font-mono text-8xl font-black text-foreground/[0.03] select-none">
          REG
        </div>
        <div className="pointer-events-none absolute -bottom-10 -left-6 font-mono text-8xl font-black text-foreground/[0.03] select-none">
          NODE
        </div>

        {/* Top Tactical Status Pin */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-border/70 pb-3 font-mono text-[10px] font-black text-muted-foreground uppercase">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            NODE ENROLLMENT ACTIVE
          </span>
          <span>TIER: FLEET</span>
        </div>

        {/* Header */}
        <RegisterHeader />

        {/* Form & Actions */}
        <RegisterForm />
      </div>
    </div>
  )
}
