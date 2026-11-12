"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const urlError = searchParams.get("error")

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(
    urlError ? "Autentikasi gagal atau sesi telah kedaluwarsa." : null
  )

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true)
    setAuthError(null)
    try {
      await signIn(provider, { callbackUrl })
    } catch {
      setAuthError("Gagal menginisiasi login pihak ketiga.")
      setIsLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (res?.error) {
        setAuthError("Email atau kata sandi tidak valid. Silakan coba lagi.")
        setIsLoading(false)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setAuthError("Terjadi kesalahan jaringan saat mencoba masuk.")
      setIsLoading(false)
    }
  }

  const fillQuickRole = (roleEmail: string) => {
    setEmail(roleEmail)
    setPassword("pasak@admin123")
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative rounded-base border-2 border-border bg-background p-6 shadow-[6px_6px_0px_0px_var(--border)] sm:p-8">
        {/* Header */}
        <div className="space-y-3 pb-6 text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-card shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5">
              <Image
                src="/icon.png"
                alt="Pasak Suite Icon"
                width={56}
                height={56}
                className="size-full object-contain p-1"
                priority
              />
            </div>
          </Link>
          <div>
            <Badge
              variant="outline"
              className="border-2 border-border bg-main font-mono text-[11px] font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
            >
              SOC CONSOLE ACCESS
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Masuk ke Pasak Suite
          </h1>
          <p className="text-xs text-foreground/75">
            Pusat kendali pertahanan web Laravel, daemon Sentinel, & kontrol
            kluster.
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 stroke-[2.5]" />
            <span className="font-medium">{authError}</span>
          </div>
        )}

        {/* Quick OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleOAuthSignIn("google")}
            className="inline-flex w-full items-center justify-center gap-3 rounded-base border-2 border-border bg-background px-4 py-2.5 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <GoogleIcon />
            <span>Masuk dengan Google</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleOAuthSignIn("github")}
            className="inline-flex w-full items-center justify-center gap-3 rounded-base border-2 border-border bg-secondary-background px-4 py-2.5 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <GitHubIcon />
            <span>Masuk dengan GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-border/40" />
          </div>
          <span className="relative bg-background px-3 font-mono text-[10px] font-bold tracking-wider text-foreground/60 uppercase">
            Atau dengan Akun SOC
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
              <Mail className="size-3 text-main" />
              <span>Email Operator</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@organisasi.id"
              className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-main focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
                <Lock className="size-3 text-main" />
                <span>Kata Sandi</span>
              </label>
              <span className="font-mono text-[10px] text-foreground/60">
                min. 8 karakter
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-main focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2.5 font-heading text-sm font-black text-main-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memverifikasi Autentikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Konsol</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Pills (Superadmin, Admin, Support, Teknis, User) */}
        <div className="mt-6 rounded-base border-2 border-dashed border-border/80 bg-secondary-background/60 p-3">
          <p className="mb-2 font-mono text-[10px] font-bold text-foreground/70 uppercase">
            ⚡ Quick-Test Demo Akun (Pilih Peran):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              {
                role: "Superadmin",
                email: "superadmin@pasak.id",
                bg: "bg-red-500 text-white",
              },
              {
                role: "Admin",
                email: "admin@pasak.id",
                bg: "bg-main text-main-foreground",
              },
              {
                role: "Support",
                email: "support@pasak.id",
                bg: "bg-emerald-500 text-white",
              },
              {
                role: "Teknis",
                email: "teknis@pasak.id",
                bg: "bg-sky-500 text-white",
              },
              {
                role: "User",
                email: "user@pasak.id",
                bg: "bg-background text-foreground",
              },
            ].map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => fillQuickRole(p.email)}
                className={`rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] font-bold shadow-[1px_1px_0px_0px_var(--border)] hover:opacity-85 ${p.bg}`}
              >
                {p.role}
              </button>
            ))}
          </div>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center">
          <p className="text-xs text-foreground/75">
            Belum memiliki kredensial akses?{" "}
            <Link
              href="/register"
              className="font-bold text-main underline underline-offset-4 hover:text-main/80"
            >
              Daftar akun baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="size-6 animate-spin text-main" />
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  )
}
