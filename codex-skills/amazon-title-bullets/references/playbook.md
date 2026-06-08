# Amazon Title and Five Bullet Playbook

## Input Checklist

- Marketplace and language
- Category and product type
- Brand name
- Target buyer and use case
- Competitor titles and five bullets
- Competitor keyword library
- Search volume for each keyword
- Product specifications: size, color, material, quantity, model, compatibility
- Compatible models and replacement model list
- Differentiators and proof points
- Competitor examples or ASIN notes
- Compliance restrictions, forbidden terms, and claims to avoid

## Required Work Order

1. Organize the keyword library before writing any copy.
2. Classify keywords in a table.
3. Study competitor writing patterns and keyword placement.
4. Draft title copy only for the marketplace or marketplaces the user specifies.
5. Rewrite five bullets for each specified marketplace language, with Chinese translation under each bullet.
6. Generate backend Search Terms.
7. Summarize coverage, risks, and missing facts.

## Keyword Classification Table

Classify every keyword the user provides. Preserve the exact keyword and search volume.

Required columns:

| Type | Keyword | Search Volume | Notes |
| --- | --- | --- | --- |

Use `无数据` when search volume is not provided.

Recommended keyword types:

- Core head terms: main product/category terms with the highest buyer intent.
- Product attribute terms: material, size, quantity, color, function, feature, or pack-count terms.
- Model terms: exact model numbers the product fits.
- Replacement model terms: replacement part numbers, alternate model numbers, old/new model versions.
- Compatibility terms: compatible device, machine, cartridge, accessory, or product line terms.
- Usage scenario terms: where, when, or how buyers use the product.
- Pain point/benefit terms: problem, result, or benefit terms.
- Long-tail terms: longer phrases with clear intent but lower priority for title.
- Backend candidates: useful terms that are not natural in title or bullets.
- Risk/excluded terms: competitor brands, `Original`, `Genuine`, `OEM`, official/factory implications, or unsupported claims.

## Competitor Analysis

Summarize patterns without copying:

- Repeated title structures.
- High-frequency core terms.
- Common model or compatibility wording.
- Benefit angles competitors emphasize.
- Claims or phrases to avoid.
- Gaps the user's product can cover.

## Title Rules

Use a readable version of this order:

Brand + primary keyword/product type + defining feature + material/spec + compatibility/use case + size/quantity/color

Adjust by category. Put the most searched product phrase near the front, but do not make the title feel like a keyword list.

For German marketplace titles:

- Make the title natural for German buyers.
- Use `kompatibel mit` for compatibility.
- Avoid `Original`, `Genuine`, `OEM`, `offiziell`, `original`, `Originalteil`, `Erstausruster`, and competitor brand terms in the title.
- Use German grammar first, keyword coverage second.
- If model numbers are important, include the highest-priority models without turning the title into a model dump.

For US marketplace titles:

- Make the title natural for US buyers.
- Use `compatible with` for compatibility.
- Avoid `Original`, `Genuine`, `OEM`, `official`, `factory`, and competitor brand terms in the title.
- Prioritize core keywords and the most conversion-relevant specs.

For other marketplace titles:

- Write in the target marketplace language unless the user asks otherwise.
- Use local buyer phrasing and natural grammar.
- Apply the same risk controls: no original/factory implication, no unsupported claims, no competitor brand terms unless explicitly approved.

## Five Bullet Strategy

1. Core value: explain the main reason to buy.
2. Proof: show the feature, material, build quality, or performance detail that supports the value.
3. Scenario: connect the product to real buyer use cases.
4. Fit and facts: include compatibility, dimensions, package contents, installation, care, or limitations.
5. Confidence: include support, gift use, storage, warranty, or reassurance only when true.

For each marketplace bullet, add one Chinese translation directly below it.

Do not use competitor brand names in bullets unless the user explicitly requires legally reviewed compatibility wording. Prefer generic compatibility wording and model numbers.

## Copy Checks

- Each bullet should have a distinct job.
- Use concrete nouns and product facts.
- Avoid repeating the same keyword phrase in every bullet.
- Replace vague claims like "premium quality" with evidence such as material, construction, certification, or included parts.
- Avoid prohibited or risky phrases such as cure, treat, guaranteed results, best, number one, FDA approved, eco-friendly, non-toxic, or lifetime unless the user provides proof and category rules allow them.
- Do not mention discounts, shipping, reviews, ratings, seller rank, or competitor brands unless the user explicitly asks for a comparison outside the listing copy.

## Backend Search Terms

Create backend Search Terms after titles and bullets are finished.

Prioritize:

- Long-tail keywords not covered in the title.
- No-umlaut German spellings, such as `fuer`, `grosse`, `geraet`, `zubehoer`, when relevant.
- Model terms and replacement model terms not included in the title.
- Synonyms and alternate phrasing that are natural search inputs but awkward in customer-facing copy.
- Singular/plural variants only when they add real coverage.

Avoid:

- Competitor brand names unless the user explicitly confirms they are allowed for backend use.
- Repeating title phrases.
- Promotional terms, claims, subjective adjectives, punctuation stuffing, or irrelevant traffic terms.
- `Original`, `Genuine`, `OEM`, official/factory implications, and misspellings that could imply counterfeit or affiliation.

## Deliverable Template

```text
Keyword Classification:
| Type | Keyword | Search Volume | Notes |
| --- | --- | --- | --- |
| Core head term | [keyword] | [volume or 无数据] | [why it matters] |

Competitor Wording Summary:
- [pattern]
- [gap or caution]

Marketplace Title - [Marketplace]:
[title]

Bullet Points - [Marketplace]:
1. [marketplace-language bullet]
中文翻译：[Chinese translation]

2. [marketplace-language bullet]
中文翻译：[Chinese translation]

3. [marketplace-language bullet]
中文翻译：[Chinese translation]

4. [marketplace-language bullet]
中文翻译：[Chinese translation]

5. [marketplace-language bullet]
中文翻译：[Chinese translation]

Backend Search Terms:
[space-separated backend terms]

Keyword Notes:
[covered terms, uncovered terms, model coverage]

Risk Check:
[claims, missing facts, or compliance issues]
```
