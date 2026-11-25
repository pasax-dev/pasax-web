"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { text: "Tutorial", href: "/tutorial" },
  { text: "Docs", href: "/docs" },
  { text: "Threat Map", href: "/threats-map" },
  { text: "Sentinel", href: "/docs/pasax-sentinel" },
  { text: "Shield WAF", href: "/docs/pasax-secure-monitor" },
  { text: "Changelog", href: "/changelog" },
  { text: "FAQ", href: "/faq" },
  { text: "Privacy", href: "/privacy" },
  { text: "Terms", href: "/terms" },
]

export function PublicFooter() {
  const pathname = usePathname()

  // On the landing page (/), the footer is integrated inside the Start section with the interactive Pasax Wordmark
  if (pathname === "/") {
    return null
  }

  return (
    <footer className="border-t border-lp-line bg-lp-paper pt-8">
      <div className="mx-auto flex max-w-(--lp-max) flex-wrap items-center justify-between gap-3 px-(--lp-gutter) pb-8">
        <nav aria-label="Footer" className="-mx-2.5 flex flex-wrap text-sm">
          {links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer noopener" : undefined}
              className="inline-flex h-9 items-center px-2.5 text-sm transition-none hover:bg-lp-ink hover:text-lp-paper focus-visible:bg-lp-ink focus-visible:text-lp-paper focus-visible:outline-none"
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-lp-ink-2">
          MIT licensed. Built by{" "}
          <a
            href="https://github.com/pasax-dev"
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-lp-line-strong underline-offset-4 hover:text-lp-ink"
          >
            Pasax Security Ecosystem
          </a>{" "}
          and contributors.
        </p>
      </div>
    </footer>
  )
}
