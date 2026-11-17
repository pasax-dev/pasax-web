import type { ReactNode } from "react"
import { asMarkdown } from "fumadocs-core/server"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { TypeTable } from "fumadocs-ui/components/type-table"
import * as Twoslash from "fumadocs-twoslash/ui"
import { Mermaid } from "@/components/mdx/mermaid"
import { copy } from "../../content"
import { block, heading } from "../../markdown"
import { Figure, FigureHeader } from "../../ui/figure"
import { blocks, fileLines, steps } from "./data"
import { RailBed, RailColumn } from "./rail"
import { Stage } from "./stage"

const { h2: H2 } = defaultMdxComponents

type MDXComponents = Record<string, React.ComponentType<any>>

const components: MDXComponents = {
  ...defaultMdxComponents,
  ...Twoslash,
  Mermaid,
  TypeTable,
  // the page's headings sit under the figure's own h2
  h2: (props: any) => <H2 {...props} aria-level={4} />,
}

const FILE = "pasax-rules.yml"

/** a figure that types a security rule block by block, and presses each into its page */
export function Write() {
  if (asMarkdown())
    return block`
      ${heading(copy.write)}

      - Define declarative security policies and inspect threats in sub-0.2 milliseconds.

      \`${FILE}\`:

      ${<pre data-lang="yaml">{fileLines(blocks).join("\n")}</pre>}
    `

  const slots: ReactNode[] = [
    <div key="frontmatter" className="not-prose flex flex-col gap-4">
      <h3 className="text-[1.75em] font-semibold text-lp-ink">Pasax Security Policy</h3>
      <p className="text-base text-lp-ink/75">Declarative threat quarantine & rate thresholding.</p>
    </div>,
    <div key="install" className="prose">
      <h2 className="text-xl font-semibold mb-2 text-lp-ink">Installation</h2>
      <pre className="rounded-lg bg-[#121210] p-3 font-mono text-xs text-[#eceae2] border border-lp-line">
        <code>composer require pasax/pasax-secure-monitor</code>
      </pre>
    </div>,
    <div key="twoslash" className="prose">
      <pre className="rounded-lg bg-[#121210] p-3 font-mono text-xs text-[#eceae2] border border-lp-line">
        <code>{`use Pasax\\SecureMonitor\\Middleware\\PasaxWafMiddleware;\n\n$middleware->append(PasaxWafMiddleware::class);`}</code>
      </pre>
    </div>,
    <div key="mermaid">
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
