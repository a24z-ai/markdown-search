# Search results ranking prioritizes partial matches over exact matches

**Issue #2** • Opened by [@SquallLeonhart13](https://github.com/SquallLeonhart13) on 10/6/2025

**Status:** open

**Labels:** bug, ranking, approved


[View on GitHub](https://github.com/a24z-ai/markdown-search/issues/2)

---

## Problem
The search results ranking algorithm is not properly prioritizing exact matches. When searching for specific terms, documents with partial matches are being ranked higher than documents with exact matches.

## Example
Searching for "installation" returns results in this order:
1. Documents containing "install" (partial match)
2. "Installation Guide" page (exact match)

The exact match should be ranked higher than partial matches.

## Expected Behavior
Exact matches should receive higher relevance scores and appear at the top of search results, followed by partial matches.

## Impact
This makes it difficult for users to quickly find the specific content they're looking for, resulting in a poor search experience.

## Suggested Fix
Adjust the scoring algorithm to give higher weight to exact term matches versus partial/substring matches.
