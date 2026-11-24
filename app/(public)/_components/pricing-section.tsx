"use client"

import * as React from "react"
import Link from "next/link"
import {
  Server,
  Layers,
  CheckCircle2,
  Sparkles,
  Shield,
  Building2,
  Clock,
  ArrowRight,
  HelpCircle,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface PricingPlan {
  id: string
  name: string
  slug: string
  category: "standard" | "agency" | "enterprise_gov" | string
  badge?: string
  description: string
  targetAudience?: string
  vpsQuota: number
  appsPerVps: string
  priceMonthlyIdr: number
  priceYearlyIdr: number
  priceMonthlyUsd: number
  priceYearlyUsd: number
  discountMonthlyPercent?: number
  discountYearlyPercent?: number
  isFirstPurchaseOnly?: boolean
  promoTag?: string
  features: string[]
  highlightFeatures?: string[]
  logRetentionDays: number
  maxSeats: number
  crowdDefenseSync: string
  supportSla: string
  complianceCert?: string
  isCustomQuote: boolean
  isActive: boolean
  sortOrder: number
}

interface PricingSectionProps {
  initialPlans?: PricingPlan[]
}

export function PricingSection({ initialPlans }: PricingSectionProps) {
  const [plans, setPlans] = React.useState<PricingPlan[]>(initialPlans || [])
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly"
  )
  const [currency, setCurrency] = React.useState<"IDR" | "USD">("IDR")
  const [wiseRate, setWiseRate] = React.useState<number>(18290)

  // Fetch plans from API if initialPlans is empty
  React.useEffect(() => {
    if (plans.length === 0) {
      fetch("/api/admin/pricing?public=true")
        .then((res) => res.json())
        .then((json) => {
          const raw = Array.isArray(json) ? json : json.data
          if (Array.isArray(raw) && raw.length > 0) {
            setPlans(raw.filter((p: any) => p.isActive))
          }
        })
        .catch(() => {})
    }
  }, [plans.length])

  // Fetch live exchange rate from Wise
  React.useEffect(() => {
    fetch("/api/currency/rate?source=USD&target=IDR")
      .then((res) => res.json())
      .then((json) => {
        if (json && typeof json.rate === "number" && json.rate > 0) {
          setWiseRate(json.rate)
        }
      })
      .catch(() => {})
  }, [])

  const formatPrice = (plan: PricingPlan) => {
    if (plan.isCustomQuote) {
      return {
        amount: "Kontrak Kustom",
        period: "Sesuai SLA",
        subtitle: "Pengadaan BUMN / APBD / APBN",
        originalAmount: null as string | null,
        discountBadge: null as string | null,
      }
    }

    if (currency === "IDR") {
      if (plan.priceMonthlyIdr === 0 && plan.priceYearlyIdr === 0) {
        return {
          amount: "Rp 0",
          period: "Selamanya",
          subtitle: "Gratis untuk riset & open source",
          originalAmount: null,
          discountBadge: null,
        }
      }

      if (billingCycle === "monthly") {
        const hasDiscount = (plan.discountMonthlyPercent || 0) > 0
        const finalPrice = hasDiscount
          ? Math.round(
              plan.priceMonthlyIdr *
                (1 - (plan.discountMonthlyPercent || 0) / 100)
            )
          : plan.priceMonthlyIdr

        const originalAmount = hasDiscount
          ? new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(plan.priceMonthlyIdr)
          : null

        const discountBadge = hasDiscount
          ? `Disc ${plan.discountMonthlyPercent}%`
          : null

        return {
          amount: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(finalPrice),
          period: "/ bulan",
          originalAmount,
          discountBadge,
          subtitle: `Atau ${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(plan.priceYearlyIdr)} / tahun`,
        }
      } else {
        // yearly
        const rawYearly = plan.priceMonthlyIdr * 12
        const hasYearlyDiscount =
          (plan.discountYearlyPercent || 0) > 0 ||
          (rawYearly > 0 && plan.priceYearlyIdr < rawYearly)
        const percent =
          plan.discountYearlyPercent && plan.discountYearlyPercent > 0
            ? plan.discountYearlyPercent
            : rawYearly > 0
              ? Math.round((1 - plan.priceYearlyIdr / rawYearly) * 100)
              : 0

        const originalAmount =
          hasYearlyDiscount && rawYearly > plan.priceYearlyIdr
            ? new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(rawYearly)
            : null

        const discountBadge = percent > 0 ? `Hemat ${percent}%` : null

        return {
          amount: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(plan.priceYearlyIdr),
          period: "/ tahun",
          originalAmount,
          discountBadge,
          subtitle: "Ditagih tahunan (Semua fitur aktif)",
        }
      }
    } else {
      // USD Calculation (accurately converted from IDR via Wise rate)
      const baseMonthlyUsd =
        wiseRate > 0 && plan.priceMonthlyIdr > 0
          ? Math.round(plan.priceMonthlyIdr / wiseRate)
          : plan.priceMonthlyUsd

      const baseYearlyUsd =
        wiseRate > 0 && plan.priceYearlyIdr > 0
          ? Math.round(plan.priceYearlyIdr / wiseRate)
          : plan.priceYearlyUsd

      if (baseMonthlyUsd === 0 && baseYearlyUsd === 0) {
        return {
          amount: "$0",
          period: "Forever",
          subtitle: "Free for research & community",
          originalAmount: null,
          discountBadge: null,
        }
      }

      if (billingCycle === "monthly") {
        const hasDiscount = (plan.discountMonthlyPercent || 0) > 0
        const finalPrice = hasDiscount
          ? Math.round(
              baseMonthlyUsd * (1 - (plan.discountMonthlyPercent || 0) / 100)
            )
          : baseMonthlyUsd

        const originalAmount = hasDiscount ? `$${baseMonthlyUsd}` : null
        const discountBadge = hasDiscount
          ? `Disc ${plan.discountMonthlyPercent}%`
          : null

        return {
          amount: `$${finalPrice}`,
          period: "/ mo",
          originalAmount,
          discountBadge,
          subtitle: `Atau $${baseYearlyUsd} / year (Kurs Wise: $1 ≈ Rp ${new Intl.NumberFormat("id-ID").format(wiseRate)})`,
        }
      } else {
        const rawYearly = baseMonthlyUsd * 12
        const hasYearlyDiscount =
          (plan.discountYearlyPercent || 0) > 0 ||
          (rawYearly > 0 && baseYearlyUsd < rawYearly)
        const percent =
          plan.discountYearlyPercent && plan.discountYearlyPercent > 0
            ? plan.discountYearlyPercent
            : rawYearly > 0
              ? Math.round((1 - baseYearlyUsd / rawYearly) * 100)
              : 0

        const originalAmount =
          hasYearlyDiscount && rawYearly > baseYearlyUsd
            ? `$${rawYearly}`
            : null
        const discountBadge = percent > 0 ? `Save ${percent}%` : null

        return {
          amount: `$${baseYearlyUsd}`,
          period: "/ yr",
          originalAmount,
          discountBadge,
          subtitle: `Ditagih tahunan (Kurs Wise: $1 ≈ Rp ${new Intl.NumberFormat("id-ID").format(wiseRate)})`,
        }
      }
    }
  }

  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden border-t border-lp-line bg-lp-paper py-20"
    >
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-(--lp-max) px-(--lp-gutter)">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-lp-orange/30 bg-lp-orange/10 px-3.5 py-1 text-xs font-semibold text-lp-orange">
            <Sparkles className="size-3.5" />
            <span>Skema Lisensi Fleksibel Khusus Laravel</span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-lp-ink sm:text-4xl md:text-5xl">
            Satu Harga Per VPS,{" "}
            <span className="text-lp-orange">Bebas Jumlah Aplikasi</span>
          </h2>

          <p className="mt-4 text-sm text-lp-ink-2 sm:text-base">
            Tidak ada pembatasan jumlah domain atau aplikasi. Berapa pun web
            Laravel yang Anda jalankan di dalam 1 VPS, cukup dihitung sebagai 1
            lisensi node. Termasuk paket kepatuhan khusus instansi pemerintah
            &amp; korporasi.
          </p>

          {/* Toggle Billing & Currency */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center rounded-xl border border-lp-line bg-lp-paper-2 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 transition-all",
                  billingCycle === "monthly"
                    ? "bg-lp-paper font-bold text-lp-ink shadow-xs"
                    : "text-lp-ink-2 hover:text-lp-ink"
                )}
              >
                Bayar Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all",
                  billingCycle === "yearly"
                    ? "bg-lp-paper font-bold text-lp-ink shadow-xs"
                    : "text-lp-ink-2 hover:text-lp-ink"
                )}
              >
                <span>Tahunan</span>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  Hemat s/d 20%
                </span>
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="inline-flex items-center rounded-xl border border-lp-line bg-lp-paper-2 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setCurrency("IDR")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition-all",
                  currency === "IDR"
                    ? "bg-lp-paper font-bold text-lp-ink shadow-xs"
                    : "text-lp-ink-2 hover:text-lp-ink"
                )}
              >
                IDR (Rp)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition-all",
                  currency === "USD"
                    ? "bg-lp-paper font-bold text-lp-ink shadow-xs"
                    : "text-lp-ink-2 hover:text-lp-ink"
                )}
              >
                USD ($)
              </button>
            </div>

            {/* Wise Live Badge */}
            {wiseRate > 0 && (
              <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-medium text-emerald-600 sm:inline-flex dark:text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>
                  Wise Live: $1 = Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(wiseRate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards Grid (Optimized 2-tier or multi-tier layout) */}
        <div
          className={cn(
            "mx-auto mt-14 grid gap-8",
            plans.length <= 2
              ? "max-w-4xl grid-cols-1 md:grid-cols-2"
              : "max-w-6xl grid-cols-1 md:grid-cols-3"
          )}
        >
          {plans.map((plan) => {
            const price = formatPrice(plan)
            const isFeatured =
              plan.badge === "MOST POPULAR" || plan.category === "agency"
            const isGov = plan.category === "enterprise_gov"

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border bg-lp-paper p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
                  isFeatured
                    ? "border-lp-orange/80 shadow-md ring-2 ring-lp-orange/20"
                    : isGov
                      ? "border-blue-500/50 bg-blue-500/[0.02]"
                      : "border-lp-line"
                )}
              >
                {/* Header Badge */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase",
                          isGov
                            ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : isFeatured
                              ? "border-lp-orange/50 bg-lp-orange/15 text-lp-orange"
                              : "border-lp-line bg-lp-paper-2 text-lp-ink-2"
                        )}
                      >
                        {plan.category.replace("_", " ")}
                      </span>
                      {plan.badge && (
                        <span className="rounded-full bg-lp-ink px-2 py-0.5 font-mono text-[9px] font-black text-lp-paper uppercase">
                          {plan.badge}
                        </span>
                      )}
                      {plan.promoTag && (
                        <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 font-mono text-[9px] font-black text-rose-600 uppercase dark:text-rose-400">
                          {plan.promoTag}
                        </span>
                      )}
                      {plan.isFirstPurchaseOnly && (
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-600 dark:text-amber-400">
                          Pembelian Pertama
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plan Name & Tagline */}
                  <div className="mt-3">
                    <h3 className="font-heading text-lg font-bold tracking-tight text-lp-ink">
                      {plan.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-lp-ink-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Box */}
                  <div className="mt-4 rounded-xl border border-lp-line/80 bg-lp-paper-2 p-3.5">
                    {/* Separate Top Row for Original Price and Discount Badge */}
                    {price.originalAmount && (
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-lp-ink-2 line-through opacity-70">
                          {price.originalAmount}
                        </span>
                        {price.discountBadge && (
                          <span className="rounded-md border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 font-mono text-[9px] font-black text-rose-600 uppercase dark:text-rose-400">
                            {price.discountBadge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Main Row: Promo Price & Period */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-black text-lp-ink">
                        {price.amount}
                      </span>
                      <span className="font-mono text-xs text-lp-ink-2">
                        {price.period}
                      </span>
                    </div>

                    {/* Subtitle / Yearly Info */}
                    <p className="mt-1 text-[11px] text-lp-ink-2">
                      {price.subtitle}
                    </p>
                    {plan.isFirstPurchaseOnly && (
                      <p className="mt-1 font-mono text-[9px] text-amber-600 dark:text-amber-400">
                        * Promo khusus pembelian pertama
                      </p>
                    )}
                  </div>

                  {/* Node Capacity Highlights */}
                  <div className="mt-3.5 space-y-1.5 rounded-lg border border-dashed border-lp-line p-2.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-lp-ink-2">Kapasitas Node:</span>
                      <span className="font-mono font-bold text-lp-ink">
                        {plan.vpsQuota} Server VPS
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lp-ink-2">Aplikasi Laravel:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {plan.appsPerVps} Apps
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lp-ink-2">Retensi Forensik:</span>
                      <span className="font-mono font-bold text-lp-ink">
                        {plan.logRetentionDays} Hari
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-5 space-y-2 border-t border-lp-line pt-4">
                    <span className="font-mono text-[10px] font-bold text-lp-ink-2 uppercase">
                      Termasuk Proteksi:
                    </span>
                    <ul className="space-y-1.5">
                      {plan.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-lp-ink"
                        >
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-lp-orange" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="mt-6 border-t border-lp-line pt-4">
                  {plan.isCustomQuote ? (
                    <a
                      href="mailto:contact@pasax.web.id?subject=Permintaan%20Proposal%20Gov%20Enterprise%20Pasax"
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-blue-500/50 bg-blue-600 px-3 font-mono text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700"
                    >
                      <Building2 className="size-3.5" />
                      <span>Hubungi Tim Sales</span>
                    </a>
                  ) : (
                    <Link
                      href={`/register?plan=${plan.id}`}
                      className={cn(
                        "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border font-mono text-xs font-bold transition-all",
                        isFeatured
                          ? "border-lp-orange/60 bg-lp-orange text-black shadow-xs hover:opacity-90"
                          : "border-lp-line bg-lp-paper-2 text-lp-ink hover:border-lp-ink/40 hover:bg-lp-paper"
                      )}
                    >
                      <span>
                        {plan.id === "pro"
                          ? "Mulai Trial Pro 14 Hari"
                          : "Mulai Berlangganan"}
                      </span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Enterprise & Government Callout */}
        <div className="mt-16 rounded-2xl border border-lp-line bg-lp-paper-2 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Building2 className="size-3.5" />
                <span>Kebutuhan Khusus Instansi &amp; Pengadaan Resmi</span>
              </div>
              <h3 className="mt-3 font-heading text-xl font-bold text-lp-ink md:text-2xl">
                Butuh Instalasi On-Premise / Air-Gapped di Pusat Data Nasional?
              </h3>
              <p className="mt-2 text-xs text-lp-ink-2 md:text-sm">
                Kami menyediakan opsi *Self-Hosted / On-Premise* di mana seluruh
                dashboard kontrol dan database dijalankan di server lokal
                instansi Anda tanpa ketergantungan koneksi internet publik. Siap
                dengan dokumen legalitas SPK, BAST, faktur pajak PPN 11%, dan
                format laporan standar CSIRT BSSN.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:contact@pasax.web.id?subject=Konsultasi%20Keamanan%20Instansi%20Pemerintah"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-lp-line bg-lp-paper px-4 font-mono text-xs font-bold text-lp-ink shadow-xs hover:bg-lp-paper-2"
              >
                <span>Konsultasi Teknis</span>
              </a>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Tim%20Pasax,%20saya%20ingin%20berdiskusi%20mengenai%20paket%20keamanan%20Enterprise/Gov"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 px-4 font-mono text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                <span>WhatsApp Tim SOC</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
