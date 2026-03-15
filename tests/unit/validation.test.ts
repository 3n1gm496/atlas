import { describe, it, expect } from 'vitest';
import { entryCreateSchema, entryFilterSchema } from '../../lib/validation/entry';

describe('entry validation', () => {
  it('accepts valid create payload', () => {
    const parsed = entryCreateSchema.parse({
      slug: 'entry-001',
      title: 'Titolo entry',
      abstract: 'Abstract sufficientemente lungo.',
      description: 'Descrizione molto più lunga di venti caratteri per passare.',
      countryId: 'country-id',
      canonicalLanguage: 'it'
    });

    expect(parsed.slug).toBe('entry-001');
  });

  it('rejects invalid create payload', () => {
    expect(() =>
      entryCreateSchema.parse({
        slug: 'a',
        title: 'x',
        abstract: 'short',
        description: 'tiny',
        countryId: '',
        canonicalLanguage: 'de'
      })
    ).toThrow();
  });

  it('normalizes pagination filters', () => {
    const parsed = entryFilterSchema.parse({ page: '2', pageSize: '25' });
    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(25);
  });
});
