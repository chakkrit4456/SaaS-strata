import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('tooling smoke test', () => {
  it('resolves @/ path aliases', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
});
