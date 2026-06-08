# Amazon A+ Content Playbook

## Input Checklist

- Target marketplace and language
- Clear product image, preferably showing the exact product variant, color, quantity, included accessories, and packaging if relevant
- Product information: type, specs, material, dimensions, color, quantity, package contents, compatibility, use cases
- Existing title, bullets, keywords, Search Terms, and seven-image plan if available
- Competitor A+ screenshots, competitor listing screenshots, or competitor page notes
- Brand style references, logo, brand colors, fonts, packaging, previous A+ examples, or brand story
- Product line or variant information for comparison charts
- Buyer objections, FAQs, return reasons, installation/use concerns
- Claims, certifications, warranties, or proof documents
- Forbidden words, competitor brands, or visual elements to avoid

## Product Confirmation Gate

Before planning or generating final A+ content:

- Confirm the exact product name, model, quantity, color, material, included parts, and target marketplace.
- Prefer using at least one clear product image as the source of truth for shape, color, texture, scale, and included accessories.
- Check product details against the title, bullets, keywords, seven-image plan, and competitor references.
- If product information conflicts, pause and flag the mismatch before writing or generating final assets.
- If no product image is provided, proceed only with a provisional plan and clearly mark assumptions to confirm.
- Do not carry model numbers, product names, or compatibility from competitor images or brand style references into the user's product.

## Competitor A+ Analysis

Analyze competitor material before planning:

- Module sequence and content hierarchy.
- Visual style: color palette, typography mood, product scale, lifestyle vs technical balance.
- Main sales angles and repeated benefit claims.
- Scene choices and use-case storytelling.
- Trust cues: specs, certifications, quality proof, installation steps, package contents, care instructions.
- Comparison table structure and product-line positioning.
- Content gaps the user's A+ can own.
- Risky elements to avoid, such as competitor brands, unsupported claims, copied layouts, reviews, ratings, discounts, and external links.

Use competitor A+ as market reference only. Do not copy module order, layout, diagrams, icons, color blocking, scene composition, or proprietary visual style.

## A+ Strategy

A+ should not repeat the title, bullets, or seven main images. Use it to:

- Explain what the product is and why it matters.
- Expand the product's strongest differentiators.
- Show practical use scenarios.
- Reduce buyer doubt around size, compatibility, installation, material, quality, or maintenance.
- Establish brand credibility.
- Help buyers choose the right variant, kit, size, or model.

## Continuous Page Storyline

Plan A+ as a connected scrolling page rather than independent banners:

- Define one page-level promise before designing modules.
- Give each module a clear job and a reason to appear in that order.
- Maintain consistent product appearance, brand color, logo placement, typography mood, icon style, and terminology.
- Use visual pacing: hero, proof, scenario, practical details, comparison or trust closer.
- Avoid repeating the same product angle, headline structure, icon row, or benefit in every module.
- Carry buyers from recognition to confidence: what it is, why it fits, how it performs, where it is used, what is included, and why the brand is trustworthy.
- Make desktop and mobile variants feel like the same page, even when mobile composition is simplified.

## Common Module Flow

1. Brand or product hero: establish the product promise with a strong visual.
2. Problem and solution: explain the buyer need and how the product addresses it.
3. Feature deep dive: show 2-4 important features with benefit-led headings.
4. Lifestyle or use case: help the buyer picture the product in context.
5. Specs, package, or compatibility: answer practical objections.
6. Comparison chart: compare variants, sizes, bundles, or related products when available.
7. Brand story or trust closer: communicate brand values, quality control, support, or care.

## Module Selection Guide

- Use education modules when the product is technical, new, or misunderstood.
- Use lifestyle modules when the product depends on emotional fit, decor, gifting, apparel, pets, beauty, or home use.
- Use comparison modules when the brand has multiple SKUs or buyer choice is confusing.
- Use specs modules when fit, size, compatibility, installation, or material is a key purchase blocker.
- Use FAQ-style modules when returns or negative reviews often come from misunderstanding.

## Brand Visual Direction

When brand references are provided:

- Learn the brand colors, typography mood, logo usage, image brightness, product staging, and graphic density.
- Keep logo placement consistent and restrained.
- Match the brand's level of technical detail and lifestyle warmth.
- Make A+ feel related to the main image set without duplicating it.

When no brand reference is provided:

- Choose a clean, product-first direction suitable for the target marketplace and category.
- Keep visual hierarchy simple and mobile-readable.
- Avoid decorative design that does not clarify the product.

## Desktop and Mobile A+ Variants

Plan both image variants for every visual module:

- PC/Desktop A+ image size: `1464 x 600 px`.
- Mobile A+ image size: `600 x 450 px`.
- Keep the same module message across both variants.
- Adapt mobile layouts for phone browsing instead of simply cropping the desktop image.
- Reduce secondary elements on mobile.
- Enlarge the product, headline, callouts, and key proof points on mobile.
- Use fewer text blocks on mobile and avoid tiny labels.
- Reposition logo, icons, arrows, and comparison elements so they remain readable.
- If a desktop module uses a wide left/right layout, convert mobile to a stacked, centered, or simplified composition.

## Copy Rules

- Headings should carry the main idea.
- Body copy should be short, concrete, and visually tied to the image.
- Avoid repeating the same feature phrasing from bullets unless expanding with new context.
- Translate technical specs into buyer meaning.
- Keep tone consistent with the brand and category.
- Write in the target marketplace language unless the user asks otherwise.
- Use concise Chinese explanations only when the user asks for internal review or translation support.

## Image-Generation Prompt Rules

For each module prompt:

- Specify the target Amazon marketplace and product category style.
- Specify exact product details from the user's information.
- Specify composition, background, camera angle, lighting, visual hierarchy, and text/callout placement.
- Specify exact output size: desktop `1464 x 600 px` or mobile `600 x 450 px`.
- Include brand style and logo placement when assets are provided.
- Avoid competitor brand, copied competitor layout, extra unlisted accessories, unsupported claims, review stars, discount badges, and watermarks.
- Keep text areas clean and readable if the image will include module headings or callouts.
- For mobile prompts, explicitly request a mobile-optimized layout with larger product, larger headline, fewer callouts, and no desktop-style tiny text.

## Deliverable Template

```text
Competitor A+ Analysis:
- [module pattern]
- [visual style]
- [gaps and risks]

A+ Strategy:
[positioning and buyer friction]

Brand Visual Direction:
[brand style, logo use, image mood]

Module 1: [theme]
Purpose:
Connection to previous/next module:
Layout:
Heading:
Body:
Desktop image direction, 1464 x 600 px:
Desktop image-generation prompt:
Mobile image direction, 600 x 450 px:
Mobile image-generation prompt:
Asset notes:
Risk notes:

Module 2: [theme]
Purpose:
Connection to previous/next module:
Layout:
Heading:
Body:
Desktop image direction, 1464 x 600 px:
Desktop image-generation prompt:
Mobile image direction, 600 x 450 px:
Mobile image-generation prompt:
Asset notes:
Risk notes:

Comparison Chart:
[columns and rows if useful]

Risk / Exclusion Terms:
[terms, claims, or visuals to avoid]

A+ Self-Check:
- Is the exact product confirmed, ideally with a real product image?
- Are all product names, model numbers, colors, quantities, and included parts consistent?
- Does the A+ read as one connected scrolling page instead of unrelated images?
- Does A+ avoid repeating title, bullets, and main images too much?
- Does each module answer a different buyer question?
- Does it fit the target marketplace buyer?
- Does it match the brand style and logo system?
- Does each module include both desktop 1464 x 600 px and mobile 600 x 450 px variants?
- If images were generated, were final exported files verified as exactly 1464 x 600 px for desktop and 600 x 450 px for mobile?
- Is the mobile version recomposed for phone browsing rather than directly cropped from desktop?
- Does it avoid competitor brands and copied layouts?
- If images were generated, were visible words checked for banned terms and risky Amazon policy language?
- If images were generated, were they checked for competitor logos, trademarked packaging, watermarks, proprietary badges, and brand-infringing visual elements?
- Does it avoid prices, promotions, reviews, ratings, external links, seller contact, and unsupported claims?
- Does it confirm compatibility, specs, and product facts?

Missing Facts:
[items to confirm]
```

## Post-Generation Image QA

When A+ images are generated or exported, add a final QA pass before delivery:

- Confirm final image dimensions: desktop `1464 x 600 px`; mobile `600 x 450 px`, unless the user requested another size.
- Read visible image text and flag banned/risky words: `Original`, `Genuine`, `OEM`, `official`, `factory`, unsupported `HEPA`, unsupported percentages, prices, discounts, review/rating language, external links, seller contact, and unproven warranty/guarantee claims.
- Inspect visuals for competitor logos, trademarked packaging, copied competitor layouts, watermarks, proprietary badges, and recognizable third-party branding.
- Check Amazon A+ compliance risks: price/promotion claims, review stars or quotes, unverifiable certifications, exaggerated performance claims, misleading compatibility, or unsupported universal-fit language.
- In the final response, include a concise QA report with file names, actual dimensions, pass/fail status, and any items needing correction.

## Compliance Reminders

- Do not include pricing, discounts, shipping promises, review text, star ratings, awards without proof, medical claims, external URLs, seller contact information, or competitor attacks.
- Confirm any certification, warranty, guarantee, safety, sustainability, or performance claim before using it.
- Make comparison charts factual and limited to the brand's own products unless the user explicitly requests a non-listing competitive analysis.


