---
name: amazon-main-images
description: Plan, brief, audit, and generate image prompts for a seven-image Amazon listing image set for the user's specified marketplace, including US and German marketplace products. Use when the user uploads competitor product images, product information, brand style references, logos, title/bullet/keyword context, or asks for Amazon 主图, 7张图, white-background main image, infographic copy, lifestyle image direction, product rendering guidance, image compliance checks, or image-generation prompts.
---

# Amazon Main Images

## Workflow

1. Read `references/playbook.md` before creating or auditing a seven-image sequence.
2. Parse the user's competitor product images, product information, product category, marketplace, title/bullet/keyword context, brand style references, logo files, and available product assets.
3. Start by extracting competitor image insights: product type, repeated composition patterns, visual hierarchy, sales angles, callout style, color use, and trust cues.
4. Define a new image design direction that fits the user's brand, product category, and specified Amazon marketplace. Do not copy competitor composition.
5. Plan seven images as a conversion sequence. Image 1 must be a compliant white-background main image.
6. For each image, output the theme, layout, German on-image copy if useful, required assets, and a ready-to-use image-generation prompt.
7. Flag missing assets, logo/style mismatches, unsupported claims, competitor brand usage, and image compliance risks.

## Output Format

Use this structure unless the user requests another format:

- Overall visual strategy
- Competitor image insight summary
- Brand/style direction
- Image 1 through Image 7, each with:
  - Theme
  - Layout
  - On-image copy
  - Image-generation prompt
  - Required assets
  - Notes and risks
- Missing information

## Style Rules

- Keep on-image copy short enough to read on mobile.
- Make every image do a different job.
- Prefer real product clarity over decorative effects.
- Do not place claims, seals, certifications, or comparison statements unless the user provides proof.
- Treat Image 1 as the most compliance-sensitive image.
- Never copy competitor layouts, product staging, graphic devices, icon sets, or brand styling directly.
- Do not use competitor brands, logos, packaging, watermarks, or trademarked visual assets.
- For German marketplace tool/accessory products, keep the style clean, professional, trustworthy, precise, and practical.
- For US marketplace products, keep the style clear, benefit-led, conversion-focused, and easy to understand on mobile.
- For any other marketplace, adapt the visual tone, on-image language, and buyer expectations to that market.
- Keep the user's brand style and logo usage consistent across images when brand references are provided.
- Use title, bullet, and keyword context to strengthen image messaging, but avoid stuffing text into images.
