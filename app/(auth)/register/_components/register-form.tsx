"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import {
  User,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react"
import { OAuthButtons } from "./oauth-buttons"

export function RegisterForm() {
  const router = useRouter()
  const { status } = useSession()

  const [name, setName] = React.useState("")
  const [organization, setOrganization] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard")
    }
  }, [status, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.")
      return
    }

    if (password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter demi standar keamanan SOC.")
      return
    }

    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      })

      if (res?.error) {
        setError("Registrasi gagal. Format data tidak valid atau email telah terdaftar.")
        setIsLoading(false)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1200)
      }
    } catch {
      setError("Terjadi kegagalan komunikasi dengan cluster auth gateway.")
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-base border-2 border-destructive bg-destructive/10 p-3 font-mono text-xs font-bold text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-base border-2 border-emerald-500 bg-emerald-500/10 p-3 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Pendaftaran berhasil! Mengalihkan ke Konsol SOC Armada...</span>
        </div>
      )}

      {/* OAuth Social Buttons (GitHub & Google) */}
      <OAuthButtons
        callbackUrl="/dashboard"
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onError={setError}
      />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 font-mono text-[10px] font-bold text-muted-foreground">
            Atau daftarkan node secara mandiri
          </span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
          >
            <User className="size-3.5 text-muted-foreground" />
            <span>Nama Lengkap Operator</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Indra Setiawan"
            required
            disabled={isLoading || success}
            className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-main focus:outline-hidden disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="org"
            className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
          >
            <Building2 className="size-3.5 text-muted-foreground" />
            <span>Instansi / Nama Kluster VPS</span>
          </label>
          <input
            id="org"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Misal: Diskominfo Daerah / Fintech Sandbox"
            required
            disabled={isLoading || success}
            className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-main focus:outline-hidden disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
          >
            <Mail className="size-3.5 text-muted-foreground" />
            <span>Email Resmi Operator</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@instansi.go.id"
            required
            disabled={isLoading || success}
            className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-main focus:outline-hidden disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
            >
              <Lock className="size-3.5 text-muted-foreground" />
              <span>Kata Sandi Master</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading || success}
                className="w-full rounded-base border-2 border-border bg-background px-3 py-2 pr-10 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-main focus:outline-hidden disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
            >
              <Lock className="size-3.5 text-muted-foreground" />
              <span>Ulangi Sandi</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading || success}
                className="w-full rounded-base border-2 border-border bg-background px-3 py-2 pr-10 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-main focus:outline-hidden disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2.5 font-heading text-xs font-black text-black shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Mendaftarkan Node SOC...</span>
            </>
          ) : (
            <>
              <UserPlus className="size-4 stroke-[2.5]" />
              <span>Daftarkan Operator &amp; Amankan VPS</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center font-sans text-xs text-muted-foreground">
        Sudah memiliki akses operator SOC?{" "}
        <Link
          href="/login"
          className="font-bold text-foreground underline decoration-main underline-offset-4 hover:text-main"
        >
          Masuk ke Gerbang Utama
        </Link>
      </div>
    </>
  )
}
