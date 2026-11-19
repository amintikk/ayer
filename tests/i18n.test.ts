// Every text passed to t() must have an English translation, and placeholders must match.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { SURVEYS } from '../src/data/layers.ts';
import { EN } from '../src/i18n.en.ts';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') && !p.endsWith('i18n.en.ts') ? [p] : [];
  });
}

function keys(): Set<string> {
  // Survey notes are translated at run time with t(s.note).
  const out = new Set<string>(SURVEYS.map((s) => s.note));
  const lit = /'((?:[^'\\]|\\.)*)'/g;
  for (const f of files(new URL('../src', import.meta.url).pathname)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\bt\(((?:'(?:[^'\\]|\\.)*'|[^,()'])+)[,)]/g)) {
      for (const s of m[1]!.matchAll(lit)) out.add(s[1]!.replace(/\\'/g, "'"));
    }
  }
  return out;
}

test('every t() text has an English translation with the same placeholders', () => {
  const missing: string[] = [];
  for (const k of keys()) {
    if (!/\p{L}/u.test(k.replace(/\{\w+\}/g, ''))) continue;
    const en = EN[k];
    if (en === undefined) {
      missing.push(k);
      continue;
    }
    const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
    assert.equal(ph(en), ph(k), `placeholders differ for «${k}»`);
  }
  assert.deepEqual(missing, []);
});
