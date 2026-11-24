"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
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
  const { status } = useSession()
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

  // Redirect if already authenticated
  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl)
    }
  }, [status, router, callbackUrl])

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
      {authError && (
        <div className="mb-4 flex items-center gap-2 rounded-base border-2 border-destructive bg-destructive/10 p-3 font-mono text-xs font-bold text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* OAuth Social Buttons (GitHub & Google) */}
      <OAuthButtons
        callbackUrl={callbackUrl}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onError={setAuthError}
      />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 font-mono text-[10px] font-bold text-muted-foreground">
            Atau gunakan kredensial SOC
          </span>
        </div>
      </div>

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
          >
            <Mail className="size-3.5 text-muted-foreground" />
            <span>Alamat Email Operator</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@pasax.id"
              required
              disabled={isLoading}
              className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-main focus:outline-hidden disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground"
            >
              <Lock className="size-3.5 text-muted-foreground" />
              <span>Kata Sandi Master</span>
            </label>
            <span className="font-mono text-[10px] text-muted-foreground">
              Min. 8 karakter
            </span>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={isLoading}
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

        {/* Demo Credentials Helper Box */}
        {/*<div className="rounded-base border border-dashed border-border/80 bg-muted/40 p-2.5 font-mono text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1 font-bold text-foreground">
            <KeyRound className="size-3 text-main" />
            <span>Kredensial Demo Superadmin:</span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <div>
              Email:{" "}
              <code className="text-foreground">pasak.dev@gmail.com</code>
            </div>
            <div>
              Password:{" "}
              <code className="text-foreground">Tiram@1993</code>
            </div>
          </div>
        </div>*/}

        <button
          type="submit"
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2.5 font-heading text-xs font-black text-black shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Memvalidasi Akses SOC...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Konsol SOC</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center font-sans text-xs text-muted-foreground">
        Belum memiliki node armada terdaftar?{" "}
        <Link
          href="/register"
          className="font-bold text-foreground underline decoration-main underline-offset-4 hover:text-main"
        >
          Daftarkan Operator Baru
        </Link>
      </div>
    </>
  )
}

export function LoginForm() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-48 items-center justify-center font-mono text-xs text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-main" />
        </div>
      }
    >
      <LoginFormInner />
    </React.Suspense>
  )
}
