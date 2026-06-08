---
name: amazon-aplus-content
description: Create, restructure, audit, and brief Amazon A+ Content as a connected branded product detail page workflow with desktop and mobile image variants. Use when the user uploads competitor A+ screenshots, competitor listing pages, product information, marketplace, title/bullet/keyword context, seven-image plan, brand style references, logos, product line data, product images, or asks for Amazon A+, A Plus, brand story, comparison chart, module layout, A+ copy, enhanced brand content, EBC, visual direction, desktop/mobile A+ image prompts, or below-the-fold product page content.
---

# Amazon Aplus Content

## Workflow

1. Read `references/playbook.md` before designing or auditing A+ content.
2. Confirm the exact product before planning: product name/model, quantity, visible product appearance, compatibility, included parts, and target marketplace. Prefer asking for or using at least one clear product image. If no product image is available, state that the visual plan is provisional and list the product details that must be confirmed.
3. Gather product facts, target marketplace, title/bullet/keyword context, seven-image plan, brand positioning, logo, brand style references, product line data, available images, differentiators, FAQs, buyer objections, and competitor A+ or listing screenshots.
4. Analyze competitor A+ first: module structure, visual style, sales angles, scene choices, trust cues, comparison table use, and risky elements to avoid.
5. Define the A+ strategy and continuous page storyline. A+ is a connected scrolling experience, not a set of unrelated standalone images. It should extend and deepen the listing, not repeat the title, bullets, or main images.
6. Plan 5-7 modules based on buyer friction and narrative flow: product identification, why it matters, feature proof, usage scenario, installation/use steps, specs, compatibility, product-line comparison, brand trust, or FAQ.
7. For each module, output the module theme, purpose, connection to previous/next module, layout, heading, body copy, desktop image direction and prompt, mobile image direction and prompt, required assets, and compliance risks.
8. Include a product-line comparison chart when it helps buyers choose the right model, size, bundle, or variant.
9. End with risk/exclusion terms, missing facts, and an A+ self-check.
10. If A+ images are generated, finish with a post-generation image QA pass: verify each delivered desktop image is 1464 x 600 px, each mobile image is 600 x 450 px, inspect image text for banned terms, check for competitor/third-party brand infringement, and flag any Amazon policy risks before final delivery.

## Output Format

Use this structure unless the user requests another format:

- A+ strategy
- Product confirmation
- Competitor A+ analysis
- Brand visual direction
- Continuous A+ storyline
- Module sequence
- For each module:
  - Module theme
  - Module purpose
  - Connection to previous/next module
  - Layout
  - Heading
  - Body copy
  - Desktop image direction, 1464 x 600 px
  - Desktop image-generation prompt
  - Mobile image direction, 600 x 450 px
  - Mobile image-generation prompt
  - Asset notes
- Comparison chart if useful
- Brand story block if useful
- Risk/exclusion terms
- A+ self-check and missing facts
- Post-generation image QA report, required when images were generated

## Style Rules

- Keep headings benefit-led and specific.
- Use A+ modules to explain why the product matters, how to use it, and why the brand can be trusted.
- Use A+ to answer deeper questions that the main images and bullets do not fully answer.
- Treat A+ as one continuous buyer journey. Maintain consistent visual rhythm, color, logo placement, product appearance, terminology, and benefit hierarchy across modules.
- Do not plan or generate final A+ images until the product identity is confirmed. Prefer using a real product image to prevent wrong product shape, color, model, quantity, or included parts.
- Avoid long paragraphs.
- Use comparison charts only when they help buyers choose among real variants.
- Do not include prices, promotions, review quotes, external links, seller contact details, or unsupported claims.
- Do not copy competitor A+ module order, layout, graphic devices, scene composition, icons, or brand styling directly.
- Do not use competitor brands, logos, packaging, watermarks, or trademarked visual assets.
- Avoid `Original`, `Genuine`, `OEM`, `official`, `factory`, original-factory implications, and unsupported compatibility claims.
- If the user provides brand references, maintain consistency in brand color, logo placement, typography tone, image mood, and level of technical detail.
- For every visual module, plan both PC and mobile A+ variants: desktop image size `1464 x 600 px`, mobile image size `600 x 450 px`.
- Keep the mobile image content aligned with the PC version, but simplify, recompose, enlarge key elements, and reduce text when needed for mobile browsing.

## Post-Generation Image QA

When final A+ images are generated or exported, perform this check before the final response:

- Verify every delivered file has the required pixel size: desktop `1464 x 600 px`; mobile `600 x 450 px` unless the user requested another size.
- Inspect all visible image text for banned or risky terms, including `Original`, `Genuine`, `OEM`, `official`, `factory`, unsupported `HEPA`, unsupported percentages, prices, promotions, review/rating language, external links, seller contact details, and warranty/guarantee claims without proof.
- Check for brand infringement risks: competitor logos, trademarked packaging, copied competitor layouts, recognizable third-party product branding, watermarks, or proprietary badges.
- Check for Amazon A+ content risks: price or discount claims, review stars or quotes, unverifiable certifications, medical/safety claims, exaggerated performance claims, misleading compatibility, or unsupported universal-fit language.
- Report the QA result in the final answer with file names, dimensions, pass/fail status, and any issues that need manual correction. If any image fails, do not present it as final without clearly marking the issue.


