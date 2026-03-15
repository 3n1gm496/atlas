import { z } from 'zod';

export const entryStatuses = [
  'draft',
  'submitted',
  'under_review',
  'changes_requested',
  'approved',
  'published',
  'rejected',
  'archived'
] as const;

export const trendMetadataSchema = z.object({
  typologicalObjective: z.array(z.string()).default([]),
  thematicCategories: z.array(z.string()).default([]),
  preferredPractices: z.array(z.string()).default([]),
  culturalFramings: z.array(z.string()).default([]),
  technoCreativeFormats: z.array(z.string()).default([]),
  tones: z.array(z.string()).default([]),
  scriptoIconicSubcategories: z.array(z.string()).default([]),
  microforms: z.array(z.string()).default([]),
  trendSummary: z.string().max(500).optional()
});

export const entryFilterSchema = z.object({
  q: z.string().trim().optional(),
  country: z.string().trim().optional(),
  status: z.enum(entryStatuses).optional(),
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
  canonicalLanguage: z.enum(['it', 'en', 'fr']).default('it'),
  placeName: z.string().trim().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  sourceContext: z.string().trim().optional(),
  timePeriodLabel: z.string().trim().optional(),
  taxonomyTermIds: z.array(z.string().min(1)).default([]),
  keywords: z.array(z.string().min(2)).default([]),
  hashtags: z.array(z.string().min(2)).default([]),
  trendMetadata: trendMetadataSchema.optional()
});

export const entryPatchSchema = z.object({
  slug: z.string().min(3).optional(),
  title: z.string().min(3).optional(),
  abstract: z.string().min(10).optional(),
  description: z.string().min(20).optional(),
  canonicalLanguage: z.enum(['it', 'en', 'fr']).optional(),
  placeName: z.string().trim().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  sourceContext: z.string().trim().optional(),
  timePeriodLabel: z.string().trim().optional(),
  status: z.enum(entryStatuses).optional(),
  featured: z.boolean().optional()
});
