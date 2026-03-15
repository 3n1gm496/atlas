import { z } from 'zod';

export const entryFilterSchema = z.object({
  q: z.string().trim().optional(),
  country: z.string().trim().optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'changes_requested', 'approved', 'published', 'rejected', 'archived']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12)
});

export const entryCreateSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  abstract: z.string().min(10),
  description: z.string().min(20),
  countryId: z.string().min(1),
  canonicalLanguage: z.enum(['it', 'en', 'fr']).default('it')
});

export const entryPatchSchema = entryCreateSchema.partial().extend({
  status: z.enum(['draft', 'submitted', 'under_review', 'changes_requested', 'approved', 'published', 'rejected', 'archived']).optional(),
  featured: z.boolean().optional()
});
