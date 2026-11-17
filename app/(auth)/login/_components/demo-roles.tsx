"use client"

import * as React from "react"
import { Zap } from "lucide-react"

interface DemoRolesProps {
  onSelectRole: (email: string) => void
}

const DEMO_ACCOUNTS = [
  {
    role: "Superadmin",
    email: "superadmin@pasax.id",
    bg: "bg-rose-400 text-black",
  },
  {
    role: "Admin",
    email: "admin@pasax.id",
    bg: "bg-main text-black",
  },
  {
    role: "Support",
    email: "support@pasax.id",
    bg: "bg-emerald-300 text-black",
  },
  {
    role: "Teknis",
    email: "teknis@pasax.id",
    bg: "bg-sky-300 text-black",
  },
  {
    role: "User",
    email: "user@pasax.id",
    bg: "bg-purple-300 text-black",
  },
]

export function DemoRoles({ onSelectRole }: DemoRolesProps) {
  return (
    <div className="relative z-10 mt-6 rounded-base border-2 border-dashed border-border bg-secondary-background/80 p-3 shadow-[2px_2px_0px_0px_var(--border)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono text-[10px] font-black text-foreground uppercase">
          <Zap className="size-3 text-main" />
          <span>Demo Quick-Test Akun:</span>
        </span>
        <span className="font-mono text-[9px] font-bold text-foreground">
          Klik Peran
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DEMO_ACCOUNTS.map((p) => (
          <button
            key={p.role}
            type="button"
            onClick={() => onSelectRole(p.email)}
            className={`border-1.5 rounded-sm border-border px-2 py-0.5 font-mono text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${p.bg}`}
          >
            {p.role}
          </button>
        ))}
      </div>
    </div>
  )
}
