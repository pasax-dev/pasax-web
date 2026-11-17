import { TICK } from '../../lib/motion';

/**
 * The `curl -sSL https://get.pasax.dev | bash` hardening session, rendered in an 80x24 color terminal.
 */
export const COLS = 80;
export const ROWS = 24;

type Span = readonly [text: string, style: number];
type Line = readonly Span[];

// the shader's styles: default, dim, the CLI's colours, inverse on a colour, inverse on the text;
// a space has no ink, so it may take any of the first three
const plain = (text: string): Span => [text, 0];
const dim = (text: string): Span => [text, 1];
const accent = (text: string): Span => [text, 2];
const inverse = (text: string): Span => [text, 3];
const caret = (text: string): Span => [text, 4];

export interface Frame {
  at: number;
  lines: readonly Line[];
  /** first transcript line on screen, a terminal never scrolls back */
  top: number;
  status?: string;
}

interface Option {
  label: string;
  hint?: string;
}

const environments: Option[] = [
  { label: 'Ubuntu 24.04 LTS (x86_64)', hint: 'kernel 6.8+ & systemd detected' },
  { label: 'Debian 12 Bookworm', hint: 'LTS minimal server' },
  { label: 'RHEL 9 / Rocky Linux 9', hint: 'enterprise nftables active' },
  { label: 'Alpine Linux 3.20 (musl)', hint: 'microVM container target' },
];

const engines: Option[] = [
  { label: 'nftables wire-speed drop', hint: '<0.02ms hardware netfilter' },
  { label: 'Pure PHP WAF middleware', hint: 'zero-overhead Laravel/PHP hook' },
  { label: 'Inotify FIM real-time guard', hint: 'protects .env & /var/www' },
  { label: 'eBPF network packet inspector', hint: 'kernel telemetry hook' },
];

const regions: Option[] = [
  { label: 'APAC Singapore Gateway', hint: '103.81.98.x • 0.14ms latency' },
  { label: 'Jakarta Primary Cluster', hint: '106.84.56.x • 0.12ms latency' },
  { label: 'EU Frankfurt Core', hint: '8.68.21.x • 0.15ms latency' },
  { label: 'US East Core (New York)', hint: '74.00.60.x • 0.11ms latency' },
];

const NODE_NAME = 'sentinel-node-01';
const COMMAND = 'curl -sSL https://get.pasax.dev | bash';
const SPINNER = '◒◐◓◑';

function heading(symbol: string, message: string): Line {
  return [accent(symbol), plain(`  ${message}`)];
}

function radio(label: string, active: boolean): Span[] {
  return active ? [accent('●'), plain(` ${label}`)] : [dim(`○ ${label}`)];
}

function textPrompt(message: string, placeholder: string, input: string): Line[] {
  const value = input ? [plain(`${input}█`)] : [caret(placeholder[0]), dim(placeholder.slice(1))];
  return [[dim('│')], heading('◆', message), [accent('│  '), ...value], [accent('└')]];
}

function selectPrompt(message: string, options: Option[], cursor: number): Line[] {
  const lines: Line[] = [[dim('│')], heading('◆', message)];
  for (let i = 0; i < options.length; i++) {
    const { label, hint } = options[i];
    const spans = radio(label, i === cursor);
    if (i === cursor && hint) spans.push(plain(' '), dim(`(${hint})`));
    // clack pads the option width with the escaped `│  `, 13 characters in a colour terminal
    for (const row of wrap(spans, COLS - 13)) lines.push([accent('│  '), ...row]);
  }
  lines.push(
    [accent('│  '), dim('↑/↓'), plain(' to navigate • '), dim('Enter:'), plain(' confirm')],
    [accent('└')],
  );
  return lines;
}

function confirmPrompt(message: string, value: boolean): Line[] {
  const answer = [...radio('Yes', value), dim(' / '), ...radio('No', !value)];
  return [[dim('│')], heading('◆', message), [accent('│  '), ...answer], [accent('└')]];
}

/** word wrap with `trim: false`, like `fast-wrap-ansi` does for clack */
function wrap(spans: Span[], width: number): Span[][] {
  const rows: Span[][] = [[]];
  let length = 0;
  function put(text: string, style: number, fits: boolean) {
    if (!fits) {
      rows.push([]);
      length = 0;
    }
    rows[rows.length - 1].push([text, style]);
    length += text.length;
  }
  for (const [text, style] of spans) {
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (i > 0) put(' ', style, length < width);
      if (words[i]) put(words[i], style, length === 0 || length + words[i].length <= width);
    }
  }
  return rows;
}

export function createSession() {
  const frames: Frame[] = [];
  const log: Line[] = [];
  let at = 0;
  let top = 0;

  function show(live: Line[], wait: number, status?: string) {
    const lines = log.concat(live);
    top = Math.max(top, lines.length - ROWS);
    frames.push({ at, lines, top, status });
    at += wait;
  }

  /** a prompt once answered: its message and the answer stay in the log */
  function answered(message: string, value: string) {
    log.push([dim('│')], heading('◇', message), [dim(`│  ${value}`)]);
  }

  function shell(typed: string, cursor: boolean): Line[] {
    return [[dim('$ '), plain(cursor ? `${typed}█` : typed)]];
  }

  function type(text: string, speed: number, status?: string) {
    for (let i = 1; i <= text.length; i++)
      show(shell(text.slice(0, i), true), speed, i === 1 ? status : undefined);
  }

  function select(
    message: string,
    options: Option[],
    moves: number,
    hold: number,
    status?: string,
  ) {
    show(selectPrompt(message, options, 0), hold, status);
    for (let i = 1; i <= moves; i++)
      show(selectPrompt(message, options, i % options.length), 2 * TICK);
    if (moves > 0) at += TICK;
    answered(message, options[moves % options.length].label);
  }

  function confirm(message: string, value: boolean) {
    show(confirmPrompt(message, value), 6 * TICK);
    answered(message, value ? 'Yes' : 'No');
  }

  show(shell('', true), 2 * TICK);
  type(COMMAND, 28, `typing ${COMMAND}`);
  show(shell(COMMAND, true), 2 * TICK);
  log.push(shell(COMMAND, false)[0]);
  show([], 2 * TICK);

  log.push([dim('┌  '), inverse('Pasax Sentinel Node Hardening')]);
  show(textPrompt('Node identifier', 'sentinel-01', ''), 6 * TICK, 'node identifier');
  for (let i = 1; i <= NODE_NAME.length; i++)
    show(textPrompt('Node identifier', 'sentinel-01', NODE_NAME.slice(0, i)), 40);
  at += 3 * TICK;
  answered('Node identifier', NODE_NAME);
  show([], TICK);

  select('Target Linux environment', environments, environments.length, 5 * TICK, 'target environment');
  confirm('Enable autonomous kernel netfilter drop?', true);
  select('Primary defense layer', engines, 0, 6 * TICK, 'defense layer');
  select('Connect to Trinity SOC mesh', regions, 0, 7 * TICK, 'connecting to mesh');
  confirm('Arm real-time inotify FIM on /var/www and .env?', true);

  log.push([dim('│')]);
  const steps = [
    ['Mounting kernel netfilter hardware hooks', 10],
    ['Arming inotify file integrity monitor', 8],
    ['Establishing mTLS telemetry tunnel', 6],
    ['Synchronizing global IP reputation ledger', 6],
  ] as const;
  let frame = 0;
  for (const [message, count] of steps) {
    for (let i = 0; i < count; i++, frame++) {
      const dots = '.'.repeat(Math.floor(frame / 4) % 4);
      const line = [accent(SPINNER[frame % 4]), plain(`  ${message}${dots}`)];
      show([line], TICK, frame === 0 ? 'hardening server node' : undefined);
    }
  }
  log.push(heading('◇', 'Node Immunized (Sub-0.02ms Latency)'));
  show([], 2 * TICK);
  log.push([dim('│')], [dim('└  '), inverse('Hardening Complete')], []);
  show([], 2 * TICK, 'node armored');

  const next: Line[] = [
    [],
    [plain('Check node defense status:')],
    [accent('pasax status')],
    [],
    [plain('Stream live threat radar:')],
    [accent('pasax top')],
    [],
    [plain('Autonomous fleet immunity active. 0 CPU overhead.')],
  ];
  for (const line of next) {
    log.push(line);
    show([], TICK);
  }

  return { frames, rest: frames[frames.length - 1] };
}
