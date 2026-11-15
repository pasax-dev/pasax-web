"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  Shield,
  User,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
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

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [organization, setOrganization] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [role, setRole] = React.useState("User")

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleOAuthSignUp = async (provider: "google" | "github") => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch {
      setError("Gagal menghubungkan autentikasi pihak ketiga.")
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.")
      return
    }

    if (password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter.")
      return
    }

    setIsLoading(true)

    // Simulate registration & automatic login
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      })

      if (res?.error) {
        setError("Pendaftaran gagal. Silakan coba kembali.")
        setIsLoading(false)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1200)
      }
    } catch {
      setError("Terjadi kendala konektivitas saat mendaftar.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative rounded-base border-2 border-border bg-background p-6 shadow-[6px_6px_0px_0px_var(--border)] sm:p-8">
        {/* Header */}
        <div className="space-y-2 text-center pb-6">
          <Badge
            variant="outline"
            className="border-2 border-border bg-emerald-500 font-mono text-[11px] font-black text-white shadow-[2px_2px_0px_0px_var(--border)]"
          >
            NEW OPERATOR ONBOARDING
          </Badge>
          <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Registrasi Akun Baru
          </h1>
          <p className="text-xs text-foreground/75">
            Daftarkan instansi atau operator Anda untuk memonitor kluster server Pasax.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-emerald-500/15 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0 stroke-[2.5]" />
            <span className="font-bold">
              Akun berhasil didaftarkan! Mengarahkan ke Dashboard...
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 stroke-[2.5]" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isLoading || success}
            onClick={() => handleOAuthSignUp("google")}
            className="inline-flex w-full items-center justify-center gap-3 rounded-base border-2 border-border bg-background px-4 py-2.5 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <GoogleIcon />
            <span>Daftar dengan Google</span>
          </button>

          <button
            type="button"
            disabled={isLoading || success}
            onClick={() => handleOAuthSignUp("github")}
            className="inline-flex w-full items-center justify-center gap-3 rounded-base border-2 border-border bg-secondary-background px-4 py-2.5 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <GitHubIcon />
            <span>Daftar dengan GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-border/40" />
          </div>
          <span className="relative bg-background px-3 font-mono text-[10px] font-bold tracking-wider text-foreground/60 uppercase">
            Atau Isi Formulir Operator
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
              <User className="size-3 text-main" />
              <span>Nama Lengkap</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pratama Satria"
              className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-main"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
              <Building2 className="size-3 text-main" />
              <span>Instansi / Lembaga</span>
            </label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Contoh: Diskominfo / PT Siber Nusantara"
              className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-main"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
              <Mail className="size-3 text-main" />
              <span>Email Resmi</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@instansi.go.id"
              className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-main"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
                <Lock className="size-3 text-main" />
                <span>Kata Sandi</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
                <Lock className="size-3 text-main" />
                <span>Ulangi Sandi</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2.5 font-heading text-sm font-black text-main-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memproses Registrasi...</span>
              </>
            ) : (
              <>
                <span>Daftar & Masuk Otomatis</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center">
          <p className="text-xs text-foreground/75">
            Sudah memiliki akun terdaftar?{" "}
            <Link
              href="/login"
              className="font-bold text-main underline underline-offset-4 hover:text-main/80"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
