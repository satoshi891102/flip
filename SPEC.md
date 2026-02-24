# Spec — Flip

## What
AI-powered marketplace listing generator. Photo in → complete listing out.

## Pages (5)
1. **Home/Camera** — Upload photo or take one. Hero explains the value. CTA: "List it"
2. **Generate** — Shows photo, AI analyzes it, generates listing in real-time. Editable fields: title, description, price, category, condition. "Copy All" button.
3. **History** — Past listings with photos, timestamps. Tap to re-copy or edit.
4. **Pricing** — Free (3/day) vs Pro ($9/mo unlimited). Stripe checkout.
5. **Settings** — Default marketplace preference, currency, location (for local pricing context)

## Core Flow
1. User opens app → taps camera icon or uploads photo
2. Photo sent to vision API → identifies item, brand, condition, features
3. Parallel: eBay completed listings API → finds sold comps for pricing
4. Generates: SEO title, detailed description, suggested price (with range), category tags
5. User edits if needed → copies to clipboard → pastes into marketplace

## Tech Stack
- Next.js 15, React 19, Tailwind v4
- DesignKit scaffold (palette TBD — probably something fresh/commercial)
- Anthropic Claude API (vision) or OpenAI GPT-4o (vision) — whichever we have keys for
- eBay Browse API (completed items for pricing)
- localStorage for listing history
- Stripe for payments (later — v1 is free)
- PWA for mobile install

## Design Direction
- Clean, fast, commercial feel
- Think: Depop meets Linear
- Mobile-first (this is a phone app)
- Big photo preview, clean generated text
- Green accent = money/selling vibe
- Dark mode default

## API Keys Needed
- Anthropic API key (have it via OpenClaw)
- eBay Browse API (free, needs developer account — or use web scraping fallback)

## MVP (tonight)
- Photo upload → vision analysis → listing generation
- Copy to clipboard
- Listing history (localStorage)
- Mobile-first PWA
- Deployed to Vercel

## Post-MVP
- eBay pricing comps integration
- Stripe payments
- Multi-photo support
- Batch mode (photograph a shelf → list everything)
- Platform-specific formatting (eBay vs FB vs Gumtree)
