# Amazon Seven-Image Playbook

## Input Checklist

- Target marketplace and language
- Competitor product images
- Product information: product type, material, dimensions, color, quantity, package contents, compatibility, use cases
- Existing title, bullets, keywords, or backend keyword notes if available
- Brand style references, logo, brand colors, fonts, packaging, or prior listing images
- Available product photos, renderings, lifestyle assets, certifications, and proof for claims
- Forbidden words, competitor brands, or visual elements to avoid

## Competitor Image Insight

Extract insights before planning:

- Product type and buyer expectation.
- Main image presentation: angle, scale, shadow, package visibility, included accessories.
- Repeated composition patterns across competitors.
- Common infographic claims and visual callouts.
- Lifestyle scenes or use environments.
- Trust cues such as material close-ups, compatibility diagrams, dimensions, package contents, or installation steps.
- Visual gaps the user's listing can own.

Use competitor images as market reference only. Do not copy composition, background scenes, icons, diagrams, color blocking, text hierarchy, or proprietary visual style.

## Marketplace Style Direction

For Amazon Germany tool and accessory listings:

- Use clean product-first composition, precise spacing, and restrained typography.
- Prefer practical, technical, and credible visuals over decorative lifestyle scenes.
- Use neutral backgrounds, light gray technical surfaces, workshop/garage context, or clean installation context when relevant.
- Use German on-image copy only when it improves scanning.
- Keep claims factual and tied to product information.
- Use brand colors and logo consistently when provided, but do not overpower the product.

For Amazon US listings:

- Use clear, benefit-led visual hierarchy and mobile-readable callouts.
- Make the value proposition easy to understand quickly.
- Use clean lifestyle or use-case scenes when they help conversion.
- Keep the product large, sharp, and central to the message.
- Use concise English on-image copy only where it helps scanning.
- Avoid exaggerated results, unsupported claims, and cluttered badge-heavy layouts.

For other Amazon marketplaces:

- Match the target marketplace language and buyer expectations.
- Keep the style product-first and compliant.
- Use local text only when it improves comprehension.

## Standard Seven-Image Sequence

1. Main image: product-only hero that clearly shows what is sold.
2. Core benefit infographic: one decisive buyer benefit with concise callouts.
3. Feature proof: materials, construction, dimensions, performance, or included components.
4. Use scenario: lifestyle scene that helps the buyer imagine ownership.
5. Problem and solution: show the buyer pain point and how the product solves it.
6. Comparison or bundle detail: compare product versions, package contents, size, compatibility, or before/after only when truthful and allowed.
7. Trust closer: care instructions, storage, gifting, warranty/support, certification, or brand promise when substantiated.

## Image 1 Compliance Guardrails

- Use a clean white or marketplace-appropriate background when required.
- Show only what is included in the purchase.
- Avoid badges, watermarks, props that imply inclusion, excessive text, review stars, promotional claims, or seller information.
- Keep the product large and clear.
- Avoid competitor product, competitor packaging, decorative props, badges, and any on-image text.

## Mobile Copy Rules

- Use one headline per image.
- Keep supporting text short.
- Prefer numbers, icons, and callout labels over paragraphs.
- Avoid tiny comparison tables unless the product requires exact compatibility or sizing detail.

## Image-Generation Prompt Rules

For every image prompt:

- Specify the target marketplace style, such as Amazon US or Amazon Germany, based on the user's stated marketplace.
- Specify exact product type and visible product details from the user's information.
- Specify composition, camera angle, background, lighting, and layout.
- Specify where text/callouts should appear if text is needed.
- Specify brand style and logo placement only when assets are provided.
- Include a negative instruction: no competitor brand, no copied competitor layout, no extra unlisted accessories, no unrealistic claims, no watermark.
- For Image 1, require a pure white background and product-only composition.

## Production Brief Template

```text
Competitor Image Insights:
[summary]

Brand/Style Direction:
[summary]

Image [number]: [theme]
Layout:
On-image copy:
Image-generation prompt:
Required assets:
Compliance/risk notes:
```

## Audit Checklist

- Does the first image identify the product in under two seconds?
- Does each following image answer a different buyer question?
- Are dimensions, compatibility, and package contents visible where relevant?
- Is the copy legible on mobile?
- Are all claims supported by provided facts?
- Are props clearly not included or avoided?
