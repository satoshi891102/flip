# Validation — Flip

## 1. Can you explain the value in one sentence?
Snap a photo of anything you want to sell → get a perfect marketplace listing with title, description, price, and category in 5 seconds.

## 2. Does the core mechanism actually work?
Yes. Vision models (Claude/GPT-4o) can identify products from photos with high accuracy. eBay's completed listings API provides real sold-price data for pricing comps. The generation is straightforward prompt engineering.

## 3. Who would use or pay for this?
- Facebook Marketplace resellers (millions globally)
- eBay sellers doing 10+ listings/week
- Thrift flippers (huge community on X/TikTok — #thriftflip has 4B+ TikTok views)
- Estate sale resellers
- Small vintage/secondhand shops
- Anyone doing a garage sale or decluttering
Specific: someone who buys 20 items at a thrift store and needs to list all of them. 15 min each = 5 hours. With Flip = 10 minutes total.

## 4. What's the fatal flaw?
- Pricing accuracy depends on eBay comps — niche/rare items may not have good comps
- Vision model costs per photo (~$0.01-0.03) eat into margins at free tier
- Marketplace APIs for cross-posting are fragmented and some don't exist (FB Marketplace has no public API)
- Mitigations: Start with copy-paste workflow (no API cross-posting needed for v1). Pricing is "suggested" not guaranteed. Free tier limited to 3/day to control costs.

## Verdict: BUILD
Strong value prop, clear audience, real pain point, revenue path. Fatal flaws are manageable.
