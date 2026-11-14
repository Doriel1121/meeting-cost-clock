import { describe, it, expect, vi } from 'vitest';
import { db } from '../src/db/index.js';

describe('DB Environment Validation (AC 2)', () => {
  it('should throw error when DATABASE_URL is missing', () => {
    vi.stubEnv('DATABASE_URL', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => {
        require('../src/db/index.js');
    }).toThrow('DATABASE_URL environment variable is mandatory');
  });
});