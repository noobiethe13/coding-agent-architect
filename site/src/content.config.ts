import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const blueprintSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(300),
  tool: z.enum(['claude-code', 'cursor', 'copilot', 'windsurf', 'codex']),
  type: z.enum(['agent', 'skill', 'rule', 'setup']),
  author: z.string().min(1).max(100),
  verified_version: z.string().regex(
    /^\d+(\.\d+)+$/,
    'Must be a version number like 2.1.143 or 1.0.0'
  ),
  recommended_model: z.string().max(80).optional(),
  tags: z
    .array(
      z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Tags must be lowercase kebab-case')
    )
    .max(10)
    .optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: blueprintSchema,
    }),
  }),
};
