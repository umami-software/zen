/**
 * Fixture test for the zen-1.0 codemod.
 *
 *   pnpm dlx tsx packages/react-zen/codemods/test.ts            # assert
 *   pnpm dlx tsx packages/react-zen/codemods/test.ts --update   # rewrite *.output.tsx (review the diff!)
 *
 * Each `__fixtures__/<name>.input.tsx` is transformed and compared to `<name>.output.tsx`.
 * The transform must also be idempotent on files without zen imports and must never throw.
 */
import fs from 'node:fs';
import path from 'node:path';
import { type TransformOptions, transformSource } from './zen-1.0';

/** Per-fixture options (fixtures not listed run with the defaults). */
const OPTIONS: Record<string, TransformOptions> = {
  wrappers: { wrappers: ['LinkButton'] },
};

const dir = path.join(__dirname, '__fixtures__');
const update = process.argv.includes('--update');
const verbose = process.argv.includes('--verbose');

function diff(expected: string, actual: string): string {
  const a = expected.split('\n');
  const b = actual.split('\n');
  const out: string[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) {
      out.push(`  line ${i + 1}:`);
      out.push(`    - ${a[i] ?? '<missing>'}`);
      out.push(`    + ${b[i] ?? '<missing>'}`);
      if (out.length > 40) {
        out.push('    ...');
        break;
      }
    }
  }
  return out.join('\n');
}

const inputs = fs
  .readdirSync(dir)
  .filter(f => f.endsWith('.input.tsx'))
  .sort();

let failed = 0;
for (const file of inputs) {
  const name = file.replace(/\.input\.tsx$/, '');
  const input = fs.readFileSync(path.join(dir, file), 'utf8');
  const outputPath = path.join(dir, `${name}.output.tsx`);
  const result = transformSource(input, file, OPTIONS[name]);

  if (verbose) {
    console.log(`\n# ${name}`);
    for (const c of result.changes) console.log(`  L${c.line} [${c.rule}] ${c.description}`);
    for (const f of result.flags) console.log(`  L${f.line} TODO [${f.category}] ${f.message}`);
  }

  if (update) {
    fs.writeFileSync(outputPath, result.output);
    console.log(`updated ${name}.output.tsx`);
    continue;
  }

  if (!fs.existsSync(outputPath)) {
    failed++;
    console.log(`FAIL ${name}: missing ${name}.output.tsx`);
    continue;
  }
  const expected = fs.readFileSync(outputPath, 'utf8');
  if (expected === result.output) {
    console.log(`PASS ${name}`);
  } else {
    failed++;
    console.log(`FAIL ${name}\n${diff(expected, result.output)}`);
  }

  // Running the transform on its own output must not crash.
  transformSource(result.output, file);
}

// CRLF files keep CRLF line endings (inserted TODO comments included).
{
  const crlf = (s: string) => s.replace(/\r?\n/g, '\r\n');
  const input = crlf(fs.readFileSync(path.join(dir, 'structural.input.tsx'), 'utf8'));
  const expected = crlf(fs.readFileSync(path.join(dir, 'structural.output.tsx'), 'utf8'));
  if (!update && transformSource(input, 'structural.tsx').output !== expected) {
    failed++;
    console.log('FAIL CRLF line endings not preserved');
  } else if (!update) {
    console.log('PASS CRLF preserved');
  }
}

// A file without zen imports is returned untouched.
const untouched = `import { Button } from './Button';\nexport const A = () => <Button variant="primary" isDisabled />;\n`;
if (transformSource(untouched, 'untouched.tsx').output !== untouched) {
  failed++;
  console.log('FAIL non-zen file was modified');
} else {
  console.log('PASS non-zen file untouched');
}

if (!update) {
  const total = inputs.length + 2;
  console.log(`\n${total - failed}/${total} passed`);
  if (failed) process.exit(1);
}
