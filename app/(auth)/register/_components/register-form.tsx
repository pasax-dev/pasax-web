"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
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
} from "lucide-react"
import { OAuthButtons } from "./oauth-buttons"

export function RegisterForm() {
  const router = useRouter()

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
    <>
      {/* Success Alert */}
      {success && (
        <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-emerald-500/20 p-3 font-mono text-xs font-black text-emerald-700 shadow-[2px_2px_0px_0px_var(--border)] dark:text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0 stroke-[2.5]" />
          <span>Akun berhasil didaftarkan! Mengarahkan ke Dashboard...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-destructive/15 p-3 font-mono text-xs font-bold text-destructive shadow-[2px_2px_0px_0px_var(--border)]">
          <AlertCircle className="size-4 shrink-0 stroke-[2.5]" />
          <span>{error}</span>
        </div>
      )}

      {/* OAuth Buttons */}
      <OAuthButtons
        isLoading={isLoading}
        disabled={success}
        setIsLoading={setIsLoading}
        onError={setError}
      />

      {/* Divider */}
      <div className="relative my-6 text-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-border" />
        </div>
        <span className="relative rounded-sm border border-border bg-card px-2.5 py-0.5 font-mono text-[10px] font-black tracking-wider text-foreground uppercase shadow-[1px_1px_0px_0px_var(--border)]">
          Atau Isi Formulir Operator
        </span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="relative z-10 space-y-3.5">
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
            <User className="size-3.5 text-foreground" />
            <span>Nama Lengkap</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Pratama Satria"
            className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
            <Building2 className="size-3.5 text-foreground" />
            <span>Instansi / Lembaga</span>
          </label>
          <input
            type="text"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Contoh: Diskominfo / PT Siber Nusantara"
            className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
            <Mail className="size-3.5 text-foreground" />
            <span>Email Resmi</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@instansi.go.id"
            className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
              <Lock className="size-3.5 text-foreground" />
              <span>Kata Sandi</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-base border-2 border-border bg-secondary-background py-2 pr-8 pl-3 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground hover:opacity-75"
                title={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
              <Lock className="size-3.5 text-foreground" />
              <span>Ulangi Sandi</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-base border-2 border-border bg-secondary-background py-2 pr-8 pl-3 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground hover:opacity-75"
                title={
                  showConfirmPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2.5 font-heading text-sm font-black text-black shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin text-black" />
              <span>Memproses Registrasi...</span>
            </>
          ) : (
            <>
              <span>Daftar & Masuk Otomatis</span>
              <ArrowRight className="size-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Link to Login */}
      <div className="relative z-10 mt-6 text-center">
        <p className="text-xs font-medium text-foreground">
          Sudah memiliki akun terdaftar?{" "}
          <Link
            href="/login"
            className="rounded-sm px-1 py-0.5 font-black text-foreground underline decoration-main decoration-3 underline-offset-4 transition-all hover:bg-main hover:text-black hover:no-underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </>
  )
}
