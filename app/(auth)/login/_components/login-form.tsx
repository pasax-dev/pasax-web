"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"
import { OAuthButtons } from "./oauth-buttons"
import { DemoRoles } from "./demo-roles"

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const urlError = searchParams.get("error")

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(
    urlError ? "Autentikasi gagal atau sesi telah kedaluwarsa." : null
  )

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

  const handleRoleSelect = (roleEmail: string) => {
    setEmail(roleEmail)
    setPassword("pasax@admin123")
  }

  return (
    <>
      {/* Error Alert */}
      {authError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-destructive/15 p-3 font-mono text-xs font-bold text-destructive shadow-[2px_2px_0px_0px_var(--border)]">
          <AlertCircle className="size-4 shrink-0 stroke-[2.5]" />
          <span>{authError}</span>
        </div>
      )}

      {/* Quick OAuth Buttons */}
      <OAuthButtons
        callbackUrl={callbackUrl}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onError={setAuthError}
      />

      {/* Divider */}
      <div className="relative my-6 text-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-border" />
        </div>
        <span className="relative rounded-sm border border-border bg-card px-2.5 py-0.5 font-mono text-[10px] font-black tracking-wider text-foreground uppercase shadow-[1px_1px_0px_0px_var(--border)]">
          Atau dengan Akun Operator
        </span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="relative z-10 space-y-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
            <Mail className="size-3.5 text-foreground" />
            <span>Email Operator</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@organisasi.id"
            className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black text-foreground uppercase">
              <Lock className="size-3.5 text-foreground" />
              <span>Kata Sandi</span>
            </label>
            <span className="font-mono text-[10px] font-bold text-foreground">
              min. 8 karakter
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-base border-2 border-border bg-secondary-background py-2 pr-9 pl-3 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] placeholder:text-foreground/50 focus:ring-2 focus:ring-main focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-foreground hover:opacity-75"
              title={
                showPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2.5 font-heading text-sm font-black text-black shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin text-black" />
              <span>Memverifikasi Autentikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Konsol SOC</span>
              <ArrowRight className="size-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Demo Fast Fill Pills */}
      <DemoRoles onSelectRole={handleRoleSelect} />

      {/* Link to Register */}
      <div className="relative z-10 mt-6 text-center">
        <p className="text-xs font-medium text-foreground">
          Belum memiliki kredensial akses?{" "}
          <Link
            href="/register"
            className="rounded-sm px-1 py-0.5 font-black text-foreground underline decoration-main decoration-3 underline-offset-4 transition-all hover:bg-main hover:text-black hover:no-underline"
          >
            Daftar akun baru
          </Link>
        </p>
      </div>
    </>
  )
}

export function LoginForm() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="size-6 animate-spin text-main" />
        </div>
      }
    >
      <LoginFormInner />
    </React.Suspense>
  )
}
