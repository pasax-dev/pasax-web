"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Scale,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function LegalNav() {
  const pathname = usePathname()

  const tabs = [
    {
      label: "Terms of Service",
      sub: "Ketentuan Layanan & Tanggung Jawab Root",
      href: "/terms",
      icon: Scale,
      active: pathname === "/terms",
    },
    {
      label: "Privacy Policy",
      sub: "Privasi Telemetri & Zero-Knowledge",
      href: "/privacy",
      icon: ShieldCheck,
      active: pathname === "/privacy",
    },
    {
      label: "Changelog",
      sub: "Catatan Rilis & Versi Ekosistem",
      href: "/changelog",
      icon: BookOpen,
      active: pathname === "/changelog",
    },
    {
      label: "FAQ",
      sub: "Pertanyaan Umum & Jawaban",
      href: "/faq",
      icon: HelpCircle,
      active: pathname === "/faq",
    },
  ]

  return (
    <div className="mb-8 overflow-x-auto pb-1">
      <div className="inline-flex min-w-full items-center gap-1.5 rounded-xl border border-lp-line bg-lp-paper-2/60 p-1.5 shadow-xs sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "group flex flex-1 items-center gap-2.5 rounded-lg px-3.5 py-2 transition-all sm:text-sm",
                tab.active
                  ? "border border-lp-line bg-lp-paper text-lp-ink shadow-xs"
                  : "border border-transparent text-lp-ink/70 hover:bg-lp-paper/60 hover:text-lp-ink"
              )}
            >
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors",
                  tab.active
                    ? "border-lp-orange/30 bg-lp-orange/10 text-lp-orange dark:border-lp-yellow/30 dark:bg-lp-yellow/10 dark:text-lp-yellow"
                    : "border-lp-line bg-lp-paper text-lp-ink/60 group-hover:text-lp-ink"
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate font-heading text-xs leading-tight font-semibold text-lp-ink">
                  {tab.label}
                </span>
                <span className="hidden truncate font-mono text-[10px] text-lp-ink/50 sm:block">
                  {tab.sub}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
