"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scale, ShieldCheck, ArrowRight, BookOpen, HelpCircle } from "lucide-react"
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
      sub: "Catatan Rilis & Versi",
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
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="inline-flex min-w-full items-center gap-2 rounded-base border-2 border-border bg-card p-1.5 shadow-[4px_4px_0px_0px_var(--border)] sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "group flex flex-1 items-center gap-2.5 rounded-base px-3.5 py-2 font-heading text-xs font-bold transition-all sm:text-sm",
                tab.active
                  ? "border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                  : "text-foreground hover:bg-secondary-background hover:text-foreground"
              )}
            >
              <Icon className={cn("size-4 shrink-0", tab.active ? "text-main-foreground" : "text-main")} />
              <div className="flex flex-col text-left">
                <span className="leading-tight">{tab.label}</span>
                <span className={cn(
                  "hidden font-mono text-[10px] font-normal sm:block",
                  tab.active ? "text-main-foreground/90" : "text-muted-foreground"
                )}>
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
