import { asMarkdown } from 'fumadocs-core/server';
import { copy } from '../../content';
import { block, heading } from '../../markdown';
import { Figure, FigureHeader } from '../../ui/figure';
import { CORE, LAYERS, NAMES, OPTIONS, ROLES } from './data';
import { Stage } from './stage';

export function Parts() {
  if (asMarkdown()) {
    const lines = [
      `- Every node runs on these ${LAYERS.length} defense layers, each a dedicated subsystem:`,
    ];
    for (const layer of LAYERS) {
      lines.push(`  - ${NAMES[layer]}: ${ROLES[layer]}${layer === 'core' ? ' (unified bus)' : ''}`);
      for (const option of layer === 'core' ? [CORE] : OPTIONS[layer])
        lines.push(`    - ${option.title} (\`${option.name}\`): ${option.line}`);
    }
    return block`
      ${heading(copy.parts)}

      ${lines.join('\n')}
    `;
  }

  return (
    <Figure id="parts" aria-label="Parts" status="defense architecture">
      <Stage header={<FigureHeader title={copy.parts.title} />} />
    </Figure>
  );
}
