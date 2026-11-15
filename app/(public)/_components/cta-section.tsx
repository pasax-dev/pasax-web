import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CtaSection() {
  return (
    <section className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="rounded-base border-2 border-border bg-main p-8 text-center text-main-foreground shadow-shadow md:p-14 lg:p-16 xl:p-20">
        <h2 className="font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Arm Your Web Fleets in Under 60 Seconds
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-base font-medium text-foreground/90 md:text-lg lg:text-xl">
          Stop waiting for attackers to exploit your server configs. Deploy the
          zero-overhead kernel sentinel or explore the live SOC dashboard today.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "flex items-center gap-2 border-2 border-border bg-secondary-background font-heading font-black text-foreground shadow-[4px_4px_0px_0px_var(--border)] hover:bg-background"
            )}
          >
            <span>Launch SOC Console</span>
            <ArrowRight className="size-5" />
          </Link>
          <a
            href="https://github.com/pasak-dev"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "flex items-center gap-2 border-2 border-border bg-transparent font-heading font-bold text-foreground hover:bg-black/10"
            )}
          >
            <span>Read Github Guide</span>
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
