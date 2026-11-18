import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) return files(p)
    return /\.(ts|tsx)$/.test(f) && !f.endsWith('.test.ts') ? [p] : []
  })
}

const SRC = join(process.cwd(), 'src')
const all = files(SRC).map((p) => ({ p, text: readFileSync(p, 'utf8') }))

describe('copy rules', () => {
  it('never uses "safe" or "guaranteed" as a verdict (app name and "Eating safely" heading excepted)', () => {
    for (const { p, text } of all) {
      const cleaned = text.replace(/Safe Plate/g, '').replace(/safeplate/gi, '')
      expect(cleaned, p).not.toMatch(/\bsafe\b/i)
      expect(cleaned, p).not.toMatch(/\bguaranteed\b/i)
    }
  })

  it('states the guide-not-guarantee note', () => {
    const ui = all.find((f) => f.p.endsWith('components/ui.tsx'))!.text
    expect(ui).toMatch(/guide, not a guarantee/)
    expect(ui).toMatch(/confirm with staff/i)
    expect(ui).toMatch(/epinephrine/i)
  })

  it('marks seed data as sample data', () => {
    const venues = all.find((f) => f.p.endsWith('data/venues.ts'))!.text
    expect(venues).toMatch(/SAMPLE DATA/)
  })
})
