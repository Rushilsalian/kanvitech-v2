/* ==========================================================================
   KANVTECH SOLUTIONS — static site generator
   Run:  node tools/generate.js
   Regenerates every .html page in the project root from the data below,
   so the nav, footer, meta tags and section templates stay consistent.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = {
  url: "https://www.kanvtech.com",
  name: "Kanvtech Solutions Private Limited",
  short: "Kanvtech Solutions",
  phone: "+91 70459 98877",
  phoneHref: "tel:+917045998877",
  email: "connect@kanvtech.com",
  wa: "https://wa.me/917045998877?text=Hello%20Kanvtech",
  address: "B-810, 8th Floor, Northern Supremus, Bharucha Road, Off S.V. Road, Dahisar (East), Mumbai - 400068",
  hours: "Monday – Saturday, 10:00 AM – 7:00 PM",
};

/* Verified premium imagery (Pexels — free to use, hotlink-safe CDN).
   Replace with the client's own brand photography when available. */
const IMG = {
  heroTeam:   "https://images.pexels.com/photos/7580644/pexels-photo-7580644.jpeg?auto=compress&cs=tinysrgb&w=1400",
  present:    "https://images.pexels.com/photos/7581110/pexels-photo-7581110.jpeg?auto=compress&cs=tinysrgb&w=1200",
  consult:    "https://images.pexels.com/photos/7580824/pexels-photo-7580824.jpeg?auto=compress&cs=tinysrgb&w=1200",
  businesswoman: "https://images.pexels.com/photos/7580635/pexels-photo-7580635.jpeg?auto=compress&cs=tinysrgb&w=1200",
  developer:  "https://images.pexels.com/photos/16323580/pexels-photo-16323580.jpeg?auto=compress&cs=tinysrgb&w=1200",
  team:       "https://images.pexels.com/photos/26834970/pexels-photo-26834970.jpeg?auto=compress&cs=tinysrgb&w=1200",
  training:   "https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg?auto=compress&cs=tinysrgb&w=1200",
  couch:      "https://images.pexels.com/photos/7580775/pexels-photo-7580775.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const ic = (name, cls) => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ""}></i>`;

/* ---------------------------------------------------------------------- */
/* Shared shell                                                            */
/* ---------------------------------------------------------------------- */

const NAV_GROUPS = [
  {
    label: "Software",
    icon: "package",
    items: [
      { slug: "spine-payroll", name: "Spine Payroll", pop: true },
      { slug: "spine-hr-suite", name: "Spine HR Suite", pop: true },
      { slug: "spine-asset", name: "Spine Asset" },
      { slug: "tally-prime", name: "Tally Prime" },
      { slug: "tally-prime-server", name: "Tally Prime Server" },
    ],
  },
  {
    label: "Services",
    icon: "wrench",
    items: [
      { slug: "tally-software-services", name: "Tally Software Services" },
      { slug: "tally-services", name: "Tally Services" },
      { slug: "tally-on-cloud", name: "Tally on Cloud" },
    ],
  },
  {
    label: "Solutions",
    icon: "layers",
    items: [
      { slug: "app-development", name: "App Development", pop: true },
      { slug: "customize-solutions", name: "Custom Software", pop: true },
      { slug: "cloud-server", name: "Cloud Server", pop: true },
      { slug: "tally-customization-solution", name: "Tally Customization" },
      { slug: "tally-add-on", name: "Tally Add-On (TDL)" },
    ],
  },
];

function head(o) {
  const canonical = `${SITE.url}/${o.slug === "index" ? "" : o.slug + ".html"}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${o.title}</title>
  <meta name="description" content="${o.desc}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0D1B2A">
  <link rel="icon" type="image/png" href="images/logo.png">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.short}">
  <meta property="og:title" content="${o.title}">
  <meta property="og:description" content="${o.desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE.url}/images/logo.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
${o.schema ? `  <script type="application/ld+json">${JSON.stringify(o.schema)}</script>\n` : ""}</head>
<body>

  <div class="loader" aria-hidden="true"><img src="images/logo.png" alt=""></div>

  <div class="bg-stage" aria-hidden="true">
    <div class="bg-grid"></div>
    <div class="blob blob-blue"></div>
    <div class="blob blob-cyan"></div>
    <div class="blob blob-deep"></div>
    <div class="beam"></div><div class="beam b2"></div><div class="beam b3"></div>
    <div class="bg-noise"></div>
  </div>
`;
}

function headerHtml() {
  const megaCols = NAV_GROUPS.map(
    (g) => `          <div class="mega-col">
            <h5>${g.label}</h5>
            ${g.items.map((it) => `<a href="${it.slug}.html">${it.name}${it.pop ? "<span>Popular</span>" : ""}</a>`).join("\n            ")}
          </div>`
  ).join("\n");

  const mobileCols = NAV_GROUPS.map(
    (g) => `      <h5>${g.label}</h5>
      <div class="mm-sub">
        ${g.items.map((it) => `<a href="${it.slug}.html">${it.name}</a>`).join("\n        ")}
      </div>`
  ).join("\n");

  return `
  <header class="nav">
    <div class="container nav-inner">
      <a class="nav-logo" href="index.html" aria-label="Kanvtech Solutions — Home">
        <img src="images/logo.png" alt="Kanvtech Solutions logo">
      </a>

      <nav aria-label="Primary">
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about-us.html">About Us</a></li>
          <li>
            <a href="solutions-and-services.html">Solutions &amp; Services ${ic("chevron-down")}</a>
            <div class="mega">
${megaCols}
            </div>
          </li>
          <li><a href="contact-us.html">Contact Us</a></li>
        </ul>
      </nav>

      <div class="nav-cta">
        <a href="contact-us.html#enquiry" class="btn btn-orange magnetic">Book a Free Demo</a>
      </div>

      <button class="nav-burger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="mobile-menu">
    <a href="index.html">Home</a>
    <a href="about-us.html">About Us</a>
    <a href="solutions-and-services.html">Solutions &amp; Services</a>
    <a href="contact-us.html">Contact Us</a>
${mobileCols}
    <a href="contact-us.html#enquiry" class="btn btn-orange">Book a Free Demo</a>
  </div>
`;
}

function footerHtml() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="images/logo.png" alt="Kanvtech Solutions logo">
          <p>Your one partner for Spine HR &amp; Payroll, Tally, cloud servers and custom software — set up and supported by a Mumbai team that stays with you.</p>
          <div class="footer-social">
            <!-- TODO: replace # with Kanvtech's real profile URLs -->
            <a href="#" aria-label="Facebook">${ic("facebook")}</a>
            <a href="#" aria-label="Twitter / X">${ic("twitter")}</a>
            <a href="#" aria-label="LinkedIn">${ic("linkedin")}</a>
            <a href="#" aria-label="Instagram">${ic("instagram")}</a>
          </div>
        </div>

        <div class="footer-col">
          <h5>Company</h5>
          <a href="index.html">Home</a>
          <a href="about-us.html">About Us</a>
          <a href="solutions-and-services.html">Solutions &amp; Services</a>
          <a href="contact-us.html">Contact Us</a>
        </div>

        <div class="footer-col">
          <h5>Core Solutions</h5>
          <a href="spine-payroll.html">Spine Payroll</a>
          <a href="spine-hr-suite.html">Spine HR Suite</a>
          <a href="app-development.html">App Development</a>
          <a href="customize-solutions.html">Custom Software</a>
          <a href="cloud-server.html">Cloud Server</a>
        </div>

        <div class="footer-col">
          <h5>Reach Us</h5>
          <ul class="footer-contact">
            <li>${ic("map-pin")}<span>${SITE.address}</span></li>
            <li>${ic("phone")}<a href="${SITE.phoneHref}">${SITE.phone}</a></li>
            <li>${ic("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li>${ic("clock")}<span>${SITE.hours}</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© <span data-year>2026</span> ${SITE.name}. All rights reserved.</p>
        <nav aria-label="Legal">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms-and-conditions.html">Terms &amp; Conditions</a>
          <a href="disclaimer.html">Disclaimer</a>
        </nav>
      </div>
    </div>
  </footer>

  <a class="wa-float" href="${SITE.wa}" target="_blank" rel="noopener" aria-label="Chat with Kanvtech on WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
  </a>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js" defer></script>
  <script src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js" defer></script>
  <script src="js/main.js" defer></script>
</body>
</html>
`;
}

function page(o, body) {
  return head(o) + headerHtml() + `\n  <main id="top">\n` + body + `\n  </main>\n` + footerHtml();
}

function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a> ${ic("chevron-right")}
        ${items
          .map((c, i) =>
            i === items.length - 1
              ? `<span>${c.name}</span>`
              : `<a href="${c.href}">${c.name}</a> ${ic("chevron-right")}`
          )
          .join("\n        ")}
      </nav>`;
}

function ctaBand(heading, text) {
  return `
    <!-- Final CTA -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="cta-band" data-reveal="scale">
          <h2 class="display-2">${heading}</h2>
          <p>${text}</p>
          <div class="hero-actions">
            <a href="contact-us.html#enquiry" class="btn btn-orange magnetic">Book a Free Demo ${ic("arrow-right")}</a>
            <a href="contact-us.html#enquiry" class="btn btn-glass magnetic">Send an Enquiry</a>
            <a href="${SITE.wa}" target="_blank" rel="noopener" class="btn btn-wa">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>`;
}

/* ---------------------------------------------------------------------- */
/* Solution page template + data                                           */
/* ---------------------------------------------------------------------- */

const SOLUTIONS = [
  /* ----------------------------- SPINE ------------------------------- */
  {
    slug: "spine-payroll",
    name: "Spine Payroll",
    cat: "Software",
    icon: "wallet",
    badge: "Authorised Spine Partner",
    pop: true,
    title: "Spine Payroll - Payroll Software in Mumbai | Kanvtech",
    desc: "Run accurate, on-time payroll with PF, ESIC, PT and TDS compliance built in. Automated salary, payslips, loans and reports. Set up by Kanvtech, authorised Spine partner.",
    h1: "Spine Payroll — Payroll Software in Mumbai",
    intro: "Run accurate, on-time payroll every month with statutory compliance built in — Spine Payroll, set up and supported by Kanvtech, an authorised Spine partner.",
    image: { src: IMG.businesswoman, alt: "Indian HR professional reviewing payroll reports with her team" },
    what: "Spine Payroll is payroll software that takes the month-end pressure off your HR team. It handles salary calculations, payslips, deductions and statutory compliance automatically, with all your employee and payroll data in one place. What used to take days of manual work and double-checking now runs accurately in a fraction of the time.",
    who: "For any business that runs a monthly payroll and wants it done right — from small teams to large companies across every industry. It's ideal if you're still calculating salaries on spreadsheets, struggling to keep up with PF, ESIC and tax rules, or simply want payroll that's quick, accurate and compliant without the stress.",
    features: [
      ["zap", "High-speed, automated salary computation and disbursement"],
      ["shield-check", "Statutory compliance built in — PF, ESIC, PT, TDS, Gratuity, Bonus and LWF"],
      ["receipt", "Customisable payslips with clear earnings and deductions"],
      ["hand-coins", "Loans and advances setup with repayment tracking"],
      ["history", "Backdated payments, arrears and adjustments handled smoothly"],
      ["database", "Complete employee data bank with up-to-date records"],
      ["gauge", "Custom report writer and dashboards for payroll insights"],
      ["lock", "Role-based access and a secure maker-checker workflow"],
      ["smartphone", "Mobile app (Android & iOS) for employees and admins"],
    ],
    benefits: [
      "No more month-end headaches — payroll runs accurately and on time",
      "Stay compliant automatically as PF, ESIC, PT and tax rules change",
      "Cut manual errors with automation and centralised data",
      "Disburse salaries and payslips quickly, every cycle",
      "Keep sensitive payroll data secure with encryption and access controls",
    ],
    faq: [
      ["What does Spine Payroll do?", "It automates your entire payroll — salary calculations, payslips, deductions and statutory compliance — so your monthly payroll runs accurately with minimal manual effort."],
      ["Does it handle PF, ESIC and tax compliance?", "Yes. Spine Payroll takes care of statutory compliance including PF, ESIC, PT, TDS, Gratuity, Bonus and LWF, with tax tables that stay up to date as rules change."],
      ["Can it manage employee loans and advances?", "Yes. You can set up loans and advances with automatic repayment tracking, so deductions are handled correctly each cycle."],
      ["Can it handle arrears and backdated payments?", "Yes. Spine Payroll processes arrears, adjustments and backdated payments smoothly, without delays or manual rework."],
      ["Is there a mobile app?", "Yes — employees and admins can access payroll and HR data through the Spine HR mobile app on Android and iOS."],
      ["How is this different from Spine HR Suite?", "Spine Payroll focuses on salary processing and compliance. Spine HR Suite is the full HRMS — recruitment, attendance, performance and more — with payroll as part of it. See our Spine HR Suite page."],
    ],
    cta: ["Make payroll the easiest part of your month.", "See Spine Payroll in action — book a free demo or send an enquiry, and Kanvtech will set it up for your business."],
    related: ["spine-hr-suite", "spine-asset", "tally-prime"],
  },
  {
    slug: "spine-hr-suite",
    name: "Spine HR Suite",
    cat: "Software",
    icon: "users",
    badge: "Authorised Spine Partner",
    pop: true,
    title: "Spine HR Suite - HR & Payroll Software (HRMS) in Mumbai | Kanvtech",
    desc: "Manage hire-to-retire HR and payroll on one platform - recruitment, attendance, payroll, PF/ESIC/PT/TDS compliance and a mobile app. Set up by Kanvtech, authorised Spine partner.",
    h1: "Spine HR Suite — HR & Payroll Software (HRMS) in Mumbai",
    intro: "One platform to manage your people from hire to retire — recruitment, attendance, payroll and compliance — set up by Kanvtech, an authorised Spine partner.",
    image: { src: IMG.team, alt: "Indian corporate team collaborating around a laptop in a modern office" },
    what: "Spine HR Suite is a complete HRMS that brings your entire HR and payroll work into one place. From hiring someone to managing their attendance, salary, leaves and performance, right through to their exit, it handles the full employee journey. It replaces scattered spreadsheets and manual paperwork with one connected system your HR team and employees can both use.",
    who: "Built to scale with you — whether you're a small startup or a large enterprise, across industries like manufacturing, IT, healthcare, retail, banking, education and more. It's for any business that's growing its team and finding HR harder to manage by hand: processing payroll, tracking attendance, handling leaves and expenses, running appraisals, and staying compliant.",
    featHeading: "Key modules — pick what you need, add more as you grow",
    features: [
      ["user-plus", "Recruitment with interview and hiring automation, plus digital onboarding for a smooth first-day experience"],
      ["landmark", "Centralised HRIS and payroll with accurate, on-time processing"],
      ["shield-check", "Statutory compliance handled — PF, ESIC, PT and TDS — with Form 16 and auto-updating tax tables"],
      ["calendar-days", "Leave management with a clear team leave planner"],
      ["fingerprint", "Time & attendance, integrated with payroll via biometric or web login"],
      ["layout-dashboard", "Employee Self-Service (ESS) with personalised dashboards"],
      ["receipt", "Expenses and reimbursements, applied from anywhere"],
      ["clipboard-list", "Timesheets, project tracking and data-driven Performance Management (PMS)"],
      ["smartphone", "HR Help Desk, Visitor Management and a mobile HR app for Android and iOS"],
    ],
    benefits: [
      "Manage the whole employee lifecycle on one platform — hire to retire",
      "Run payroll accurately and stay compliant without the manual guesswork",
      "Free your HR team from paperwork and repetitive tasks",
      "Empower employees with self-service and a mobile app",
      "Scale easily — add modules, teams and locations as you grow",
    ],
    faq: [
      ["What is Spine HR Suite?", "It's an all-in-one HRMS and payroll software that manages your complete HR process — recruitment, onboarding, attendance, payroll, leaves, performance and exit — on a single platform."],
      ["Does it handle payroll and statutory compliance?", "Yes. It processes payroll accurately and takes care of statutory compliance like PF, ESIC, PT and TDS, including Form 16, with tax tables that update automatically."],
      ["Can it connect with biometric attendance?", "Yes. Time & attendance integrates with biometric or web login and feeds directly into payroll, so attendance and salary stay in sync."],
      ["Is there a mobile app?", "Yes — the Spine HR app works on Android and iOS, letting employees manage attendance, leaves and other HR tasks from their phone."],
      ["Can we start with a few modules and add more later?", "Absolutely. The suite is modular, so you can begin with what you need and expand as your business grows."],
      ["Will it suit our industry?", "Spine HR Suite is used across many industries and is highly configurable, so it adapts to how your business works."],
    ],
    cta: ["Ready to simplify your HR and payroll?", "See Spine HR Suite in action. Book a free demo or send an enquiry, and Kanvtech will set it up around your needs."],
    related: ["spine-payroll", "spine-asset", "tally-on-cloud"],
  },
  {
    slug: "spine-asset",
    name: "Spine Asset",
    cat: "Software",
    icon: "box",
    badge: "Authorised Spine Partner",
    title: "Spine Asset - Fixed Asset Management Software in Mumbai | Kanvtech",
    desc: "Track assets, automate depreciation and stay audit-ready with Spine Asset. Barcode tracking, AMC reminders, audit trail. Set up by Kanvtech, authorised Spine partner.",
    h1: "Spine Asset — Fixed Asset Management Software in Mumbai",
    intro: "Track every asset, automate depreciation and stay audit-ready — Spine Asset, implemented and supported by Kanvtech, an authorised Spine partner.",
    what: "Spine Asset is fixed asset management software that brings order to how your business tracks and maintains its assets. Instead of scattered spreadsheets and missed renewals, you get one place to record every asset, calculate depreciation automatically, and know exactly what you own, where it is, and what condition it's in. It takes asset management from chaos to clarity.",
    who: "For any business with assets worth tracking — used across industries like manufacturing, infrastructure, textiles, healthcare, automobile and agriculture. It suits companies managing equipment across multiple locations or branches, those needing clean records at audit time, and teams that keep losing track of warranties, AMCs and maintenance schedules.",
    features: [
      ["map-pin", "Asset tracking across locations, with status, location and assignment"],
      ["trending-down", "Automated depreciation calculation and scheduling"],
      ["book-open", "Fixed asset register and schedule with full purchase and status history"],
      ["scan-barcode", "Barcode integration for quick, error-free asset tracking"],
      ["search-check", "Physical verification to match real assets against records"],
      ["bell-ring", "Warranty, AMC and insurance tracking with timely email and dashboard reminders"],
      ["lock", "Access levels and audit trail (maker-checker) for control and accountability"],
      ["file-cog", "Custom reports (DIY report writer) and accounting software integration"],
    ],
    benefits: [
      "Always know what you own, where it is, and its current value",
      "Save time and cut errors with automation and barcode scanning",
      "Never miss a renewal, AMC or maintenance date again",
      "Walk into audits with accurate, ready records across all branches",
      "Keep control with clear approvals and a full audit trail",
    ],
    faq: [
      ["What does Spine Asset actually do?", "It helps you track all your company's fixed assets, automate depreciation, manage maintenance and warranties, and keep audit-ready records — all in one place."],
      ["Can it handle assets across multiple branches or locations?", "Yes. You can track and manage assets across multiple companies, locations and branches, with workflows and approvals built in."],
      ["Does it calculate depreciation automatically?", "Yes. Spine Asset automatically calculates and schedules depreciation, so your asset values stay accurate without manual work."],
      ["Can it connect with our accounting software?", "Yes. Asset data can sync with your accounting software for smooth financial management and reporting."],
      ["How does it help at audit time?", "With a complete asset register, audit trail and exportable records, you have accurate, organised data ready whenever an audit comes up."],
    ],
    cta: ["Tired of chasing asset records and renewal dates?", "Let Spine Asset handle it. Book a free demo or send an enquiry, and Kanvtech will set you up."],
    related: ["spine-payroll", "spine-hr-suite", "customize-solutions"],
  },

  /* ----------------------------- TALLY ------------------------------- */
  {
    slug: "tally-prime",
    name: "Tally Prime",
    cat: "Software",
    icon: "calculator",
    title: "TallyPrime in Mumbai - Complete Business Management Software | Kanvtech",
    desc: "TallyPrime handles accounting, invoicing, inventory, GST and banking in one simple platform. Licence, setup and support by Kanvtech in Mumbai. Book a free demo.",
    h1: "TallyPrime in Mumbai — Complete Business Management Software",
    intro: "One software to run your accounts, invoicing, inventory, GST and more — TallyPrime, supplied and set up by Kanvtech.",
    image: { src: IMG.training, alt: "Indian professionals working together on business software" },
    what: "TallyPrime is an all-in-one business management software that handles the everyday running of your business in one place. From accounting and invoicing to inventory, GST, banking and reports, it brings everything together so you spend less time juggling tools and more time growing. It's known for being genuinely simple to use, with consistent navigation that your team picks up quickly.",
    who: "For businesses of every stage — startups finding their feet, small and medium businesses managing daily accounts, and growing companies that need more power. Use it for invoicing, accounting, inventory, GST and compliance, banking, payroll and clear business reports. It runs on a single PC (Silver), across a network (Gold), or on the cloud.",
    features: [
      ["book-open", "Accounting, invoicing and receivables/payables in one place"],
      ["warehouse", "Inventory management with multiple godowns and real-time stock view"],
      ["shield-check", "GST made easy — direct GSTR-1 / GSTR-3B filing, auto-reconciliation, e-invoice & e-way bill"],
      ["landmark", "Connected banking & payments with live balances and auto-reconciliation"],
      ["gauge", "Smart reports — dashboards, personalised views and SmartFind to locate any entry"],
      ["network", "Multi-user on a network (Gold) or single user (Silver), with cloud access option"],
    ],
    benefits: [
      "Run your whole business from one simple, reliable platform",
      "Stay compliant with built-in GST checks that catch errors before filing",
      "Cut hours of manual work — many tasks that took half a day now take minutes",
      "Keep your data safe even through power cuts or network drops",
      "Access your reports and stay in control from anywhere",
    ],
    faq: [
      ["What's the difference between TallyPrime Silver and Gold?", "Silver is a single-user licence for one PC. Gold is a multi-user licence that lets your whole team work on the same data across a network."],
      ["Can TallyPrime handle GST and e-invoicing?", "Yes. You can file GSTR-1 and GSTR-3B directly, auto-reconcile returns, and generate e-invoices and e-way bills from inside Tally."],
      ["Is TallyPrime hard to learn?", "Not at all. It's built to be simple, with consistent navigation, so your team gets comfortable with it quickly. We also provide training if needed."],
      ["Can I use TallyPrime from outside the office?", "Yes — through TallyPrime Cloud Access, you can use it remotely from any device. See our Tally on Cloud page."],
      ["Do you help with installation and setup?", "Absolutely. Kanvtech supplies the licence and sets TallyPrime up for your business, with support and training available afterwards."],
    ],
    cta: ["Ready to get started with TallyPrime?", "Whether you're new to Tally or upgrading from an older version, Kanvtech will guide you to the right licence and set it up."],
    related: ["tally-prime-server", "tally-software-services", "tally-on-cloud"],
  },
  {
    slug: "tally-prime-server",
    name: "Tally Prime Server",
    cat: "Software",
    icon: "server",
    title: "TallyPrime Server in Mumbai - Power for Multi-User Businesses | Kanvtech",
    desc: "TallyPrime Server gives fast, secure, multi-user access for growing businesses. High concurrency, central control, zero downtime. Set up by Kanvtech. Enquire now.",
    h1: "TallyPrime Server in Mumbai — Power for Multi-User Businesses",
    intro: "When many people work in Tally at once, TallyPrime Server keeps it fast, secure and reliable — set up and supported by Kanvtech.",
    what: "TallyPrime Server is a powerful upgrade for businesses where lots of users work on the same Tally data at the same time. It moves your data onto a proper server with client-server architecture, going beyond what the standard Gold licence offers. The result is more users working together without slowdowns, tighter security, and far better control over who accesses what. It works alongside your TallyPrime Gold licence.",
    who: "Built for medium and large businesses — and fast-growing ones with 10 or more people working in Tally together. It's ideal if your team constantly hits slowdowns during busy periods, if you consolidate data from multiple branches to a head office, or if an administrator needs to manage data access and monitor user activity centrally.",
    features: [
      ["zap", "High concurrency — many users load companies, save entries, print and back up at once without downtime"],
      ["eye-off", "Secured by design — data location stays hidden; access controlled at the server level"],
      ["key-round", "Server-level permissions for backup, restore and data operations"],
      ["monitor-check", "User session monitoring — track activity and disconnect users when needed"],
      ["shield-check", "High reliability — issues on one client don't affect the server or other users"],
      ["puzzle", "Works together with your existing TallyPrime Gold licence"],
    ],
    benefits: [
      "Your team works without interruptions, even at peak load",
      "Data stays real-time, consistent and accurate across users",
      "Tighter control and security over your business data",
      "Smarter monitoring helps you optimise how Tally is used",
      "Less downtime means more productive working hours",
    ],
    faq: [
      ["Who actually needs TallyPrime Server?", "Businesses with many users working in Tally at the same time — typically 10 or more — or those consolidating data across branches. If you're facing slowdowns with multiple users, this solves it."],
      ["Does it replace my TallyPrime licence?", "No. TallyPrime Server works alongside your TallyPrime Gold (multi-user) licence — it adds the server power on top."],
      ["How is it better than just running Gold on a network?", "It uses a proper client-server setup, so many users can work at once without speed drops or downtime, with stronger security and central control."],
      ["Can an admin control user access and activity?", "Yes. Administrators get server-level permissions, can monitor user sessions, and can disconnect users when needed."],
      ["Can we try it before buying?", "A trial is available so you can see the difference in your own setup. We'll help you arrange and evaluate it."],
    ],
    cta: ["Outgrowing your current Tally setup?", "Let's get you on TallyPrime Server. Book a free demo or send an enquiry, and Kanvtech will handle the setup."],
    related: ["tally-prime", "tally-on-cloud", "tally-services"],
  },
  {
    slug: "tally-software-services",
    name: "Tally Software Services (TSS)",
    cat: "Services",
    icon: "refresh-cw",
    title: "Tally Software Services (TSS) in Mumbai | Kanvtech",
    desc: "Activate or renew TSS to unlock connected GST, banking, cloud backup and remote access in TallyPrime. Plans and renewals handled by Kanvtech. Enquire now.",
    h1: "Tally Software Services (TSS) in Mumbai",
    intro: "Unlock the connected side of TallyPrime — GST, banking, backups and remote access — with a TSS subscription from Kanvtech.",
    what: "Tally Software Services, or TSS, is a subscription that adds a layer of connected services on top of your TallyPrime. It's what keeps your software current with the latest features and statutory changes, and unlocks online abilities like GST filing, connected banking, cloud backup and remote access to your reports. In short, it turns Tally from a standalone tool into a connected one.",
    who: "For any business on TallyPrime that wants more than offline accounting — handling GST and e-invoicing inside Tally, making and reconciling payments through connected banking, backing up to the cloud, syncing data across branches, or checking reports from a phone. Every new TallyPrime licence comes with TSS for the first year; after that, it needs renewal to keep these services running.",
    featHeading: "What TSS gives you",
    features: [
      ["shield-check", "Connected GST — download, reconcile and act on invoices, file GSTR-1 and GSTR-3B, and generate e-invoices & e-way bills inside Tally"],
      ["landmark", "Connected banking & payments — make and reconcile payments, track transactions, and send UPI/QR payment links"],
      ["cloud-upload", "TallyDrive — automatic, secure cloud backup with easy recovery"],
      ["sparkles", "Free product upgrades and major releases"],
      ["monitor-smartphone", "Online access to your business reports from any device"],
      ["git-merge", "Online data sync and consolidation across branches and locations, plus WhatsApp for Business integration"],
    ],
    benefits: [
      "Stay compliant with the latest GST and statutory updates, automatically",
      "Handle GST and banking without leaving Tally or visiting the portal",
      "Keep your data safe with automatic cloud backups",
      "Check your numbers and make decisions from anywhere",
      "Get a clear, consolidated view across all your locations",
    ],
    faq: [
      ["What exactly does a TSS subscription do?", "It keeps your TallyPrime updated and unlocks connected features — GST filing, banking, cloud backup, remote report access and data sync across locations."],
      ["Do I get TSS when I buy TallyPrime?", "Yes. Every new TallyPrime licence includes TSS validity for the first 12 months. After that, you renew it to keep the connected services active."],
      ["What happens if my TSS expires?", "Your Tally keeps working, but you lose access to updates and connected services like GST filing, banking and online reports until you renew."],
      ["What plans are available?", "TSS comes in Silver (single user), Gold (multi-user) and Auditor editions, with 1-year and 2-year options. We'll recommend the right one and share current pricing on enquiry."],
      ["How is TSS different from Tally Services?", "TSS is Tally's official subscription product. Tally Services is our hands-on support — setup, troubleshooting, AMC and training. See our Tally Services page."],
    ],
    cta: ["Need to activate or renew your TSS?", "Kanvtech makes it quick and easy. Book a free demo or send an enquiry to get started."],
    related: ["tally-services", "tally-prime", "tally-on-cloud"],
  },
  {
    slug: "tally-services",
    name: "Tally Services",
    cat: "Services",
    icon: "wrench",
    title: "Tally Services in Mumbai - Setup, Support & AMC | Kanvtech",
    desc: "Tally implementation, onsite & remote support, AMC, training and multi-branch setup - handled by Kanvtech's Tally experts in Mumbai. Enquire now.",
    h1: "Tally Services in Mumbai — Setup, Support & AMC",
    intro: "Everything you need to keep Tally running smoothly — from installation to ongoing support — handled by Kanvtech's Tally experts.",
    image: { src: IMG.training, alt: "Kanvtech consultants guiding a client through Tally on a laptop" },
    what: "Tally is the accounting backbone for lakhs of businesses, but getting it set up right and keeping it that way takes know-how. Our Tally Services cover the whole journey — installing and configuring it for your business, fixing issues when they come up, training your team, and supporting you long after go-live. Whether you need a one-time setup or a year-round support plan, we've got it covered.",
    who: "For any business using Tally — whether you're installing it for the first time, struggling with a recurring problem, running it across multiple branches, or just want a reliable team on call when something breaks. From a single-user setup to a multi-branch operation, we tailor the support to your size and needs. Support plans include the Basic Plan for single-user setups, an Overtime Policy for multi-user environments, and an Exclusive Plan with email, phone and on-site support plus unlimited access to the Tally Support Centre.",
    featHeading: "Tally services we provide",
    features: [
      ["settings", "Tally Implementation — set up and configured around your business requirements"],
      ["headset", "Tally Support (Onsite & Remote) — installation, data migration and quick problem-solving"],
      ["calendar-check", "Tally AMC — round-the-clock annual support for businesses of any size"],
      ["git-merge", "Tally Data Synchronization — keep data in sync across multiple branches or locations"],
      ["building-2", "Multi-Branch Management — real-time access and control across office locations"],
      ["graduation-cap", "TallyPrime Training — corporate training to get your team confident and productive"],
    ],
    benefits: [
      "Get Tally set up correctly the first time, with no guesswork",
      "A team on call when something goes wrong — onsite or remote",
      "Keep multi-branch data accurate and connected",
      "Train your staff so they use Tally to its full potential",
    ],
    faq: [
      ["What does Tally implementation include?", "We install and configure Tally to match how your business works — setting it up correctly so you're ready to use it from day one."],
      ["Do you offer onsite support, or only remote?", "Both. Depending on your plan and the issue, we help remotely for quick fixes and visit onsite when needed."],
      ["What is a Tally AMC?", "An Annual Maintenance Contract gives you ongoing Tally support for the year — covering troubleshooting, assistance and upkeep so you're never stuck."],
      ["Can you help run Tally across multiple branches?", "Yes. We set up data synchronization and multi-branch management so your locations stay connected with real-time access."],
      ["Do you train our team on Tally?", "Yes. We provide TallyPrime training so your staff can work confidently and make the most of the software."],
      ["How is this different from Tally Software Services (TSS)?", "TSS is Tally's own subscription that keeps your licence updated. Tally Services is our hands-on support — setup, troubleshooting, AMC and training. See our Tally Software Services page."],
    ],
    cta: ["Need help getting Tally set up or kept running?", "Talk to our team. Book a free demo or send an enquiry, and Kanvtech will sort it out."],
    related: ["tally-software-services", "tally-prime", "tally-customization-solution"],
  },
  {
    slug: "tally-on-cloud",
    name: "Tally on Cloud",
    cat: "Services",
    icon: "cloud",
    title: "Tally on Cloud - Access Your Tally Anytime, Anywhere | Kanvtech",
    desc: "Run TallyPrime securely from any device, any location, 24x7. Multi-user, auto-backups, flexible plans. Tally on Cloud set up and managed by Kanvtech. Enquire now.",
    h1: "Tally on Cloud — Access Your Tally Anytime, Anywhere",
    intro: "Run your TallyPrime from any device, any location, with secure 24x7 cloud access — set up and managed by Kanvtech.",
    what: "Tally on Cloud lets you use your existing TallyPrime from anywhere instead of being tied to one office computer. Your Tally runs on a secure cloud server, and you log in to it from your laptop, home system or browser whenever you need. Your team can work on the same data together, in real time, without anyone being in the same room.",
    who: "For businesses that want their accounts accessible beyond the office — owners who travel, teams spread across locations or warehouses, accountants who work remotely, or growing companies adding more users and channels. If you've ever needed your Tally data while away from your desk, this solves it. (You'll need an existing TallyPrime licence, which we can help arrange.)",
    features: [
      ["globe", "Secure 24x7 access to your Tally from any location or device"],
      ["users", "Multiple users working on the same data in real time"],
      ["key-round", "Dual-factor authentication and secure PIN login for protection"],
      ["cloud-upload", "Automatic, encrypted cloud backups with easy data recovery"],
      ["layout-dashboard", "Self-service portal to manage users, systems and backups"],
      ["monitor-smartphone", "Works across Windows, Linux and macOS (via browser), with flexible per-user plans and no data limits"],
    ],
    benefits: [
      "Stay in control of your accounts wherever you are",
      "Let your whole team collaborate without sharing one machine",
      "Keep your data safe with strong security and automatic backups",
      "Skip the cost and hassle of maintaining your own Tally server",
      "Scale up users and resources as your business grows",
    ],
    faq: [
      ["Do I need to buy Tally again to use it on the cloud?", "No. Tally on Cloud uses your existing TallyPrime licence — we host it on the cloud so you can access it remotely. If you don't have a licence yet, we can help you get one."],
      ["Is my data safe on the cloud?", "Yes. Access is protected with dual-factor authentication and a secure PIN, and your data is backed up automatically with encryption, so recovery is simple if ever needed."],
      ["Can more than one person use it at the same time?", "Yes. Multiple users can work on the same Tally data together in real time, based on your plan."],
      ["What devices can I access it from?", "You can use it on Windows, Linux and macOS — through a virtual client or directly via a web browser."],
      ["How are the plans priced?", "Plans are flexible, charged per user with monthly and longer subscription options. We'll suggest the right plan for your team size and share the pricing on enquiry."],
    ],
    cta: ["Want your Tally available wherever you are?", "Book a free demo or send an enquiry, and Kanvtech will set up the right cloud plan for your team."],
    related: ["cloud-server", "tally-prime", "tally-services"],
  },
  {
    slug: "tally-customization-solution",
    name: "Tally Customization",
    cat: "Solutions",
    icon: "sliders-horizontal",
    title: "Tally Customization Services in Mumbai | Kanvtech",
    desc: "Tailor Tally to your business - custom reports, CRM integration and extra fields, without touching the core. Set up and supported by Kanvtech in Mumbai. Enquire now.",
    h1: "Tally Customization Services in Mumbai",
    intro: "Make Tally work the way your business does — custom reports, integrations and tailored fields, set up by Kanvtech.",
    what: "Tally is powerful out of the box, but every business runs a little differently. Tally customization is about shaping it to fit yours — changing how information is captured, displayed and reported, and connecting it with the other tools you use. The best part is that this happens without touching Tally's core, so you keep everything stable while getting exactly what you need.",
    who: "For any business already on Tally that finds the standard setup doesn't cover everything. Typical needs we handle: customised reports the default version doesn't offer, integrating Tally with your CRM or other software, and capturing additional information in your Tally masters or vouchers. If you're exporting data and reworking it elsewhere, customization usually removes that step.",
    features: [
      ["file-cog", "Custom reports built around the numbers and formats you actually use"],
      ["list-plus", "Extra fields in masters and vouchers to capture the details you need"],
      ["plug", "Integration between Tally and your CRM, software or digital tools"],
      ["git-merge", "A unified flow of data across finance and operations"],
      ["cloud", "Works whether your Tally is on-site or on the cloud"],
      ["shield-check", "Customization done without disturbing Tally's core functionality"],
    ],
    benefits: [
      "Tally fits your process instead of you adjusting to Tally",
      "Stop reworking data outside the software — get it right inside Tally",
      "Keep your setup stable while adding the features you need",
      "One connected system, less double-entry and fewer errors",
    ],
    faq: [
      ["What can actually be customized in Tally?", "Quite a lot — custom reports, extra fields in masters and vouchers, the way data is displayed, and connections to other software. We tailor it to your specific need."],
      ["Will customization affect my existing Tally data or stability?", "No. Customization works around Tally's core, so your existing data and day-to-day working stay intact."],
      ["Can Tally be connected with our CRM or other software?", "Yes. We can integrate Tally with your CRM and other tools so data flows between them instead of being entered twice."],
      ["How is this different from a Tally add-on?", "Add-ons are ready-made modules for common needs. Customization is broader — it's shaping and integrating Tally specifically around your business. We do both. See our Tally Add-On page."],
      ["Do you support the customization after it's done?", "Yes. We set it up on your system and support you afterwards, so you're never left stuck."],
    ],
    cta: ["Tell us what Tally isn't doing for you right now.", "We'll tailor it. Book a free demo or send an enquiry — Kanvtech will handle the rest."],
    related: ["tally-add-on", "tally-services", "tally-on-cloud"],
  },
  {
    slug: "tally-add-on",
    name: "Tally Add-On (TDL)",
    cat: "Solutions",
    icon: "puzzle",
    title: "Tally Add-Ons & TDL Customization in Mumbai | Kanvtech",
    desc: "Add extra features to your Tally with custom TDL add-ons - security, automation, invoicing, GST and more. Built, installed and supported by Kanvtech. Enquire now.",
    h1: "Tally Add-Ons & TDL Customization in Mumbai",
    intro: "Extend your Tally with extra features it doesn't offer out of the box — built and installed by Kanvtech to match how your business actually works.",
    what: "A Tally Add-On is a small module that plugs into your existing Tally and adds a feature you need but don't get in the standard setup. These are built using TDL (Tally Definition Language), so they sit neatly inside Tally without disturbing your data or your daily routine. If there's something repetitive you're doing by hand, or a control or report Tally doesn't give you, an add-on usually solves it.",
    who: "For any business already using Tally that finds itself working around the software's limits — manually checking entries, copying data into emails, struggling with approvals, or wishing a report looked different. Instead of changing the way your team works, we adjust Tally to fit it.",
    featHeading: "Key add-ons we provide — and if it isn't listed, we build it",
    features: [
      ["shield-check", "Security & Control — Voucher Authorization, Ledger-Level Security, Overdue & Credit Days Restriction, Negative Stock Control, Statutory Field Block, Alteration History"],
      ["message-circle", "Tally to WhatsApp — send invoices and messages without a WhatsApp API"],
      ["mail", "Automation & Communication — invoice email on save, bulk outstanding & ledger emails, Auto Backup Module, Task Manager"],
      ["receipt", "Invoicing & Data — Picture in Invoice, Standard Narrations, Terms & Conditions on documents, Address Labels, Group Discount, Last Purchase Rate view"],
      ["landmark", "Specialised Modules — Multi-State GST Solution, Customs House Agents (CHA) Module"],
      ["layout-dashboard", "Document Management System and Dashboard Module"],
    ],
    benefits: [
      "Get the exact features you need without switching away from Tally",
      "Cut out repetitive manual work and reduce data-entry mistakes",
      "Add tighter control over approvals, security and outstanding payments",
      "Keep everything inside your existing Tally — no new system to learn",
    ],
    faq: [
      ["What is a Tally add-on?", "It's an extra module that adds a specific feature to your existing Tally — like extra security, automation or a custom report — without changing your core software."],
      ["What is TDL?", "TDL stands for Tally Definition Language. It's the language used to build and customise features inside Tally, which is how add-ons are created."],
      ["Will an add-on affect my existing Tally data?", "No. Add-ons work on top of your current Tally and don't alter your existing data or company records."],
      ["Can you build a custom add-on for a need that's not listed?", "Yes. If you tell us the problem you're facing, we can develop an add-on tailored to your requirement."],
      ["Do you install and support the add-on too?", "Yes. We handle the setup on your system and support you after, so you're not left figuring it out alone."],
    ],
    cta: ["Tell us what you wish Tally could do.", "Chances are we can build it. Book a free demo or send an enquiry, and Kanvtech will take it from there."],
    related: ["tally-customization-solution", "tally-services", "tally-prime"],
  },

  /* --------------------------- KANVTECH OWN --------------------------- */
  {
    slug: "app-development",
    name: "App Development",
    cat: "Solutions",
    icon: "code",
    pop: true,
    title: "App & Web Development Company in Mumbai | Kanvtech",
    desc: "Websites, web apps and mobile apps built end to end - e-commerce, portals, dashboards and more. Designed, developed and supported by Kanvtech in Mumbai.",
    h1: "App & Web Development Company in Mumbai",
    intro: "From a clean business website to a full web or mobile app — Kanvtech designs, builds and maintains it end to end.",
    image: { src: IMG.developer, alt: "Indian software developer writing code on a dual-monitor workstation" },
    what: "App development is about building the websites and applications your business runs on — anything from a simple informational site to an online store, a customer portal, or a custom app your team and clients use every day. We handle the whole thing: how it looks, how it works behind the scenes, and keeping it running smoothly after launch.",
    who: "Whether you're a startup that needs a solid first website, an SME setting up e-commerce or a client portal, or a larger company that needs a custom web or mobile application, we build for your stage. Common projects include online stores, company websites, self-service portals, business dashboards, and SaaS products.",
    features: [
      ["monitor-smartphone", "Responsive UI/UX design that works across mobile, tablet and desktop"],
      ["code", "Frontend and backend development built on modern, reliable frameworks"],
      ["database", "Secure database design and management"],
      ["plug", "Integration with payment gateways, SMS/email, CRMs and analytics"],
      ["lock", "Security built in — SSL, encryption and data protection"],
      ["rocket", "Deployment on cloud hosting, plus post-launch support and updates"],
    ],
    benefits: [
      "Reach customers around the clock and grow your market presence",
      "Automate sign-ups, orders, enquiries and everyday workflows",
      "Build credibility with a professional, polished presence",
      "Start small and scale — add features and handle more traffic as you grow",
    ],
    faq: [
      ["What's the difference between a website and a web application?", "A website mainly shows information. A web application is interactive — it lets users log in, store data, and do things like online checkout or account management."],
      ["Will my site or app work on mobile?", "Yes. We build everything responsive by default, so it adapts cleanly to phones, tablets and desktops."],
      ["Do you build mobile apps too?", "Yes — alongside websites and web apps, we develop mobile applications depending on what your project needs."],
      ["Who owns the code once it's built?", "You do. The source code, design and rights are yours once the project is complete and final payment is cleared."],
      ["How long does a project take?", "A standard website is usually a few weeks; a custom web or mobile application takes longer. We give you a clear timeline once we know the scope."],
      ["What happens after the site goes live?", "We offer ongoing maintenance — bug fixes, security updates, backups and performance checks — so it keeps running well."],
    ],
    cta: ["Got an idea for a website or app?", "Tell us what you have in mind. Book a free demo or send an enquiry, and Kanvtech will help you build it."],
    related: ["customize-solutions", "cloud-server", "tally-customization-solution"],
  },
  {
    slug: "customize-solutions",
    name: "Custom Software Solutions",
    cat: "Solutions",
    icon: "settings-2",
    pop: true,
    title: "Custom Software Solutions in Mumbai | Kanvtech",
    desc: "Custom business software built around your exact process - ERP, CRM, automation and integrations. Designed, built and supported by Kanvtech in Mumbai. Enquire now.",
    h1: "Custom Software Solutions in Mumbai",
    intro: "Software built around the way your business already runs — not the other way around. Kanvtech designs and develops solutions made for your exact process.",
    image: { src: IMG.couch, alt: "Kanvtech consultant walking a client through a custom software proposal" },
    what: "Customize Solutions means software made specifically for your business instead of a ready-made product you have to adjust to. When off-the-shelf tools don't quite fit — too many features you don't use, or missing the one thing you actually need — we build a solution that matches your workflow. It slots into how your team already works and handles the tasks that are unique to you.",
    who: "For businesses that have outgrown standard software, or whose process is too specific for a packaged product to handle. Common examples include custom ERP and CRM systems, inventory and warehouse management, automated billing and invoicing, workflow automation, and connecting tools that don't normally talk to each other. If your team is stuck doing manual work because no single software covers it, this is where we come in.",
    features: [
      ["pencil-ruler", "Software designed from scratch around your processes and data"],
      ["plug", "Integration with your existing tools, databases and accounting systems"],
      ["users", "Role-based access so the right people see the right things"],
      ["gauge", "Custom reports and dashboards that show the numbers you care about"],
      ["monitor-smartphone", "Built to work across web, desktop and mobile"],
      ["braces", "Custom APIs to connect with third-party software when needed"],
    ],
    benefits: [
      "A precise fit — no manual workarounds, no paying for features you'll never use",
      "Grows with your business without piling on per-user licence fees",
      "You own the software, so you're not locked to anyone for changes later",
      "Cuts the recurring licence costs that come with packaged enterprise tools",
    ],
    faq: [
      ["How is custom software different from ready-made software?", "Ready-made software is built for the general public with fixed features. Custom software is built for your business alone, around your exact process — so it fits without compromise."],
      ["Will it work with the systems we already use?", "Yes. We can connect new software to your existing tools, databases, accounting systems or ERP through direct integration or custom APIs."],
      ["Who owns the software once it's built?", "You do. Once the project is complete and final payment is cleared, the source code and rights are yours."],
      ["How long does a custom project take?", "It depends on the size and complexity, but most projects run over a few months from planning to launch. We give you a clear timeline once we understand your requirement."],
      ["What about support after it goes live?", "We handle ongoing maintenance — bug fixes, security updates, new features and monitoring — through a support arrangement that suits you."],
      ["What will it cost?", "Cost depends entirely on what you need. Once we understand the scope, we share a clear written quotation — no guesswork."],
    ],
    cta: ["Have a process that no software seems to handle?", "Let's talk it through. Book a free demo or send an enquiry, and Kanvtech will map out a solution that fits."],
    related: ["app-development", "tally-customization-solution", "cloud-server"],
  },
  {
    slug: "cloud-server",
    name: "Cloud Server",
    cat: "Solutions",
    icon: "server-cog",
    pop: true,
    title: "Cloud Server Hosting for Business in Mumbai | Kanvtech",
    desc: "Secure, scalable, fully managed cloud servers for your websites, apps and business data. Set up and supported by Kanvtech in Mumbai. Book a free demo.",
    h1: "Cloud Server Hosting for Business in Mumbai",
    intro: "Fast, secure and always-on cloud servers for your websites, applications and business data — set up and managed by Kanvtech.",
    what: "A cloud server hosts your websites, business applications and databases across a network of connected virtual servers instead of one physical machine. If one server in the network goes down, another picks up instantly — so your business keeps running. You also get the freedom to add or reduce resources whenever you need, without buying or maintaining your own hardware.",
    who: "Whether you're a small business that wants reliable hosting without the cost of in-house servers, or a growing company running accounting software, ERP, CRM or a high-traffic website, a cloud server fits. It's a strong choice for hosting business websites, running software like Tally on Cloud, setting up secure data backups, and giving your team access to company tools from anywhere.",
    features: [
      ["cpu", "Virtual private servers with dedicated CPU, RAM and SSD storage"],
      ["scaling", "Scale resources up or down on demand — no downtime, no rebuild"],
      ["shield-check", "Built-in security: firewalls, DDoS protection and SSL"],
      ["cloud-upload", "Automatic daily or weekly backups of your server data"],
      ["copy", "High availability with server mirroring to avoid downtime"],
      ["settings", "Fully managed setup, updates, patching and monitoring by our team"],
    ],
    benefits: [
      "Stay online — if one server fails, your data moves to another automatically",
      "Pay only for what you use, turning heavy hardware costs into a predictable monthly spend",
      "Handle traffic spikes (like seasonal sales) by scaling instantly, then scaling back",
      "Give your team secure access to business tools and data from any location",
    ],
    faq: [
      ["What's the difference between normal web hosting and cloud hosting?", "Regular hosting runs your site on one physical server. Cloud hosting spreads it across several connected servers, so you get better uptime, speed and flexibility."],
      ["What does \"managed\" cloud hosting mean?", "It means we handle the technical side for you — server setup, security updates, backups and monitoring — so you don't need a dedicated IT team in-house."],
      ["Is my business data safe on a cloud server?", "Yes. We set up encryption, firewalls, regular updates and secure access controls to keep your data protected."],
      ["Can I increase resources during a busy season?", "Absolutely. You can boost RAM, CPU and storage on demand to handle a rush, and scale back down afterwards to save cost."],
      ["How is cloud hosting charged?", "It's usually a pay-as-you-go model — you pay monthly for the resources you actually use, with no large upfront hardware cost."],
    ],
    cta: ["Not sure what size of server you need?", "Talk to us — Kanvtech will recommend the right setup and handle everything from migration to monitoring."],
    related: ["tally-on-cloud", "app-development", "customize-solutions"],
  },
];

const bySlug = Object.fromEntries(SOLUTIONS.map((s) => [s.slug, s]));

function heroH1(h1) {
  const i = h1.indexOf("—");
  if (i > -1) return h1.slice(0, i) + `<span class="grad-text">` + h1.slice(i) + `</span>`;
  const words = h1.split(" ");
  const tail = words.splice(-2).join(" ");
  return words.join(" ") + ` <span class="grad-text">` + tail + `</span>`;
}

function solutionBody(s) {
  const featureCards = s.features
    .map(([icon, text]) => {
      const dash = text.indexOf(" — ");
      const title = dash > -1 && dash < 60 ? text.slice(0, dash) : null;
      const body = title ? text.slice(dash + 3) : text;
      return `          <div class="feat-card">
            ${ic(icon)}
            ${title ? `<h3>${title}</h3>` : ""}
            <p>${body}</p>
          </div>`;
    })
    .join("\n");

  const benefits = s.benefits
    .map((b, i) => {
      const dash = b.indexOf(" — ");
      const strong = dash > -1 && dash < 60 ? `<strong>${b.slice(0, dash)}</strong> — ${b.slice(dash + 3)}` : b;
      return `          <li class="benefit-item">
            <span class="bn">${String(i + 1).padStart(2, "0")}</span>
            <p>${strong}</p>
          </li>`;
    })
    .join("\n");

  const faqs = s.faq
    .map(
      ([q, a]) => `          <div class="faq-item">
            <button class="faq-q" aria-expanded="false">${q} ${ic("plus")}</button>
            <div class="faq-a"><p>${a}</p></div>
          </div>`
    )
    .join("\n");

  const related = s.related
    .map((slug) => {
      const r = bySlug[slug];
      return `          <a class="related-card" href="${r.slug}.html">
            <div><h3>${r.name}</h3><p>${r.cat}</p></div>
            ${ic("arrow-right")}
          </a>`;
    })
    .join("\n");

  const media = s.image
    ? `
    <!-- Imagery band -->
    <section class="section section--glow-r" style="padding-top:0">
      <div class="container">
        <div class="split">
          <div class="split-media">
            <div class="media-glow"></div>
            <div class="img-frame" data-reveal="wipe">
              <img src="${s.image.src}" alt="${s.image.alt}" loading="lazy">
            </div>
            <div class="media-chip" data-reveal="pop" data-delay="0.35">${ic("badge-check")}<span>Set up &amp; supported by Kanvtech</span></div>
          </div>
          <div data-reveal="right">
            <span class="eyebrow">Who it's for</span>
            <h2 class="display-2">Built for the way you work</h2>
            <p class="lead">${s.who}</p>
            <div class="hero-actions" style="margin-top:2rem; margin-bottom:0">
              <a href="contact-us.html?for=${encodeURIComponent(s.name)}#enquiry" class="btn btn-primary magnetic">Enquire About ${s.name} ${ic("arrow-right")}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`
    : `
    <!-- Who it's for -->
    <section class="section section--glow-r" style="padding-top:0">
      <div class="container">
        <div class="info-panel" data-reveal="clip" style="max-width:880px">
          <div class="ip-icon">${ic("target")}</div>
          <h2>Who it's for</h2>
          <p>${s.who}</p>
          <div class="hero-actions" style="margin-top:1.8rem; margin-bottom:0">
            <a href="contact-us.html?for=${encodeURIComponent(s.name)}#enquiry" class="btn btn-primary magnetic">Enquire About ${s.name} ${ic("arrow-right")}</a>
          </div>
        </div>
      </div>
    </section>`;

  return `
    <!-- Page hero -->
    <section class="page-hero">
      <div class="hero-rings" aria-hidden="true"><div class="ring r1"></div><div class="ring r3"></div></div>
      <div class="container">
        ${crumbs([{ name: "Solutions & Services", href: "solutions-and-services.html" }, { name: s.name }])}
        <span class="hero-badge" data-reveal="up">${s.badge ? `<em>Partner</em> ${s.badge}` : `<em>${s.cat}</em> Kanvtech ${s.cat === "Services" ? "Service" : "Solution"}`}</span>
        <h1 data-reveal="up" data-delay="0.08">${heroH1(s.h1)}</h1>
        <p class="lead" data-reveal="up" data-delay="0.16">${s.intro}</p>
        <div class="hero-actions" data-reveal="up" data-delay="0.24">
          <a href="contact-us.html?for=${encodeURIComponent(s.name)}#enquiry" class="btn btn-primary magnetic">Book a Free Demo ${ic("arrow-right")}</a>
          <a href="contact-us.html?for=${encodeURIComponent(s.name)}#enquiry" class="btn btn-glass magnetic">Send an Enquiry</a>
        </div>
      </div>
    </section>

    <!-- What it is -->
    <section class="section section--grid" style="padding-top:2rem">
      <div class="container">
        <div class="duo" data-stagger="snap">
          <div class="info-panel">
            <div class="ip-icon">${ic(s.icon)}</div>
            <h2>What it is</h2>
            <p>${s.what}</p>
          </div>
          <div class="info-panel">
            <div class="ip-icon" style="background:var(--grad-orange); box-shadow:0 10px 26px -8px rgba(255,122,0,.45)">${ic("handshake")}</div>
            <h2>Why get it through Kanvtech</h2>
            <p>${s.badge
              ? "As an authorised Spine partner, Kanvtech implements and supports Spine the right way — we understand your setup, configure it around your business, train your team and stay with you after go-live."
              : "One partner for all your systems. We recommend what genuinely fits, set it up the right way, and support you long after go-live — with a responsive team right here in Mumbai."}</p>
          </div>
        </div>
      </div>
    </section>
${media}

    <!-- Features -->
    <section class="section section--band" style="padding-block:clamp(4rem,7vw,6.5rem)">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${s.featHeading ? "What's inside" : "Key Features"}</span>
          <h2 class="display-2">${s.featHeading || "Everything you need, built in"}</h2>
        </div>
        <div class="feat-grid" data-stagger>
${featureCards}
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section section--glow-l" style="padding-top:clamp(4rem,7vw,7rem)">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">The Payoff</span>
          <h2 class="display-2">What your business <span class="grad-text">gets out of it</span></h2>
        </div>
        <ul class="benefit-list" data-stagger>
${benefits}
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">FAQ</span>
          <h2 class="display-2">Good questions, straight answers</h2>
        </div>
        <div class="faq" data-reveal="up">
${faqs}
        </div>
      </div>
    </section>

    <!-- Related -->
    <section class="section section--compact" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Keep Exploring</span>
          <h2 class="display-2">Related solutions</h2>
        </div>
        <div class="related-grid" data-stagger="snap">
${related}
        </div>
      </div>
    </section>
${ctaBand(s.cta[0], s.cta[1])}`;
}

function solutionSchema(s) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
          { "@type": "ListItem", position: 2, name: "Solutions & Services", item: SITE.url + "/solutions-and-services.html" },
          { "@type": "ListItem", position: 3, name: s.name, item: `${SITE.url}/${s.slug}.html` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: s.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "Service",
        name: s.name,
        provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
        areaServed: "Mumbai, India",
        description: s.desc,
      },
    ],
  };
}

/* ---------------------------------------------------------------------- */
/* HOME PAGE                                                               */
/* ---------------------------------------------------------------------- */

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`;

const INDUSTRIES_A = [
  ["factory", "Manufacturing"], ["shopping-bag", "Retail"], ["heart-pulse", "Healthcare"],
  ["landmark", "Finance & Banking"], ["graduation-cap", "Education"], ["briefcase", "Professional Services"],
  ["truck", "Logistics"], ["building-2", "Real Estate"],
];
const INDUSTRIES_B = [
  ["cpu", "IT & Technology"], ["utensils", "Hospitality"], ["pill", "Pharma"],
  ["shirt", "Textiles"], ["hammer", "Infrastructure"], ["car", "Automobile"],
  ["leaf", "Agriculture"], ["plug-zap", "Energy & Utilities"],
];

const homeBody = `
    <!-- ============================ HERO ============================ -->
    <section class="hero">
      <canvas id="particles" aria-hidden="true"></canvas>
      <div class="hero-rings" aria-hidden="true">
        <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
      </div>

      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="hero-badge"><em>Spine</em> Featuring Spine HR &amp; Payroll — authorised Spine partner</span>
          <h1 class="display-1">
            <span class="line"><span>Run Your Business</span></span>
            <span class="line"><span class="grad-text">Smarter,</span></span>
            <span class="line"><span>All From One Place</span></span>
          </h1>
          <p class="lead">HR, payroll, accounting, cloud and custom software — Kanvtech brings the systems your growing business needs under one roof, set up and supported by a team that genuinely knows them.</p>

          <div class="hero-actions">
            <a href="contact-us.html#enquiry" class="btn btn-orange magnetic">Book a Free Demo ${ic("arrow-right")}</a>
            <a href="contact-us.html#enquiry" class="btn btn-glass magnetic">Send an Enquiry</a>
            <a href="${SITE.wa}" target="_blank" rel="noopener" class="btn btn-wa">${WA_SVG} Chat on WhatsApp</a>
          </div>

          <div class="hero-ticks">
            <span>${ic("check")} Enterprise Software</span>
            <span>${ic("check")} Cloud Solutions</span>
            <span>${ic("check")} Digital Transformation</span>
            <span>${ic("check")} Business Consulting</span>
          </div>
        </div>

        <div class="hero-visual" data-tilt-scene>
          <div class="hero-glow" aria-hidden="true"></div>
          <div class="hero-img-wrap">
            <img src="${IMG.heroTeam}" alt="Indian business and technology consultants discussing enterprise solutions in a modern Mumbai office" fetchpriority="high">
          </div>

          <div class="float-card fc-1">
            <div class="fc-icon">${ic("award")}</div>
            <div><strong><span data-counter="18">0</span><sup>+</sup> Years</strong><small>Combined experience</small></div>
          </div>
          <div class="float-card fc-2">
            <div class="fc-icon warm">${ic("badge-check")}</div>
            <div><strong>Authorised</strong><small>Spine partner</small></div>
          </div>
          <div class="float-card fc-3">
            <div class="fc-icon">${ic("layers")}</div>
            <div><strong>One Partner</strong><small>For all your systems</small></div>
          </div>
        </div>
      </div>

      <div class="scroll-hint" aria-hidden="true"><div class="wheel"></div>Scroll</div>
    </section>

    <!-- ========================= TRUST BAR ========================== -->
    <section class="trust-bar">
      <div class="container trust-grid" data-stagger>
        <div class="trust-item">${ic("badge-check")}<p>Authorised Spine Partner</p></div>
        <div class="trust-item">${ic("award")}<p>18+ Years of Combined Experience</p></div>
        <div class="trust-item">${ic("layers")}<p>One Partner for All Your Systems</p></div>
        <div class="trust-item">${ic("map-pin")}<p>Hands-On Support in Mumbai</p></div>
      </div>
    </section>

    <!-- ======================== POSITIONING ========================= -->
    <section class="section">
      <div class="container">
        <div class="split rev">
          <div class="split-media">
            <div class="media-glow"></div>
            <div class="img-frame" data-reveal="mask">
              <img src="${IMG.present}" alt="Kanvtech consultant presenting a solutions roadmap to a business team" loading="lazy" data-parallax="-0.06">
            </div>
            <div class="media-chip" data-reveal="pop" data-delay="0.4">${ic("git-branch")}<span>One hub → many solutions</span></div>
          </div>
          <div data-reveal="left">
            <span class="eyebrow">Why Kanvtech</span>
            <h2 class="display-2">Everything Your Growing Business Runs On — <span class="grad-text">One Partner</span></h2>
            <p class="lead" style="margin-top:1rem">As your business grows, so does everything you have to manage — staff, salaries, attendance, accounts and the systems behind them. Most companies juggle a different vendor for each. We do it differently. From Spine HR and Payroll to Tally, cloud servers and custom software, Kanvtech is the single partner behind the systems that keep your business moving.</p>
            <div style="margin-top:2rem">
              <a class="link-arrow" href="solutions-and-services.html">Explore Our Solutions ${ic("arrow-right")}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================== SPINE SPOTLIGHT ======================= -->
    <section class="section" style="padding-top:0" id="spine">
      <div class="container">
        <div class="spotlight" data-reveal="scale">
          <div class="spotlight-orbit" aria-hidden="true"></div>
          <div class="spotlight-head">
            <span class="eyebrow">Authorised Spine Partner</span>
            <h2 class="display-2">Spine HR &amp; Payroll — <span class="grad-text">HR Made Simple</span></h2>
            <p class="lead" style="margin-top:0.9rem">Manage your people from hire to retire and run accurate, compliant payroll every month — without the spreadsheets and the month-end stress. As an authorised Spine partner, Kanvtech implements and supports Spine the right way.</p>
          </div>

          <div class="spotlight-cards">
            <div class="product-card" data-tilt>
              <div class="pc-top">
                <div class="pc-icon">${ic("wallet")}</div>
                <span class="badge-pop">Popular</span>
              </div>
              <h3>Spine Payroll</h3>
              <p>Accurate, on-time payroll with PF, ESIC, PT and TDS compliance built in. Automated salary, payslips, loans and reports.</p>
              <a class="link-arrow" href="spine-payroll.html">Learn More ${ic("arrow-right")}</a>
            </div>
            <div class="product-card" data-tilt>
              <div class="pc-top">
                <div class="pc-icon">${ic("users")}</div>
                <span class="badge-pop">Popular</span>
              </div>
              <h3>Spine HR Suite</h3>
              <p>A complete HRMS — recruitment, attendance, payroll, performance and more, on one platform, with a mobile app.</p>
              <a class="link-arrow" href="spine-hr-suite.html">Learn More ${ic("arrow-right")}</a>
            </div>
          </div>

          <a href="contact-us.html?for=Spine%20HR%20Suite#enquiry" class="btn btn-orange magnetic">Book a Free Spine Demo ${ic("arrow-right")}</a>
        </div>
      </div>
    </section>

    <!-- ======================= CORE SOLUTIONS ======================= -->
    <section class="section section--band" style="padding-block:clamp(4.5rem,8vw,7.5rem)">
      <div class="container">
        <div class="section-head--split">
          <div>
            <span class="eyebrow">What We Offer</span>
            <h2 class="display-2">Solutions Built Around <span class="grad-text">Your Business</span></h2>
          </div>
          <p class="lead">A focused set of solutions for the things that matter most.</p>
        </div>

        <div class="bento" data-stagger>
          <div class="product-card" data-tilt>
            <div class="pc-top"><div class="pc-icon">${ic("wallet")}</div><span class="badge-pop">Core</span></div>
            <h3>Spine Payroll</h3>
            <p>On-time, compliant payroll without the headaches.</p>
            <a class="link-arrow" href="spine-payroll.html">Learn More ${ic("arrow-right")}</a>
          </div>
          <div class="product-card" data-tilt>
            <div class="pc-top"><div class="pc-icon">${ic("users")}</div><span class="badge-pop">Core</span></div>
            <h3>Spine HR Suite</h3>
            <p>Complete HR management, hire to retire.</p>
            <a class="link-arrow" href="spine-hr-suite.html">Learn More ${ic("arrow-right")}</a>
          </div>
          <div class="product-card" data-tilt>
            <div class="pc-top"><div class="pc-icon">${ic("code")}</div></div>
            <h3>App Development</h3>
            <p>Websites, web apps and mobile apps, built end to end.</p>
            <a class="link-arrow" href="app-development.html">Learn More ${ic("arrow-right")}</a>
          </div>
          <div class="product-card" data-tilt>
            <div class="pc-top"><div class="pc-icon">${ic("settings-2")}</div></div>
            <h3>Custom Software</h3>
            <p>Software made for your exact process.</p>
            <a class="link-arrow" href="customize-solutions.html">Learn More ${ic("arrow-right")}</a>
          </div>
          <div class="product-card" data-tilt>
            <div class="pc-top"><div class="pc-icon">${ic("server-cog")}</div></div>
            <h3>Cloud Server</h3>
            <p>Secure, scalable, fully managed cloud hosting.</p>
            <a class="link-arrow" href="cloud-server.html">Learn More ${ic("arrow-right")}</a>
          </div>
        </div>

        <div style="text-align:center; margin-top:2.8rem" data-reveal="up">
          <a href="solutions-and-services.html" class="btn btn-primary magnetic">View All Solutions &amp; Services ${ic("arrow-right")}</a>
        </div>
      </div>
    </section>

    <!-- ======================= ALL OFFERINGS ======================== -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">The Full Toolkit</span>
          <h2 class="display-2">A Complete Toolkit for Your Business</h2>
        </div>

        <div class="offer-cols" data-stagger>
          <div class="offer-col">
            <h4>${ic("package")} Software</h4>
            <a href="spine-payroll.html">Spine Payroll ${ic("arrow-right")}</a>
            <a href="spine-hr-suite.html">Spine HR Suite ${ic("arrow-right")}</a>
            <a href="spine-asset.html">Spine Asset ${ic("arrow-right")}</a>
            <a href="tally-prime.html">Tally Prime ${ic("arrow-right")}</a>
            <a href="tally-prime-server.html">Tally Prime Server ${ic("arrow-right")}</a>
          </div>
          <div class="offer-col">
            <h4>${ic("wrench")} Services</h4>
            <a href="tally-software-services.html">Tally Software Services (TSS) ${ic("arrow-right")}</a>
            <a href="tally-services.html">Tally Services ${ic("arrow-right")}</a>
            <a href="tally-on-cloud.html">Tally on Cloud ${ic("arrow-right")}</a>
          </div>
          <div class="offer-col">
            <h4>${ic("layers")} Solutions</h4>
            <a href="tally-customization-solution.html">Tally Customization ${ic("arrow-right")}</a>
            <a href="tally-add-on.html">Tally Add-On (TDL) ${ic("arrow-right")}</a>
            <a href="app-development.html">App Development ${ic("arrow-right")}</a>
            <a href="customize-solutions.html">Custom Software Solutions ${ic("arrow-right")}</a>
            <a href="cloud-server.html">Cloud Server ${ic("arrow-right")}</a>
          </div>
        </div>

        <div style="text-align:center; margin-top:2.4rem" data-reveal="up">
          <a class="link-arrow" href="solutions-and-services.html">See everything we do ${ic("arrow-right")}</a>
        </div>
      </div>
    </section>

    <!-- ======================== WHY KANVTECH ======================== -->
    <section class="section" style="padding-top:0">
      <div class="glow-line"></div>
      <div class="container">
        <div class="why-grid">
          <div class="why-sticky" data-reveal="left">
            <span class="eyebrow">Why Businesses Choose Kanvtech</span>
            <h2 class="display-2">Five reasons companies <span class="grad-text">stay with us</span></h2>
            <div class="split-media" style="margin-top:2.2rem">
              <div class="media-glow"></div>
              <div class="img-frame">
                <img src="${IMG.consult}" alt="Kanvtech business consultants reviewing a client solution in the office" loading="lazy">
              </div>
              <div class="media-chip">${ic("map-pin")}<span>Mumbai-based team</span></div>
            </div>
          </div>

          <div data-stagger>
            <div class="feature-row">
              <div class="fr-icon">${ic("layers")}</div>
              <div><h3>One partner for all of it</h3><p>No juggling vendors for HR, payroll, Tally, cloud and software.</p></div>
            </div>
            <div class="feature-row">
              <div class="fr-icon">${ic("badge-check")}</div>
              <div><h3>Authorised Spine partner</h3><p>Spine HR, Payroll and Asset, properly implemented.</p></div>
            </div>
            <div class="feature-row">
              <div class="fr-icon">${ic("calculator")}</div>
              <div><h3>Deep Tally expertise</h3><p>Sales, setup, support, customization and cloud, all in-house.</p></div>
            </div>
            <div class="feature-row">
              <div class="fr-icon">${ic("pencil-ruler")}</div>
              <div><h3>Built around you</h3><p>Custom software shaped to how you actually work.</p></div>
            </div>
            <div class="feature-row">
              <div class="fr-icon">${ic("headset")}</div>
              <div><h3>Support that stays</h3><p>A responsive Mumbai team that's with you after go-live.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================== STATS ============================= -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="stats-band" data-reveal="scale">
          <div class="stats-grid">
            <div class="stat"><h3><span data-counter="18">0</span><sup>+</sup></h3><p>Years of combined experience</p></div>
            <div class="stat"><h3><span data-counter="15">0</span><sup>+</sup></h3><p>Solutions &amp; services offered</p></div>
            <div class="stat"><h3><span data-counter="3">0</span></h3><p>Spine products, authorised</p></div>
            <div class="stat warm"><h3>24<sup>×7</sup></h3><p>Cloud access, always on</p></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================== HOW WE WORK ========================= -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">How We Work</span>
          <h2 class="display-2">Getting Started Is <span class="grad-text">Simple</span></h2>
        </div>

        <div class="timeline">
          <div class="t-progress" aria-hidden="true"></div>
          <div class="t-step" data-reveal="up">
            <div class="t-num">1</div>
            <h3>Tell Us What You Need</h3>
            <p>Share your requirement or book a free demo. We listen first.</p>
          </div>
          <div class="t-step" data-reveal="up" data-delay="0.15">
            <div class="t-num">2</div>
            <h3>We Recommend &amp; Set Up</h3>
            <p>We suggest what genuinely fits, then implement it the right way.</p>
          </div>
          <div class="t-step" data-reveal="up" data-delay="0.3">
            <div class="t-num">3</div>
            <h3>We Support You</h3>
            <p>We stay with you after go-live — training, help and updates whenever you need.</p>
          </div>
        </div>

        <div style="text-align:center; margin-top:3rem" data-reveal="up">
          <a href="contact-us.html#enquiry" class="btn btn-primary magnetic">Start With a Free Demo ${ic("arrow-right")}</a>
        </div>
      </div>
    </section>

    <!-- ========================= INDUSTRIES ========================= -->
    <section class="section section--grid" style="padding-top:0">
      <div class="container section-head center" style="margin-bottom:2.5rem">
        <span class="eyebrow center">Industries We Serve</span>
        <h2 class="display-2">Solutions for <span class="grad-text">Every Industry</span></h2>
        <p class="lead" style="margin-inline:auto">From manufacturing and retail to healthcare, finance, education and services — our solutions adapt to any business. Spine Payroll and our other tools fit the way your industry works.</p>
      </div>

      <div class="marquee" data-reveal="up">
        <div class="marquee-track">
          ${[...INDUSTRIES_A, ...INDUSTRIES_A].map(([i, n]) => `<span class="chip">${ic(i)} ${n}</span>`).join("\n          ")}
        </div>
      </div>
      <div class="marquee rev" style="margin-top:1rem" data-reveal="up" data-delay="0.1">
        <div class="marquee-track">
          ${[...INDUSTRIES_B, ...INDUSTRIES_B].map(([i, n]) => `<span class="chip">${ic(i)} ${n}</span>`).join("\n          ")}
        </div>
      </div>
    </section>

    <!-- ===================== CERTIFIED & TRUSTED ==================== -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="spotlight" style="text-align:center; padding-block:3.5rem" data-reveal="up">
          <span class="eyebrow center">Certified &amp; Trusted</span>
          <h2 class="display-2" style="max-width:620px; margin:0 auto 1rem">Backed by partnership, built on trust</h2>
          <p class="lead" style="margin:0 auto 0; max-width:560px">An authorised Spine partner, backed by industry certifications and the trust of businesses who rely on us.</p>
          <!-- TODO: add Spine partner badge, certificate logos and client logos when the client shares them -->
        </div>
      </div>
    </section>

    <!--
      Testimonials & Blog sections are intentionally on hold:
      populate the carousel once the client shares real reviews, and wire the
      blog teaser to the 3 latest posts when the blog goes live.
    -->
${ctaBand("Ready to Run Your Business Smarter?", "Whether it's payroll, HR, Tally, cloud or custom software — let's find the right solution for you.")}`;

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: SITE.url + "/images/logo.png",
      email: SITE.email,
      telephone: "+917045998877",
      address: {
        "@type": "PostalAddress",
        streetAddress: "B-810, 8th Floor, Northern Supremus, Bharucha Road, Off S.V. Road, Dahisar (East)",
        addressLocality: "Mumbai",
        postalCode: "400068",
        addressRegion: "MH",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      name: SITE.short,
      url: SITE.url,
    },
  ],
};

/* ---------------------------------------------------------------------- */
/* ABOUT PAGE                                                              */
/* ---------------------------------------------------------------------- */

const aboutBody = `
    <section class="page-hero">
      <div class="hero-rings" aria-hidden="true"><div class="ring r1"></div><div class="ring r3"></div></div>
      <div class="container">
        ${crumbs([{ name: "About Us" }])}
        <span class="hero-badge" data-reveal="up"><em>About</em> Kanvtech Solutions Private Limited</span>
        <h1 data-reveal="up" data-delay="0.08">Solutions That Help Your Business <span class="grad-text">Grow</span></h1>
        <p class="lead" data-reveal="up" data-delay="0.16">Kanvtech Solutions is a Mumbai-based technology company helping businesses run smarter. From HR and payroll to accounting, cloud and custom software, we bring together the tools a growing company needs — and the support to make them work.</p>
      </div>
    </section>

    <!-- Who we are -->
    <section class="section" style="padding-top:2rem">
      <div class="container">
        <div class="split">
          <div class="split-media" data-reveal="left">
            <div class="media-glow"></div>
            <div class="img-frame">
              <img src="${IMG.team}" alt="The Kanvtech team collaborating in a modern office" loading="lazy" data-parallax="-0.05">
            </div>
            <div class="media-chip">${ic("award")}<span>18+ years of combined experience</span></div>
          </div>
          <div data-reveal="right">
            <span class="eyebrow">Who We Are</span>
            <h2 class="display-2">Young, dynamic — with <span class="grad-text">serious depth</span> behind it</h2>
            <p class="lead" style="margin-top:1rem">Kanvtech Solutions Private Limited is a young and dynamic company with a serious depth of experience behind it. Our team brings together over 18 years of combined experience in software and business enterprise solutions — the kind of know-how that only comes from years of solving real problems for real businesses.</p>
            <p style="color:var(--text-muted); margin-top:1rem">We're driven by a simple belief: that good software, set up the right way, should make a business easier to run. That's why we don't just hand over a product and walk away. We understand how you work, recommend what genuinely fits, and stay with you long after go-live.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What we do -->
    <section class="section" style="padding-top:0">
      <div class="glow-line"></div>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">What We Do</span>
          <h2 class="display-2">One Partner for Your <span class="grad-text">Business Systems</span></h2>
          <p class="lead" style="margin-inline:auto">As a business grows, the list of things to manage grows with it — staff, salaries, attendance, accounts, data, and the systems that hold everything together. Most companies end up juggling different vendors for each. We do it differently.</p>
        </div>

        <div class="feat-grid feat-grid--mosaic" data-stagger>
          <div class="feat-card">${ic("users")}<h3>HR &amp; Payroll Software</h3><p>Spine HR Suite and Spine Payroll to manage your people end to end.</p></div>
          <div class="feat-card">${ic("calculator")}<h3>Tally, End to End</h3><p>Software, services, customization and cloud access for your accounting and compliance.</p></div>
          <div class="feat-card">${ic("cloud")}<h3>Cloud Servers</h3><p>Keep your systems secure and accessible anywhere.</p></div>
          <div class="feat-card">${ic("code")}<h3>Custom Software &amp; Apps</h3><p>Built around your exact processes, from websites to full applications.</p></div>
          <div class="feat-card">${ic("box")}<h3>Asset Management</h3><p>Spine Asset for tracking, depreciation and audit-ready records.</p></div>
          <div class="feat-card">${ic("fingerprint")}<h3>Analytics &amp; Biometrics</h3><p>Business analytics and biometric solutions as you scale.</p></div>
        </div>
        <p style="text-align:center; margin-top:2.2rem; color:var(--text-muted)" data-reveal="up">One partner, one point of contact, for the systems your business runs on.</p>
      </div>
    </section>

    <!-- Who we serve -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="split rev">
          <div class="split-media" data-reveal="right">
            <div class="media-glow"></div>
            <div class="img-frame">
              <img src="${IMG.businesswoman}" alt="An Indian business leader reviewing growth reports with her team" loading="lazy">
            </div>
            <div class="media-chip">${ic("trending-up")}<span>Built for growing businesses</span></div>
          </div>
          <div data-reveal="left">
            <span class="eyebrow">Who We Serve</span>
            <h2 class="display-2">Built for <span class="grad-text">Growing Businesses</span></h2>
            <p class="lead" style="margin-top:1rem">We work with businesses of every size and across every industry — manufacturing, retail, healthcare, services, finance, education and more. Whether you're a small team setting up your first proper systems or an established company streamlining how you operate, our solutions scale to fit. Because Spine Payroll and our other solutions adapt to any industry, there's rarely a business we can't help.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What sets us apart -->
    <section class="section" style="padding-top:0">
      <div class="glow-line"></div>
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Why Choose Kanvtech</span>
          <h2 class="display-2">What Sets Us <span class="grad-text">Apart</span></h2>
        </div>
        <div data-stagger>
          <div class="feature-row">
            <div class="fr-icon">${ic("layers")}</div>
            <div><h3>One partner for everything</h3><p>Payroll, HR, Tally, cloud and custom software, all under one roof. No juggling vendors.</p></div>
          </div>
          <div class="feature-row">
            <div class="fr-icon">${ic("badge-check")}</div>
            <div><h3>Authorised Spine partner</h3><p>We deliver Spine HR Suite, Spine Payroll and Spine Asset properly implemented and fully supported.</p></div>
          </div>
          <div class="feature-row">
            <div class="fr-icon">${ic("calculator")}</div>
            <div><h3>Real Tally expertise</h3><p>Sales, setup, support, customization and cloud, handled in-house by people who know it inside out.</p></div>
          </div>
          <div class="feature-row">
            <div class="fr-icon">${ic("pencil-ruler")}</div>
            <div><h3>Solutions built around you</h3><p>When off-the-shelf doesn't fit, we build software that does.</p></div>
          </div>
          <div class="feature-row">
            <div class="fr-icon">${ic("headset")}</div>
            <div><h3>Support that stays</h3><p>A responsive team that's there for you well beyond the install.</p></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">How We Work</span>
          <h2 class="display-2">What <span class="grad-text">Drives Us</span></h2>
        </div>
        <div class="value-grid" data-stagger>
          <div class="value-card">
            <div class="vc-icon">${ic("gem")}</div>
            <h3>Excellence</h3><p>We stay ahead of the curve and hold our work to a high standard.</p>
          </div>
          <div class="value-card">
            <div class="vc-icon">${ic("scale")}</div>
            <h3>Honesty</h3><p>We recommend what's right for you, not just what's easy to sell.</p>
          </div>
          <div class="value-card">
            <div class="vc-icon">${ic("flame")}</div>
            <h3>Commitment</h3><p>We're driven to exceed what our customers expect.</p>
          </div>
          <div class="value-card">
            <div class="vc-icon">${ic("handshake")}</div>
            <h3>Partnership</h3><p>We treat your business like our own, for the long run.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="stats-band" data-reveal="scale">
          <div class="stats-grid">
            <div class="stat"><h3><span data-counter="18">0</span><sup>+</sup></h3><p>Years of combined experience</p></div>
            <div class="stat"><h3><span data-counter="15">0</span><sup>+</sup></h3><p>Solutions &amp; services offered</p></div>
            <div class="stat"><h3><span data-counter="3">0</span></h3><p>Spine products, authorised</p></div>
            <div class="stat warm"><h3>1</h3><p>Partner for all of it</p></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted & certified -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="spotlight" style="text-align:center; padding-block:3.5rem" data-reveal="up">
          <span class="eyebrow center">Trusted &amp; Certified</span>
          <h2 class="display-2" style="max-width:620px; margin:0 auto 1rem">Partnership you can verify</h2>
          <p class="lead" style="margin:0 auto; max-width:600px">We're proud to be an authorised Spine partner, and our work is backed by industry certifications and the trust of businesses who rely on us every day.</p>
          <!-- TODO: add Spine partner badge, certificate logos and client logos once the client shares them -->
        </div>
      </div>
    </section>
${ctaBand("Let's Build Something That Works for You", "Tell us what your business needs, and we'll help you find the right solution.")}`;

/* ---------------------------------------------------------------------- */
/* SOLUTIONS & SERVICES HUB                                                */
/* ---------------------------------------------------------------------- */

function hubCard(slug, blurb) {
  const s = bySlug[slug];
  return `          <div class="product-card" data-tilt>
            <div class="pc-top">
              <div class="pc-icon">${ic(s.icon)}</div>
              ${s.pop ? '<span class="badge-pop">Popular</span>' : ""}
            </div>
            <h3>${s.name}</h3>
            <p>${blurb}</p>
            <a class="link-arrow" href="${s.slug}.html">Learn More ${ic("arrow-right")}</a>
          </div>`;
}

const hubBody = `
    <section class="page-hero">
      <div class="hero-rings" aria-hidden="true"><div class="ring r1"></div><div class="ring r3"></div></div>
      <div class="container">
        ${crumbs([{ name: "Solutions & Services" }])}
        <span class="hero-badge" data-reveal="up"><em>Hub</em> Everything we do, in one place</span>
        <h1 data-reveal="up" data-delay="0.08">One Partner for Everything Your Business <span class="grad-text">Runs On</span></h1>
        <p class="lead" data-reveal="up" data-delay="0.16">As your business grows, so does everything you have to manage — payroll, HR, accounting, data, and the systems that hold it all together. Kanvtech brings these under one roof. From Spine HR and Payroll to Tally, cloud and custom software, we provide the complete set of solutions a growing company needs, backed by hands-on support. One team, one point of contact, for all of it.</p>
      </div>
    </section>

    <!-- Software -->
    <section class="section" style="padding-top:2rem">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">01 · Software</span>
          <h2 class="display-2">Ready-to-use <span class="grad-text">software</span></h2>
          <p class="lead">Reliable, ready-to-use software for your core business operations.</p>
        </div>
        <div class="feat-grid" data-stagger>
${hubCard("spine-payroll", "Accurate, on-time payroll with PF, ESIC, PT and TDS compliance built in.")}
${hubCard("spine-hr-suite", "A complete HRMS that manages your people from hire to retire — on one platform.")}
${hubCard("spine-asset", "Track assets, automate depreciation and stay audit-ready, all in one place.")}
${hubCard("tally-prime", "All-in-one business software for accounting, invoicing, inventory and GST.")}
${hubCard("tally-prime-server", "Fast, secure, multi-user Tally for growing and high-volume businesses.")}
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="section" style="padding-top:0">
      <div class="glow-line"></div>
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">02 · Services</span>
          <h2 class="display-2">Expert <span class="grad-text">Tally services</span></h2>
          <p class="lead">Expert Tally services to keep your systems running smoothly.</p>
        </div>
        <div class="feat-grid" data-stagger>
${hubCard("tally-software-services", "Unlock connected GST, banking, backups and remote access in TallyPrime.")}
${hubCard("tally-services", "Implementation, onsite & remote support, AMC and training — end to end.")}
${hubCard("tally-on-cloud", "Access your Tally securely from any device, anywhere, anytime.")}
        </div>
      </div>
    </section>

    <!-- Solutions -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">03 · Solutions</span>
          <h2 class="display-2">Tailored <span class="grad-text">solutions</span></h2>
          <p class="lead">Tailored solutions built around the way your business works.</p>
        </div>
        <div class="feat-grid" data-stagger>
${hubCard("app-development", "Websites, web apps and mobile apps — designed, built and maintained end to end.")}
${hubCard("customize-solutions", "Software made for your exact process — ERP, CRM, automation and integrations.")}
${hubCard("cloud-server", "Secure, scalable, fully managed cloud hosting for your business.")}
${hubCard("tally-customization-solution", "Tailor Tally with custom reports, integrations and fields — without touching the core.")}
${hubCard("tally-add-on", "Add extra features to Tally — security, automation, invoicing and more.")}
        </div>
      </div>
    </section>

    <!-- Also from Kanvtech -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Also From Kanvtech</span>
          <h2 class="display-2">Growing <span class="grad-text">capabilities</span></h2>
          <p class="lead">Growing capabilities to support your business further.</p>
        </div>
        <div class="feat-grid" data-stagger style="grid-template-columns:repeat(2,1fr)">
          <div class="product-card" data-tilt>
            <div class="pc-top">
              <div class="pc-icon">${ic("chart-line")}</div>
              <span class="badge-pop" style="color:var(--cyan); border-color:rgba(24,195,230,.35); background:rgba(24,195,230,.1); box-shadow:none">Coming Soon</span>
            </div>
            <h3>Business Analytics</h3>
            <p>Turn your business data into clear, actionable insights.</p>
            <a class="link-arrow" href="contact-us.html?for=Business%20Analytics#enquiry">Enquire Now ${ic("arrow-right")}</a>
          </div>
          <div class="product-card" data-tilt>
            <div class="pc-top">
              <div class="pc-icon">${ic("fingerprint")}</div>
              <span class="badge-pop" style="color:var(--cyan); border-color:rgba(24,195,230,.35); background:rgba(24,195,230,.1); box-shadow:none">Coming Soon</span>
            </div>
            <h3>Biometric Device</h3>
            <p>Reliable biometric attendance that connects straight to your HR and payroll.</p>
            <a class="link-arrow" href="contact-us.html?for=Biometric%20Device#enquiry">Enquire Now ${ic("arrow-right")}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Kanvtech -->
    <section class="section" style="padding-top:0">
      <div class="glow-line"></div>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">Why Kanvtech</span>
          <h2 class="display-2">Why Businesses <span class="grad-text">Choose Kanvtech</span></h2>
        </div>
        <div class="feat-grid" data-stagger>
          <div class="feat-card">${ic("layers")}<h3>One partner for all of it</h3><p>Payroll, HR, Tally, cloud and custom software, under one roof.</p></div>
          <div class="feat-card">${ic("badge-check")}<h3>Authorised Spine partner</h3><p>Trusted Spine HR, Payroll and Asset solutions, properly implemented.</p></div>
          <div class="feat-card">${ic("calculator")}<h3>Deep Tally expertise</h3><p>Sales, setup, support, customization and cloud, all in-house.</p></div>
          <div class="feat-card">${ic("pencil-ruler")}<h3>Built around you</h3><p>Custom software and solutions shaped to your exact needs.</p></div>
          <div class="feat-card">${ic("headset")}<h3>Real support</h3><p>A responsive team in Mumbai that stays with you after go-live.</p></div>
        </div>
      </div>
    </section>
${ctaBand("Not sure which solution fits your business?", "Tell us what you're trying to solve, and we'll point you to the right fit.")}`;

/* ---------------------------------------------------------------------- */
/* CONTACT PAGE                                                            */
/* ---------------------------------------------------------------------- */

const ENQUIRY_OPTIONS = [
  "Spine Payroll", "Spine HR Suite", "Spine Asset",
  "Tally Prime / Tally Prime Server", "Tally Software Services (TSS)",
  "Tally Services / Support", "Tally on Cloud", "Tally Customization / Add-On",
  "App Development", "Custom Software Solutions", "Cloud Server",
  "Business Analytics", "Biometric Device", "Other",
];

const contactBody = `
    <section class="page-hero">
      <div class="hero-rings" aria-hidden="true"><div class="ring r1"></div><div class="ring r3"></div></div>
      <div class="container">
        ${crumbs([{ name: "Contact Us" }])}
        <span class="hero-badge" data-reveal="up"><em>Hello</em> We usually reply the same day</span>
        <h1 data-reveal="up" data-delay="0.08">Feel Free to <span class="grad-text">Ask</span></h1>
        <p class="lead" data-reveal="up" data-delay="0.16">Have a question or ready to get started? Whether you want a demo, a quote, or just have a question about the right solution for your business, we're happy to help. Fill in the form and we'll get back to you, or reach us directly using the details below.</p>
      </div>
    </section>

    <section class="section" style="padding-top:2rem" id="enquiry">
      <div class="container contact-grid">
        <!-- Form -->
        <div class="form-card" data-reveal="left">
          <h2>Send Us a Message</h2>
          <form id="enquiry-form" novalidate>
            <!-- Honeypot — keep hidden -->
            <input type="text" name="company_website" tabindex="-1" autocomplete="off" style="position:absolute; left:-9999px" aria-hidden="true">

            <div class="form-grid">
              <div class="field">
                <label for="f-name">Full Name <em>*</em></label>
                <input id="f-name" name="name" type="text" placeholder="Your full name" required>
                <span class="err-msg">Please enter your name</span>
              </div>
              <div class="field">
                <label for="f-company">Company Name</label>
                <input id="f-company" name="company" type="text" placeholder="Your company (optional)">
              </div>
              <div class="field">
                <label for="f-email">Email <em>*</em></label>
                <input id="f-email" name="email" type="email" placeholder="you@company.com" required>
                <span class="err-msg">Please enter a valid email</span>
              </div>
              <div class="field">
                <label for="f-phone">Phone <em>*</em></label>
                <input id="f-phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required>
                <span class="err-msg">Please enter a valid phone number</span>
              </div>
              <div class="field full">
                <label for="f-for">Enquiry For <em>*</em></label>
                <select id="f-for" name="enquiry_for" required>
                  <option value="" disabled selected>Select a solution or service</option>
${ENQUIRY_OPTIONS.map((o) => `                  <option value="${o}">${o}</option>`).join("\n")}
                </select>
                <span class="err-msg">Please choose what your enquiry is about</span>
              </div>
              <div class="field full">
                <label for="f-msg">Message <em>*</em></label>
                <textarea id="f-msg" name="message" placeholder="Write your message" required></textarea>
                <span class="err-msg">Please write a short message</span>
              </div>
            </div>

            <div style="margin-top:1.4rem">
              <button type="submit" class="btn btn-primary magnetic" style="width:100%">Send Message ${ic("send")}</button>
            </div>
            <p class="form-note">By submitting, you agree to our <a href="privacy-policy.html">Privacy Policy</a>. Your details are safe with us and used only to respond to your enquiry.</p>

            <div class="form-success" role="status">
              ${ic("check")}
              <span>Thank you for reaching out. Your enquiry has been received — our team will get back to you shortly.</span>
            </div>
          </form>
        </div>

        <!-- Details -->
        <div class="contact-cards" data-stagger>
          <div class="contact-card">
            <div class="cc-icon">${ic("map-pin")}</div>
            <div>
              <h3>Visit Us</h3>
              <p>Kanvtech Solutions Private Limited<br>B-810, 8th Floor, Northern Supremus,<br>Bharucha Road, Off S.V. Road,<br>Dahisar (East), Mumbai - 400068</p>
            </div>
          </div>
          <div class="contact-card">
            <div class="cc-icon">${ic("phone")}</div>
            <div>
              <h3>Call Us</h3>
              <a href="${SITE.phoneHref}">${SITE.phone}</a>
            </div>
          </div>
          <div class="contact-card">
            <div class="cc-icon">${ic("mail")}</div>
            <div>
              <h3>Email Us</h3>
              <a href="mailto:${SITE.email}">${SITE.email}</a><br>
              <a href="${SITE.url}" style="font-size:.85rem">www.kanvtech.com</a>
            </div>
          </div>
          <div class="contact-card">
            <div class="cc-icon" style="background:rgba(37,211,102,.08); border-color:rgba(37,211,102,.3)">
              <svg viewBox="0 0 24 24" fill="#25D366" width="21" height="21" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </div>
            <div>
              <h3>WhatsApp</h3>
              <a href="${SITE.wa}" target="_blank" rel="noopener">Chat on WhatsApp</a>
            </div>
          </div>
          <div class="contact-card">
            <div class="cc-icon">${ic("clock")}</div>
            <div>
              <h3>Business Hours</h3>
              <p>${SITE.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="map-wrap" data-reveal="up">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235.48961819273913!2d72.85561382484734!3d19.20245619236971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b735507ef5f9%3A0xe6e2e9495c3c140c!2sKanvtech%20Solutions%20Private%20Limited!5e0!3m2!1sen!2sin!4v1675776891712!5m2!1sen!2sin"
            width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" title="Kanvtech Solutions on Google Maps">
          </iframe>
        </div>
        <div style="text-align:center; margin-top:1.6rem" data-reveal="up">
          <a class="link-arrow" href="https://www.google.com/maps/dir/?api=1&destination=Kanvtech+Solutions+Private+Limited+Dahisar+East+Mumbai" target="_blank" rel="noopener">Get Directions ${ic("navigation")}</a>
        </div>
      </div>
    </section>
${ctaBand("Looking for the right solution for your business?", "Tell us what you're trying to solve — a quick chat is usually all it takes to point you the right way.")}`;

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  image: SITE.url + "/images/logo.png",
  url: SITE.url,
  telephone: "+917045998877",
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "B-810, 8th Floor, Northern Supremus, Bharucha Road, Off S.V. Road, Dahisar (East)",
    addressLocality: "Mumbai",
    postalCode: "400068",
    addressRegion: "MH",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 19.20245619236971, longitude: 72.85561382484734 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00",
  },
};

/* ---------------------------------------------------------------------- */
/* LEGAL PAGES                                                             */
/* ---------------------------------------------------------------------- */

function legalBody(title, intro, sections) {
  return `
    <section class="page-hero">
      <div class="container">
        ${crumbs([{ name: title }])}
        <h1 data-reveal="up">${title}</h1>
        <p class="lead" data-reveal="up" data-delay="0.1">${intro}</p>
      </div>
    </section>
    <section class="section" style="padding-top:1rem">
      <div class="container legal-body">
${sections
  .map(
    (sec) => `        <h2>${sec.h}</h2>\n${sec.body
      .map((b) =>
        Array.isArray(b)
          ? `        <ul>\n${b.map((li) => `          <li>${li}</li>`).join("\n")}\n        </ul>`
          : `        <p>${b}</p>`
      )
      .join("\n")}`
  )
  .join("\n")}
      </div>
    </section>`;
}

const CONTACT_BLOCK = [
  `${SITE.name}<br>B-810, 8th Floor, Northern Supremus, Bharucha Road,<br>Off S.V. Road, Dahisar (East), Mumbai - 400068<br>Email: <a href="mailto:${SITE.email}">${SITE.email}</a><br>Phone: <a href="${SITE.phoneHref}">+91 7045998877</a>`,
];

const privacySections = [
  { h: "1. Information We Collect", body: [
    "We only collect what we actually need to respond to you and run our business. This falls into two kinds.",
    "Information you give us directly:",
    ["Your name, email address and phone number",
     "Your company name and details about your requirement, when you fill an enquiry or contact form",
     "Your resume and the details in it, if you apply through our Career page",
     "Your email address, if you subscribe for updates",
     "Anything else you choose to share in a message to us"],
    "Information collected automatically:",
    ["Basic technical data such as your IP address, browser type and device",
     "How you use the website — pages visited and time spent — gathered through cookies and similar tools"],
    "We do not ask for sensitive financial details like card or bank information through this website.",
  ]},
  { h: "2. How We Use Your Information", body: [
    "The information we collect is used to:",
    ["Respond to your enquiries and answer your questions",
     "Share quotations, product details and follow-ups you've asked for",
     "Process and review job applications received through the Career page",
     "Send updates or information you've subscribed to",
     "Improve the website and understand how visitors use it",
     "Meet any legal or record-keeping requirement that applies to us"],
    "We use your details only for the purpose you shared them for. We don't sell your information, and we don't send unsolicited marketing to people who haven't asked for it.",
  ]},
  { h: "3. Cookies", body: [
    "Like most websites, ours uses cookies — small files saved on your device — to help the site work properly and to understand how it's being used. These help us remember basic preferences and improve your experience. You can switch off or delete cookies through your browser settings at any time, though some parts of the site may not work as smoothly if you do.",
  ]},
  { h: "4. How We Share Information", body: [
    "We treat your information as private and share it only when there's a clear reason to:",
    ["With trusted service providers who help us run the website or deliver a service to you, and only to the extent they need it",
     "With software vendors or partners (such as Spine) when it's necessary to set up or support a product you've engaged us for",
     "When the law requires us to, or to protect our rights and safety"],
    "Anyone we share information with is expected to keep it secure and use it only for the agreed purpose. We never sell or rent your personal information to third parties.",
  ]},
  { h: "5. Data Security", body: [
    "We take reasonable steps to keep your information safe from loss, misuse or unauthorised access. That said, no method of sending or storing data online is completely secure, so while we do our best to protect your details, we can't promise absolute security. You also play a part by keeping any login or account details on your side safe.",
  ]},
  { h: "6. How Long We Keep It", body: [
    "We keep your information only for as long as it's needed for the purpose it was collected, or for as long as the law requires us to. Once it's no longer needed, we remove or securely dispose of it. Job applications may be kept on file for a reasonable period in case a suitable role comes up later.",
  ]},
  { h: "7. External Links", body: [
    "Our website may contain links to other sites, such as vendor or product pages. This privacy policy applies only to our website. Once you move to another site, we have no control over how they handle your information, so we'd suggest reading their privacy policy before sharing anything.",
  ]},
  { h: "8. Your Choices & Rights", body: [
    "You have a say in how your information is handled. You can:",
    ["Ask us what personal information we hold about you",
     "Ask us to correct details that are wrong or out of date",
     "Ask us to delete your information, where there's no legal reason to keep it",
     "Opt out of any updates or marketing emails at any time"],
    "To do any of this, just reach out to us using the contact details below and we'll help.",
  ]},
  { h: "9. Children's Privacy", body: [
    "Our website and services are meant for businesses and adults. We don't knowingly collect information from children. If you believe a child has shared personal details with us, please let us know and we'll remove it.",
  ]},
  { h: "10. Changes to This Policy", body: [
    "We may update this privacy policy from time to time as our practices or the law change. The latest version will always be published on this page, with the understanding that continuing to use the website means you accept the current version.",
  ]},
  { h: "11. Contact Us", body: [
    "If you have any questions about this privacy policy or how your information is handled, please get in touch:",
    ...CONTACT_BLOCK,
  ]},
];

const termsSections = [
  { h: "1. Use of the Website", body: [
    "You're welcome to use this website for genuine purposes — to learn about what we offer, to enquire, or to get in touch. You agree not to misuse the site in any way, including attempting to gain unauthorised access, disrupting how it works, copying its content for your own commercial use, or using it for anything unlawful. We may restrict or withdraw access to the site at any time if we believe it's being misused, and we don't have to give a reason.",
  ]},
  { h: "2. Our Products & Services", body: [
    "Kanvtech provides software products, services and business solutions. This includes Spine products — Spine Payroll, Spine HR Suite and Spine Asset — for which we are an authorised partner of Spine Technologies. It also includes Tally-related services such as support, customization, add-ons and cloud access, along with our own offerings like application development, custom software, cloud server, business analytics and biometric solutions.",
    "The descriptions on this website are meant to give you a general understanding of each offering. Exact features, scope, timelines and pricing are confirmed in writing when we share a quotation or agreement for your specific requirement. Where a product belongs to a third-party vendor, that vendor's own licensing terms and conditions will also apply to your use of it.",
  ]},
  { h: "3. Enquiries, Quotations & Payments", body: [
    "Any enquiry you make through this website is an expression of interest, not a confirmed order. A service or purchase is confirmed only once we issue a written quotation or invoice and you accept it.",
    "Prices for software, services and solutions are shared on request and may change depending on your requirement, the vendor's pricing, and any updates over time. Payment terms, timelines and deliverables for a project are set out in the specific quotation or agreement for that work, and those terms take priority over anything general stated here.",
  ]},
  { h: "4. Intellectual Property", body: [
    "The content on this website — text, graphics, layout, logo and design — belongs to Kanvtech, unless it clearly belongs to someone else. You may view and read it for your own reference, but you may not copy, reproduce, republish or use it for commercial purposes without our written permission.",
    "\"Tally\" and \"TallyPrime\" are trademarks of Tally Solutions Private Limited. \"Spine\" and its product names are trademarks of Spine Technologies. Any other brand or product names mentioned belong to their respective owners. These names appear here only to describe the services we provide and do not transfer any rights to you.",
  ]},
  { h: "5. Your Responsibilities", body: [
    "When you contact us or share information through the website, you agree that the details you provide are true and accurate. If you engage us for a service, you agree to share the inputs, access and approvals we need on time, since delays from your side can affect timelines. You're also responsible for keeping your own login details, data and systems secure on your end.",
  ]},
  { h: "6. Third-Party Products & Links", body: [
    "Some of what we deliver involves software made by other companies, such as Spine and Tally. While we implement and support these products, we don't control how the vendor develops, updates or licenses them. Any issue that arises from the vendor's own software, terms or policies is governed by that vendor.",
    "This website may also link to external sites for your convenience. We're not responsible for the content, accuracy or practices of those sites, and visiting them is your own choice.",
  ]},
  { h: "7. Disclaimer of Warranties", body: [
    "The website and its content are provided on an \"as is\" basis. We do our best to keep everything accurate and the site running well, but we don't guarantee that the information is complete, that the site will always be available, or that it will be free of errors or interruptions. The information here is for general guidance and is not professional, legal, financial or compliance advice.",
  ]},
  { h: "8. Limitation of Liability", body: [
    "Kanvtech will not be responsible for any direct or indirect loss or damage that results from using this website or relying on its content, including loss of data, business or profit. For any service we deliver, our responsibility is limited to the terms agreed in that specific project's quotation or agreement.",
  ]},
  { h: "9. Indemnity", body: [
    "You agree to keep Kanvtech protected from any claim, loss or expense that arises because you misused the website, broke these terms, or used the information here in a way that caused harm to others.",
  ]},
  { h: "10. Privacy", body: [
    `Any personal details you share with us — such as your name, email or phone number — are handled as described in our <a href="privacy-policy.html">Privacy Policy</a>. We recommend you read it alongside these terms.`,
  ]},
  { h: "11. Governing Law & Jurisdiction", body: [
    "These terms are governed by the laws of India. Any dispute connected to this website or our services will be subject to the jurisdiction of the courts in Mumbai, Maharashtra.",
  ]},
  { h: "12. Changes to These Terms", body: [
    "We may revise these terms from time to time as our services or the law change. The current version will always be the one published on this page. By continuing to use the website after an update, you accept the revised terms.",
  ]},
  { h: "13. Contact Us", body: [
    "If you have any questions about these terms, please reach out:",
    ...CONTACT_BLOCK,
  ]},
];

const disclaimerSections = [
  { h: "1. General Information", body: [
    "Everything we share here is meant to give you a clear idea of what Kanvtech does and how we can help your business. We try to keep the details correct and up to date, but we don't promise that every piece of information is complete or free of error at all times. Software features, service offerings and pricing can change, and the content on this site may not always reflect the latest updates from us or from the software vendors we work with.",
    "Any decision you take based on what you read here is your own. Before you commit to a product or service, we recommend you speak to our team directly so we can advise you on what actually fits your requirement.",
  ]},
  { h: "2. Products, Brands & Trademarks", body: [
    "Kanvtech is an authorised partner of Spine Technologies and provides, implements and supports Spine products such as Spine Payroll, Spine HR Suite and Spine Asset.",
    "We also offer services, support, customization and cloud hosting around Tally software. Please note that Kanvtech provides Tally-related services only — we are not the manufacturer of Tally and any reference to Tally on this site is in connection with the services we deliver.",
    "\"Tally\" and \"TallyPrime\" are trademarks of Tally Solutions Private Limited. \"Spine\" and related product names are trademarks of Spine Technologies. All other product names, logos and brands mentioned on this website belong to their respective owners. Using these names here is only for identification and description, and does not imply any endorsement unless we have clearly stated a partnership.",
  ]},
  { h: "3. No Professional Advice", body: [
    "The content on this website is for information only. It is not legal, financial, accounting, tax or compliance advice, and it shouldn't be treated as a substitute for advice from a qualified professional. Areas like payroll, GST, statutory deductions and compliance depend heavily on your specific situation and on rules that change from time to time. Always confirm with the right professional before acting on anything you read here.",
  ]},
  { h: "4. External Links", body: [
    "Some pages may link to other websites that we don't own or control — for example, vendor or product pages. We share those links to help you, not because we take responsibility for them. We can't vouch for the accuracy, content or safety of any external site, and visiting them is at your own discretion. A link from our site does not mean we endorse everything on the linked page.",
  ]},
  { h: "5. Accuracy & Availability", body: [
    "We make a genuine effort to keep this website running smoothly and to keep the information current. Even so, we can't guarantee the site will always be available, error-free or free from technical issues. Kanvtech will not be held responsible for any problem that comes from the site being temporarily unavailable for reasons outside our control.",
  ]},
  { h: "6. Limitation of Liability", body: [
    "Kanvtech Solutions Private Limited will not be liable for any loss or damage — direct or indirect — that may result from using this website or relying on its content. This includes any loss of data, business or profit. You use the information on this site on the understanding that you accept this condition.",
  ]},
  { h: "7. Changes to This Disclaimer", body: [
    "We may update this disclaimer from time to time as our services or the law change. The latest version will always be the one published on this page, so it's worth checking back occasionally. Continuing to use the website after a change means you accept the updated terms.",
  ]},
  { h: "8. Contact Us", body: [
    "If you have any questions about this disclaimer or anything on our website, get in touch:",
    ...CONTACT_BLOCK,
  ]},
];

/* ---------------------------------------------------------------------- */
/* BUILD                                                                   */
/* ---------------------------------------------------------------------- */

const PAGES = [
  {
    slug: "index",
    title: "Kanvtech Solutions - HR, Payroll, Tally, Cloud & Software in Mumbai",
    desc: "Kanvtech Solutions is your one partner for Spine HR & Payroll, Tally, cloud servers and custom software in Mumbai. Book a free demo today.",
    body: homeBody,
    schema: homeSchema,
  },
  {
    slug: "about-us",
    title: "About Kanvtech Solutions - IT & Software Solutions Company in Mumbai",
    desc: "Kanvtech Solutions is a Mumbai-based company providing HR, payroll, Tally, cloud and custom software - one trusted partner for your business systems.",
    body: aboutBody,
  },
  {
    slug: "solutions-and-services",
    title: "Our Solutions & Services | Kanvtech Solutions, Mumbai",
    desc: "Spine HR & Payroll, Tally, cloud servers and custom software - Kanvtech is your one partner for complete business solutions in Mumbai. Explore our solutions.",
    body: hubBody,
  },
  {
    slug: "contact-us",
    title: "Contact Kanvtech Solutions - Dahisar East, Mumbai",
    desc: "Get in touch with Kanvtech Solutions for Tally, Spine HR & Payroll, cloud and software solutions. Call +91 70459 98877 or send an enquiry.",
    body: contactBody,
    schema: contactSchema,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy | Kanvtech Solutions",
    desc: "How Kanvtech Solutions collects, uses and protects your information when you use our website or get in touch with us.",
    body: legalBody("Privacy Policy", "At Kanvtech Solutions Private Limited, we respect your privacy and take the handling of your information seriously. This policy explains what we collect when you use our website or get in touch with us, why we collect it, and how we keep it safe. By using this site or sharing your details with us, you agree to what's described here.", privacySections),
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions | Kanvtech Solutions",
    desc: "The rules for using the Kanvtech Solutions website and for engaging us for our products and services.",
    body: legalBody("Terms & Conditions", "Welcome to the website of Kanvtech Solutions Private Limited. These terms explain the rules for using our website and for engaging us for our products and services. By browsing this site or reaching out to us through it, you agree to the terms below. In these terms, \"we\", \"us\", \"our\" and \"Kanvtech\" refer to Kanvtech Solutions Private Limited; \"you\" and \"your\" refer to anyone visiting the website or enquiring about our offerings.", termsSections),
  },
  {
    slug: "disclaimer",
    title: "Disclaimer | Kanvtech Solutions",
    desc: "Important information about the content published on the Kanvtech Solutions website.",
    body: legalBody("Disclaimer", "The information on this website is published by Kanvtech Solutions Private Limited for general information about our products, services and solutions. By using this site, you accept the terms set out below. If you do not agree with any part of this disclaimer, we'd ask you not to continue using the website.", disclaimerSections),
  },
  ...SOLUTIONS.map((s) => ({
    slug: s.slug,
    title: s.title,
    desc: s.desc,
    body: solutionBody(s),
    schema: solutionSchema(s),
  })),
];

let count = 0;
for (const p of PAGES) {
  const html = page(p, p.body);
  fs.writeFileSync(path.join(ROOT, `${p.slug}.html`), html, "utf8");
  count++;
}

/* sitemap.xml + robots.txt */
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${SITE.url}/${p.slug === "index" ? "" : p.slug + ".html"}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`, "utf8");

console.log(`Generated ${count} pages + sitemap.xml + robots.txt`);
