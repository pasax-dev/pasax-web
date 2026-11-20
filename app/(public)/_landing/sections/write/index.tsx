import type { ReactNode } from "react"
import { asMarkdown } from "fumadocs-core/server"
import { copy } from "../../content"
import { block, heading } from "../../markdown"
import { Figure, FigureHeader } from "../../ui/figure"
import { Mermaid } from "@/components/mdx/mermaid"
import { blocks, steps } from "./data"
import { RailBed, RailColumn } from "./rail"
import { Stage } from "./stage"

const FILE = "pasax-rules.yml"

export function Write() {
  if (asMarkdown())
    return block`
      ${heading(copy.write)}

      - Pure PHP WAF and eBPF kernel hooks working seamlessly together.
      - Stop webshells, brute-force bots, and zero-day exploits with microsecond response times.
      - Integrated radar visualization across the entire server fleet.

      \`${FILE}\`:

      ${(<pre data-lang="mdx">{blocks.join("\n\n")}</pre>)}
    `

  const slots: ReactNode[] = [
    <div key="frontmatter" className="not-prose flex flex-col gap-4">
      <h3 className="text-[1.75em] font-semibold text-lp-ink">
        Pasax Security Policy
      </h3>
      <p className="text-base text-lp-ink/75">
        Declarative threat quarantine & rate thresholding.
      </p>
    </div>,
    <div key="install" className="prose">
      <h2 className="mb-2 text-xl font-semibold text-lp-ink">Installation</h2>
      <pre className="rounded-lg border border-lp-line bg-[#121210] p-3 font-mono text-xs text-[#eceae2]">
        <code>composer require pasax/pasax-secure-monitor</code>
      </pre>
    </div>,
    <div key="twoslash" className="prose">
      <pre className="rounded-lg border border-lp-line bg-[#121210] p-3 font-mono text-xs text-[#eceae2]">
        <code>{`use Pasax\\SecureMonitor\\Middleware\\PasaxWafMiddleware;\n\n$middleware->append(PasaxWafMiddleware::class);`}</code>
      </pre>
    </div>,
    <div
      key="mermaid"
      className="max-w-full overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
    >
      <Mermaid
        chart={`
graph LR
  Attacker[Malicious Packet] --> Kernel[nftables Hook <0.02ms]
  Kernel --> WAF[Pasax PHP WAF]
  WAF --> Cloud[Pasax Live Radar]
`}
      />
    </div>,
  ]

  return (
    <Figure id="write" aria-label="Write" status={`compiled ${FILE}`}>
      <FigureHeader
        title={copy.write.title}
        className="px-(--lp-gutter) pt-(--lp-section) pb-10 md:pb-12"
      />
      <Stage
        file={FILE}
        steps={steps}
        sources={blocks}
        slots={slots}
        bed={<RailBed stops={steps.length} />}
        column={<RailColumn id="write" />}
      />
    </Figure>
  )
}
