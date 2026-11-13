import { execSync, readFileSync, readdirSync } from 'fs';
import { gzipSync } from 'zlib';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

describe('Build & Bundle', () => {
  it('should pass strict type checking (AC 1)', () => {
    expect(() => {
      execSync('pnpm typecheck');
    }).not.toThrow();
  });

  it('should produce client JS bundle under 100KB gzipped (AC 4)', async () => {
    execSync('pnpm build');
    const staticDir = join('.next', 'static', 'chunks');
    const files = readdirSync(staticDir).filter(f => f.endsWith('.js'));
    let totalSize = 0;
    for (const file of files) {
      const buf = readFileSync(join(staticDir, file));
      const gz = gzipSync(buf);
      totalSize += gz.byteLength;
    }
    expect(totalSize).toBeLessThan(102400);
  });
});