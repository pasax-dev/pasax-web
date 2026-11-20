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
  KeyRound,
} from "lucide-react"
import { OAuthButtons } from "./oauth-buttons"

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

  return (
    <>
      {/* Error Alert */}
      {authError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-base border-2 border-border bg-destructive/15 p-3.5 font-mono text-xs font-bold text-destructive shadow-[3px_3px_0px_0px_var(--border)]">
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
          <div className="w-full border-t-2 border-dashed border-border/80" />
        </div>
        <span className="relative rounded-base border-2 border-border bg-card px-3 py-1 font-mono text-[10px] font-black tracking-wider text-muted-foreground uppercase shadow-[2px_2px_0px_0px_var(--border)]">
          Atau Akses Kredensial
        </span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="relative z-10 space-y-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black tracking-tight text-foreground uppercase">
            <Mail className="size-3.5 text-main" />
            <span>Email Operator</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@organisasi.id"
              className="w-full rounded-base border-2 border-border bg-secondary-background px-3.5 py-2.5 font-mono text-xs font-bold text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all placeholder:text-muted-foreground/60 focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1.5px_1.5px_0px_0px_var(--border)] focus:ring-2 focus:ring-main focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 font-mono text-xs font-black tracking-tight text-foreground uppercase">
              <Lock className="size-3.5 text-main" />
              <span>Kata Sandi</span>
            </label>
            <span className="font-mono text-[10px] font-bold text-muted-foreground">
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
              className="w-full rounded-base border-2 border-border bg-secondary-background py-2.5 pr-10 pl-3.5 font-mono text-xs font-bold text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all placeholder:text-muted-foreground/60 focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1.5px_1.5px_0px_0px_var(--border)] focus:ring-2 focus:ring-main focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-base border-2 border-border bg-main px-4 py-3 font-heading text-sm font-black text-black shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin text-black" />
              <span>Memvalidasi Kredensial...</span>
            </>
          ) : (
            <>
              <KeyRound className="size-4 stroke-[2.5]" />
              <span>Otorisasi Konsol SOC</span>
              <ArrowRight className="size-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Link to Register */}
      <div className="relative z-10 mt-6 border-t-2 border-dashed border-border/70 pt-4 text-center">
        <p className="text-xs font-semibold text-muted-foreground">
          Belum memiliki kredensial resmi?{" "}
          <Link
            href="/register"
            className="rounded-base border border-transparent px-1.5 py-0.5 font-black text-foreground underline decoration-main decoration-2 underline-offset-4 transition-all hover:border-border hover:bg-main hover:text-black hover:no-underline"
          >
            Daftar Akun Baru
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
