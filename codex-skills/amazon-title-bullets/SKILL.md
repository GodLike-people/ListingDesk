---
name: amazon-title-bullets
description: Create, rewrite, audit, and optimize Amazon listing titles, five bullet points, keyword classification tables, and backend Search Terms for the user's specified Amazon marketplace. Use when the user uploads competitor Amazon titles or bullets, competitor keyword libraries, search volume data, product information, model compatibility lists, or asks for marketplace-specific title and bullet copy with Chinese translations, keyword coverage, or compatibility-safe wording.
---

# Amazon Title Bullets

## Workflow

1. Read `references/playbook.md` before drafting or auditing.
2. Parse the user's competitor titles, competitor five bullets, keyword library, search volumes, product facts, compatible models, and forbidden terms.
3. Normalize the keyword library first. Classify every keyword by type and preserve its search volume. If volume is missing, write `无数据`.
4. Analyze competitor wording patterns only as reference. Do not copy competitor phrasing, competitor brand terms, or unsupported claims.
5. Draft titles only for the marketplace or marketplaces the user specifies. If the user specifies one marketplace, output one title only. Prioritize core keyword coverage while keeping natural grammar.
6. Rewrite five bullets only for the specified marketplace language or languages. Put a Chinese translation directly under every bullet.
7. Produce backend Search Terms with long-tail terms, no-umlaut German spellings, and model terms not covered by the title.
8. End with keyword coverage notes, excluded/risky terms, and missing facts to confirm.

## Output Format

Use this structure unless the user requests another format:

- Keyword classification table
- Competitor wording summary
- Marketplace title for each user-specified marketplace
- Marketplace bullet points with Chinese translation under each bullet
- Backend Search Terms
- Keyword coverage notes
- Risk check and facts to confirm

## Style Rules

- Prioritize clarity, scannability, and buyer intent over keyword stuffing.
- Keep the title readable and front-load the most important buyer search terms.
- Make each bullet lead with a benefit, then support it with concrete product facts.
- Vary sentence openings across the five bullets.
- For German marketplace copy, write for German buyers and use `kompatibel mit` to express compatibility.
- For US marketplace copy, use natural American English and use `compatible with` to express compatibility.
- For any other marketplace, follow the local buyer language, grammar, search behavior, and compatibility wording conventions.
- Avoid `Original`, `Genuine`, `OEM`, `authentic`, `official`, `factory`, original-factory implications, and competitor brand terms in customer-facing copy unless the user explicitly confirms legal permission.
- Preserve the user's brand tone when provided, but keep marketplace copy clean, buyer-focused, and compliance-aware.
