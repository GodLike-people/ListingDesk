---
name: sellersprite-keyword-reverse
description: "Use the user's signed-in Chrome session to run SellerSprite keyword reverse lookup for an Amazon ASIN, export all available paginated keyword results, clean the exported Excel to the user's required 14-column schema, and save the cleaned workbook. Trigger when the user asks for 卖家精灵关键词反查, ASIN流量词下载, SellerSprite keyword export, or cleaning a SellerSprite reverse-ASIN Excel file."
---

# SellerSprite Keyword Reverse

Use Chrome with the user's existing SellerSprite login, export the complete keyword result set, then run the bundled cleaner.

## Inputs

Obtain or infer:

- ASIN.
- Amazon marketplace; default to US when omitted.
- Output directory; default to `D:\ListingDesk\sellersprites`.
- Maximum keyword count when provided. If fewer results exist, export all available rows and report the actual count.

## Browser workflow

1. Use the installed Chrome plugin and its `control-chrome` workflow. Do not use the in-app Browser because it lacks the user's login state.
2. Claim an already-open SellerSprite tab when one matches. Otherwise open SellerSprite's keyword reverse lookup page.
3. Verify the user is signed in. If login, CAPTCHA, two-factor verification, or a payment/plan prompt appears, stop and hand control to the user. Never bypass it.
4. Select the requested marketplace, enter the ASIN, and run `关键词反查`.
5. Verify the visible marketplace, ASIN, date range, total traffic-word count, filtered result count, and pagination before exporting.
6. Use the button labeled `导出`. Do not use `导出明细`.
7. Export all filtered results across pagination. If the site limits direct export to selected rows or the current page, use the visible select-all/all-results control or export each page and merge before cleaning. Do not silently return only page 1.
8. Wait for the `.xlsx` file to finish downloading. Identify it by ASIN and recent modification time; do not select an older similarly named file.

## Clean the workbook

Run:

```text
python scripts/clean_sellersprite_excel.py <downloaded.xlsx> <output-directory>
```

The cleaner creates `<source-name>-cleaned.xlsx` and keeps exactly these columns in this order:

1. 关键词
2. 预估周曝光量
3. 关键词类型
4. 流量词类型
5. 自然流量占比
6. 广告流量占比
7. 自然排名
8. 自然排名页码
9. 广告排名
10. 广告排名页码
11. ABA周排名
12. 月搜索量
13. SPR
14. 建议竞价范围

Preserve numeric values. Format the two traffic-share columns as percentages. Add an autofilter and freeze the header row.

If the output directory is outside the writable workspace, request scoped approval before saving or moving the cleaned file. Preserve the original download unless the user explicitly asks to delete it.

## Verification

Before reporting completion:

- Confirm the cleaned workbook exists in the requested directory.
- Confirm it contains exactly 14 columns with the required headers.
- Confirm the cleaned data-row count matches the exported data-row count after excluding blank rows.
- Report the marketplace, ASIN, available/exported keyword count, final filename, and full path.
