# Kanvtech Solutions — Website

Production-ready static website for **Kanvtech Solutions Private Limited** (kanvtech.com).
20 pages, fully responsive, SEO-tagged, animated with GSAP ScrollTrigger + Lenis, icons by Lucide.
Visual identity is derived entirely from the logo: Deep Navy `#0D1B2A` → Royal Blue `#0E4EA8` → Bright Cyan `#18C3E6`, with Orange `#F59E0B` / `#FF7A00` reserved for CTAs and highlights.

## Structure

```
index.html                 Home (cinematic landing page)
about-us.html              About
solutions-and-services.html  Hub page linking every offering
contact-us.html            Enquiry form + contact details + map
<solution>.html            13 product/service pages (Spine, Tally, App Dev, Cloud, Custom)
privacy-policy.html / terms-and-conditions.html / disclaimer.html
css/style.css              Design system (all tokens at the top)
js/main.js                 Animation & interaction engine (data-attribute driven)
images/logo.png            Company logo (favicon + nav + footer)
tools/generate.js          Static site generator — the source of truth for all HTML
sitemap.xml / robots.txt
```

## Editing pages

**Don't hand-edit the .html files** — they are generated. Edit the copy/data in
`tools/generate.js` and rebuild:

```
node tools/generate.js
```

## Previewing locally

Any static server works, e.g.:

```
npx http-server -p 8080
```

## Before go-live (client checklist)

- **Form backend**: the enquiry form validates client-side and shows the success state,
  but is not wired to a backend yet. Hook it to Formspree / Web3Forms / your API and send
  to `connect@kanvtech.com` — see the marked `NOTE FOR DEVELOPER` block in `js/main.js`.
- **Social links**: footer icons point to `#` — replace with real profile URLs
  (search for `TODO` in `tools/generate.js`).
- **Imagery**: photos are hotlinked from Pexels (free licence). Replace with the client's
  own brand photography when available — all URLs live in the `IMG` map in `tools/generate.js`.
- **Trust logos**: Spine partner badge, certificates and client logos are placeholdered
  (`TODO` comments in the Certified & Trusted sections).
- **Stats**: only verifiable figures are shown (18+ years, 15+ solutions). Add real
  client/project counts in `tools/generate.js` once confirmed.
- **Testimonials & blog**: sections intentionally omitted until real content exists
  (see the HTML comment near the end of the home page body in the generator).
- Confirm business hours, phone/WhatsApp number and the form recipient email.
