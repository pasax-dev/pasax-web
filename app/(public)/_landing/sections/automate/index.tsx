import fs from "node:fs";
import type { ReactNode } from "react"
import { asMarkdown } from "fumadocs-core/server"
import { Card, Cards } from "fumadocs-ui/components/card"
import type { CodeBlockProps } from "fumadocs-ui/components/codeblock"
import { createServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"
import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"
import { ServerCodeBlock } from "@/components/server-codeblock"
import { apiHighlighter, highlighter } from "@/lib/highlighter"
import { copy } from "../../content"
import { DITHER_MASKS } from "../../lib/dither"
import { block, heading } from "../../markdown"
import { Figure, FigureHeader, Status } from "../../ui/figure"
import { Button } from "./content/button"
import {
  BEFORE,
  EDIT,
  EDIT_LINE,
  FILE,
  type Output,
  OUTPUTS,
  PAGE,
  RELEASES,
  SOURCE,
  TYPE_NAME,
  TYPE_TABLES,
} from "./data"
import { type Made, Stage } from "./stage"

if (!fs.existsSync(TYPE_TABLES)) { fs.mkdirSync(TYPE_TABLES, { recursive: true }); }
const generator = createGenerator({
  cache: createFileSystemGeneratorCache(TYPE_TABLES),
})

const framed: CodeBlockProps = {
  allowCopy: false,
  className: "my-0 rounded-none border-0 bg-transparent shadow-none",
  viewportProps: {
    className:
      "py-2.5 text-[11px]/4 lg:text-xs/4.5 overflow-hidden [&_.line]:px-3!",
  },
}

function code(source: string): ReactNode {
  return <ServerCodeBlock lang="tsx" code={source} codeblock={framed} />
}

const Included = createServerCodeBlock({
  highlighter: highlighter.override({
    shikiTransformers: [
      {
        line(node, line) {
          const i = line - 1
          const last = this.source.includes(EDIT) ? EDIT_LINE + 1 : EDIT_LINE
          if (i >= EDIT_LINE - 1 && i <= last)
            node.properties["data-excerpt"] = ""
        },
      },
    ],
  }),
})

function bound(text: string): string {
  return text.replace(/ (?=\S+$)/, "\u00a0")
}

async function markdown(source: string): Promise<ReactNode> {
  const [docs] = await generator.generateTypeTable({
    type: source,
    name: TYPE_NAME,
  })
  const lines: ReactNode[] = []
  for (const entry of docs.entries) {
    const tag = entry.tags.find((item) => item.name === "deprecated")
    const name = `${entry.name}${entry.required ? "" : "?"}: ${entry.simplifiedType}`
    if (lines.length > 0) lines.push("\n")
    lines.push(
      tag ? (
        <span key={entry.name} data-mark="">
          {bound(`- ${name}, deprecated: ${tag.text.replaceAll("`", "")}`)}
        </span>
      ) : (
        bound(`- ${name}: ${entry.description}`)
      )
    )
  }
  return (
    <pre className="px-3 py-2.5 font-mono text-[11px]/4 text-pretty whitespace-pre-wrap text-lp-ink lg:text-xs/4.5">
      <span className="max-lg:hidden">{`# ${PAGE.title}\n\n${PAGE.description}\n\n## Rules\n\n`}</span>
      {lines}
    </pre>
  )
}

function page(source: string): ReactNode {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 px-3 pt-3">
        <p className="text-lg font-semibold">{PAGE.title}</p>
        <p className="text-fd-muted-foreground text-sm">{PAGE.description}</p>
      </div>
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="flex gap-2">
          <Button label="⚡ Enforce Policy" />
          <Button label="Security Docs" href="/docs" />
        </div>
        <span aria-hidden className="w-3/5 border-t border-lp-line-strong">
          <span
            className="block h-1.5 bg-lp-ink-2"
            style={{ maskImage: DITHER_MASKS[4] }}
          />
        </span>
      </div>
      <div className="border-t border-lp-line">
        <Included lang="tsx" code={source} codeblock={framed} />
      </div>
    </div>
  )
}

function releases(shipped: boolean): ReactNode {
  const [next, last] = RELEASES
  return (
    <Cards className="m-3 grid-cols-1! gap-2">
      {shipped ? (
        <Card data-mark="" title={next.title} description={next.description} />
      ) : (
        <Card
          title={<span className="text-lp-ink-2">Unreleased</span>}
          description={<span className="invisible">{next.description}</span>}
          className="border-dashed border-lp-line-strong bg-transparent"
        />
      )}
      <Card title={last.title} description={last.description} />
    </Cards>
  )
}

function image(version: string, changed = false): ReactNode {
  const displayVersion = version.startsWith("v") ? version : `v${version}`
  return (
    <div className="flex aspect-og flex-col justify-between bg-lp-ink p-4 text-lp-paper">
      <span className="flex items-center gap-2 text-xs font-medium">
        <span className="size-3 rounded-full bg-lp-sun" />
        Pasax Trinity Defense
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-2xl leading-none font-semibold">
          {PAGE.title}
        </span>
        <span className="text-xs text-lp-paper/70">{PAGE.description}</span>
      </span>
      <span
        data-mark={changed ? "" : undefined}
        className="self-start border border-lp-paper/40 px-1.5 font-mono text-[11px]"
      >
        {displayVersion}
      </span>
    </div>
  )
}

async function table(source: string): Promise<ReactNode> {
  const tables = await AutoTypeTable({
    generator,
    highlighter: apiHighlighter,
    type: source,
    name: TYPE_NAME,
    className: "my-0 rounded-none border-0 text-xs [&_button>code]:min-w-[120px]",
  })
  return <>{await Promise.all(tables)}</>
}

export async function Automate() {
  if (asMarkdown())
    return block`
      ${heading(copy.automate)}

      - Define security policies once: from \`${FILE}\` come ${OUTPUTS.map((output) => `\`${output.title}\``).join(", ")}.
      - Modify the policy and the kernel packet drops, telemetry, and blocklists synchronize automatically.

      \`${FILE}\`:

      ${(<pre data-lang="tsx">{SOURCE}</pre>)}
    `

  const outputs: Record<Output, Made> = {
    props: { before: await table(BEFORE), after: await table(SOURCE) },
    page: { before: page(BEFORE), after: page(SOURCE) },
    releases: { before: releases(false), after: releases(true) },
    llms: { before: await markdown(BEFORE), after: await markdown(SOURCE) },
    og: {
      before: image(RELEASES[1].title),
      after: image(RELEASES[0].title, true),
    },
  }

  return (
    <Figure id="automate" aria-label="Automate" status="5 outputs up to date">
      <FigureHeader
        lead={<Status>{copy.automate.lead}</Status>}
        title={copy.automate.title}
        className="px-(--lp-gutter) pt-(--lp-section) pb-10 md:pb-12"
      />
      <Stage file={FILE} source={code(SOURCE)} outputs={outputs} />
    </Figure>
  )
}
