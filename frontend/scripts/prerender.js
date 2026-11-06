import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const BASE_URL = 'https://retalyy.com';

const ROUTES = [
  {
    path: '/',
    dir: '',
    title: 'Retalyy | Autonomous AI Accounting & Monthly Close Platform',
    description: 'Retalyy is an autonomous monthly close platform for accounting firms and businesses. Eliminate manual reconciliation with verifiable GAAP double-entry.',
    ogTitle: 'Retalyy | Autonomous AI Accounting & Monthly Close Platform',
    ogDescription: 'Autonomous monthly close software that classifies transactions, enforces GAAP accounting policies, and reconciles general ledgers.',
    h1: 'The Monthly Close, on Autopilot',
    lead: 'Retalyy reads every document, codes every transaction, and reconciles every account. Your team reviews the 5% that needs a human.',
    bullets: [
      'Autonomous transaction classification with 99.4% OCR precision',
      'Continuous double-entry balance invariant enforcement',
      'ASC 340-20 prepaid expense and ASC 360 fixed asset capitalization rules',
      'Audit-ready review queues and CPA-supervised approvals'
    ]
  },
  {
    path: '/firms',
    dir: 'firms',
    title: 'Retalyy for Accounting Firms | Autonomous CPA Monthly Close',
    description: 'Scale your CPA practice without headcount. Retalyy automates transaction classification, review queues, and workpaper preparation with 99.4% accuracy.',
    ogTitle: 'Retalyy for Accounting Firms | Autonomous CPA Monthly Close',
    ogDescription: 'Scale your CPA practice without headcount. Autonomous transaction classification, review queues, and workpaper preparation.',
    breadcrumb: 'For Accounting Firms',
    h1: 'Autonomous Monthly Close for Accounting Firms & CPAs',
    lead: 'Scale client capacity without adding overhead. Retalyy handles first-pass document intake, transaction classification, and reconciliation for your firm.',
    bullets: [
      'Multi-client practice dashboard with entity-level progress tracking',
      'Deterministic policy enforcement matching firm-specific Chart of Accounts',
      'Client document intake portal with automated OCR receipt extraction',
      'Export audit-ready general journal workpapers in one click'
    ]
  },
  {
    path: '/trades',
    dir: 'trades',
    title: 'Retalyy for Trades & Small Business | Automated Bookkeeping',
    description: 'Automated bookkeeping built for contractors, trades, and service businesses. Turn job receipts, invoices, and bank feeds into reconciled books.',
    ogTitle: 'Retalyy for Trades & Small Business | Automated Bookkeeping',
    ogDescription: 'Automated bookkeeping built for contractors, trades, and service businesses. Turn job receipts and invoices into audit-ready books.',
    breadcrumb: 'For Trades & Contractors',
    h1: 'Autonomous Bookkeeping for Trades and Growing Businesses',
    lead: 'Stop spending weekends matching supply receipts and sorting job costs. Retalyy turns raw bank feeds and material invoices into clean, audit-ready books.',
    bullets: [
      'Automated supply house & Home Depot receipt line-item extraction',
      'Section 179 equipment vs de minimis safe harbor expense categorization',
      '1099 subcontractor payment accumulation and W-9 tracking',
      'Direct integration with operating bank feeds and credit cards'
    ]
  },
  {
    path: '/solutions',
    dir: 'solutions',
    title: 'Retalyy Solutions | Automated General Ledger & Close Engine',
    description: 'Explore Retalyy modules for document intake, AI transaction classification, continuous reconciliation, and autonomous month-end financial closing.',
    ogTitle: 'Retalyy Solutions | Automated General Ledger & Close Engine',
    ogDescription: 'Explore Retalyy modules for document intake, AI transaction classification, continuous reconciliation, and autonomous month-end closing.',
    breadcrumb: 'Solutions',
    h1: 'The Autonomous Ledgerline Platform Architecture',
    lead: 'Modular financial operations: document intake pipeline, AI transaction reasoner, continuous validation engine, and unified general ledger.',
    bullets: [
      'Document Intake Engine: High-precision OCR extraction for invoices and receipts',
      'AI Transaction Reasoner: Context-aware economic classification under US GAAP',
      'Deterministic Validation Engine: 7-step mathematical and policy invariants',
      'Ledgerline Core: Complete double-entry general journal and trial balance'
    ]
  },
  {
    path: '/calculator',
    dir: 'calculator',
    title: 'CPA & Bookkeeping ROI Calculator | Retalyy Financial Tools',
    description: 'Calculate firm billable hour recovery, tax savings, and monthly close time reduction when switching from manual bookkeeping to autonomous workflows.',
    ogTitle: 'CPA & Bookkeeping ROI Calculator | Retalyy Financial Tools',
    ogDescription: 'Calculate firm billable hour recovery, tax savings, and monthly close time reduction with autonomous accounting.',
    breadcrumb: 'ROI Calculator',
    h1: 'Accounting Automation ROI & Tax Optimization Calculator',
    lead: 'Quantify recovered partner hours, tax strategy deductions, and practice capacity improvements with Retalyy.',
    bullets: [
      'Estimate monthly close labor hour reduction across your client portfolio',
      'Model S-Corp reasonable salary vs dividend distributions',
      'Calculate recovered owner time value and billable capacity expansion',
      'Save custom operational profiles to the encrypted firm vault'
    ]
  },
  {
    path: '/mission',
    dir: 'mission',
    title: 'Our Mission | Autonomous Accounting Built for CPAs | Retalyy',
    description: 'Read the Retalyy manifesto on why modern accounting software failed CPAs and how deterministic AI restores integrity, speed, and precision to the ledger.',
    ogTitle: 'Our Mission | Autonomous Accounting Built for CPAs | Retalyy',
    ogDescription: 'Read the Retalyy manifesto on how deterministic AI restores integrity, speed, and precision to the general ledger.',
    breadcrumb: 'Our Mission',
    h1: 'Restoring Integrity and Speed to the General Ledger',
    lead: 'Accounting software stopped innovating when cloud ledgers launched. Retalyy is built to make autonomous, mathematically verified closing a reality.',
    bullets: [
      'Code as the arbiter of truth: LLMs propose, deterministic code validates',
      'Preserve the sanctity of double-entry accounting invariants',
      'Empower CPAs to focus on strategic advisory rather than clerical matching',
      'Designed for extreme reliability with zero edge-runtime cold starts'
    ]
  },
  {
    path: '/findings',
    dir: 'findings',
    title: 'Retalyy Research | AI Accounting Benchmarks & GAAP Audit',
    description: 'Empirical accuracy benchmarks on 1,000+ real-world commercial transactions, OCR extraction fidelity, and GAAP tax compliance validation results.',
    ogTitle: 'Retalyy Research | AI Accounting Benchmarks & GAAP Audit',
    ogDescription: 'Empirical accuracy benchmarks on 1,000+ real-world commercial transactions and GAAP tax compliance validation results.',
    breadcrumb: 'Research & Benchmarks',
    h1: 'Autonomous Accounting Benchmark Findings & Empirical Audit',
    lead: 'Rigorous benchmark evaluations testing OCR extraction accuracy, Chart of Accounts validity, double-entry balance, and statutory tax calculations.',
    bullets: [
      '100% double-entry balance invariant enforcement across all tested batches',
      '99.4% OCR data extraction accuracy on unstructured invoices and receipts',
      '98.6% automatic policy adherence under ASC 340 and ASC 360 standards',
      '100% duplicate transaction block and anomaly detection'
    ]
  },
  {
    path: '/education',
    dir: 'education',
    title: 'GAAP Accounting & Automation Knowledge Base | Retalyy',
    description: 'Learn modern double-entry standards, capitalization thresholds under ASC 360, prepaid amortization under ASC 340, and AI auditing best practices.',
    ogTitle: 'GAAP Accounting & Automation Knowledge Base | Retalyy',
    ogDescription: 'Learn modern double-entry standards, capitalization thresholds under ASC 360, prepaid amortization, and AI auditing.',
    breadcrumb: 'Knowledge Base',
    h1: 'GAAP Accounting Standards & Automation Knowledge Base',
    lead: 'Educational guides, tax code citations, and accounting standards for modern accounting practitioners and automated finance teams.',
    bullets: [
      'ASC 340-20 Capitalized Contract Costs: Thresholds & Amortization Schedules',
      'ASC 360 Property, Plant and Equipment: De Minimis Safe Harbor Compliance',
      'IRC § 274(n) Meals Deductibility Rules & Documentation Requirements',
      'Double-entry validation algorithms for autonomous accounting software'
    ]
  },
  {
    path: '/contact',
    dir: 'contact',
    title: 'Contact Retalyy | Schedule a Demo or Enterprise Consultation',
    description: 'Get in touch with Retalyy product specialists and accounting engineers. Schedule a technical architecture walk-through or request enterprise onboarding.',
    ogTitle: 'Contact Retalyy | Schedule a Demo or Enterprise Consultation',
    ogDescription: 'Get in touch with Retalyy product specialists and accounting engineers. Schedule a technical architecture walk-through.',
    breadcrumb: 'Contact Us',
    h1: 'Speak with a Retalyy Accounting Engineer',
    lead: 'Schedule a tailored architecture demonstration or inquire about firm onboarding and early pilot access.',
    bullets: [
      'Direct consultation with accounting technology specialists',
      'Custom Chart of Accounts mapping review for your practice',
      'Security and SOC2 compliance walk-through',
      'Email support: concierge@retalyy.com'
    ]
  },
  {
    path: '/legal',
    dir: 'legal',
    title: 'Security, Compliance & Privacy Policy | Retalyy Trust Center',
    description: 'Review Retalyy SOC2 controls, data encryption protocols, client confidentiality standards, terms of service, and GAAP deterministic compliance model.',
    ogTitle: 'Security, Compliance & Privacy Policy | Retalyy Trust Center',
    ogDescription: 'Review Retalyy SOC2 controls, data encryption protocols, client confidentiality standards, and compliance terms.',
    breadcrumb: 'Security & Legal',
    h1: 'Security Architecture, Compliance & Legal Policies',
    lead: 'Comprehensive technical overview of Retalyy security posture, data encryption standards, and terms of service.',
    bullets: [
      'AES-256 encryption at rest and TLS 1.3 transit encryption',
      'Role-based access control (RBAC) and client-level tenant isolation',
      'SOC2 Type II aligned operational controls and audit logging',
      'Full compliance with GAAP record retention and IRS privacy rules'
    ]
  },
  {
    path: '/portal',
    dir: 'portal',
    title: 'Client & Firm Portal Login | Secure Access | Retalyy',
    description: 'Secure access gateway for accounting firm staff and business clients to review closing pipelines, upload documents, and approve transactions.',
    ogTitle: 'Client & Firm Portal Login | Secure Access | Retalyy',
    ogDescription: 'Secure access gateway for accounting firm staff and business clients to review closing pipelines and approve transactions.',
    breadcrumb: 'Client Portal',
    h1: 'Retalyy Secure Client & Firm Gateway',
    lead: 'Authenticate to access your firm workspace, review closing queues, or upload monthly financial documents.',
    bullets: [
      'Firm CPA persona authentication with practice management controls',
      'Business owner persona authentication with receipt and expense inbox',
      'Multi-factor authentication (MFA) supported session management',
      'Real-time closing pipeline visibility'
    ]
  },
  {
    path: '/404',
    dir: '404',
    title: '404 - Page Not Found | Retalyy Autonomous Accounting',
    description: 'The requested page could not be found. Return to the Retalyy homepage to explore our autonomous monthly close platform for accounting firms.',
    ogTitle: '404 - Page Not Found | Retalyy',
    ogDescription: 'The requested page could not be found.',
    breadcrumb: 'Page Not Found',
    noindex: true,
    h1: 'Page Not Found (404)',
    lead: 'The general ledger entry or URL you requested does not exist or may have been relocated.',
    bullets: [
      'Visit the Retalyy Homepage for platform overview',
      'Explore Retalyy for Accounting Firms',
      'Explore Retalyy for Trades and Contractors',
      'Review our Solutions and Architecture'
    ]
  }
];

function buildPrerenderContent(route) {
  return `
    <div class="prerender-shell" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0C2B1C; background: #FAFBF9; min-height: 100vh;">
      <header style="border-bottom: 1px solid #E4E7E1; padding: 16px 24px; background: rgba(251,251,249,0.9); position: sticky; top: 0; z-index: 50;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
          <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0C2B1C; font-weight: 800; font-size: 20px;">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-label="Retalyy"><rect width="48" height="48" rx="12" fill="#0C2B1C"/><path d="M14 15L23 31L20 37L9 15H14Z" fill="#FFFFFF"/><path d="M31 7.5H39L32 20H24L31 7.5Z" fill="#46D279"/><path d="M22.5 22H30.5L17 44H11.5L22.5 22Z" fill="#FFFFFF"/></svg>
            Retalyy
          </a>
          <nav style="display: flex; gap: 20px; font-size: 14px; font-weight: 500;">
            <a href="/" style="color: #0C2B1C; text-decoration: none;">Platform</a>
            <a href="/solutions" style="color: #0C2B1C; text-decoration: none;">Solutions</a>
            <a href="/firms" style="color: #0C2B1C; text-decoration: none;">For Firms</a>
            <a href="/trades" style="color: #0C2B1C; text-decoration: none;">For Trades</a>
            <a href="/calculator" style="color: #0C2B1C; text-decoration: none;">Calculator</a>
            <a href="/findings" style="color: #0C2B1C; text-decoration: none;">Research</a>
            <a href="/portal" style="color: #0C2B1C; text-decoration: none;">Sign In</a>
          </nav>
        </div>
      </header>
      <main style="max-width: 1000px; margin: 0 auto; padding: 64px 24px;">
        <h1 style="font-size: 42px; font-weight: 800; line-height: 1.15; color: #0C2B1C; margin-bottom: 20px;">${route.h1}</h1>
        <p style="font-size: 20px; line-height: 1.6; color: #465E51; margin-bottom: 36px; max-width: 800px;">${route.lead}</p>
        <div style="background: #FFFFFF; border: 1px solid #E4E7E1; border-radius: 16px; padding: 32px; margin-bottom: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <h2 style="font-size: 20px; font-weight: 700; color: #0C2B1C; margin-bottom: 16px;">Key Capabilities & Features</h2>
          <ul style="padding-left: 20px; font-size: 16px; line-height: 1.8; color: #2F4D3C;">
            ${route.bullets.map(b => `<li style="margin-bottom: 8px;">${b}</li>`).join('')}
          </ul>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="/portal" style="background: #27B665; color: #FFFFFF; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px;">Get Started</a>
          <a href="/calculator" style="background: #FFFFFF; color: #0C2B1C; border: 1px solid #D5DDD7; padding: 14px 28px; border-radius: 12px; font-weight: 600; text-decoration: none; font-size: 15px;">Calculate ROI</a>
        </div>
      </main>
      <footer style="background: #07100C; color: #FFFFFF; padding: 48px 24px; margin-top: 80px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 24px; font-size: 13px; color: rgba(255,255,255,0.6);">
          <div>© ${new Date().getFullYear()} Retalyy Inc. Autonomous AI Monthly Close Platform. All rights reserved.</div>
          <div style="display: flex; gap: 20px;">
            <a href="/legal" style="color: rgba(255,255,255,0.7); text-decoration: none;">Security & Legal</a>
            <a href="/contact" style="color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>
            <a href="/education" style="color: rgba(255,255,255,0.7); text-decoration: none;">Knowledge Base</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}

function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');

  console.log(`Prerendering ${ROUTES.length} routes to static HTML...`);

  for (const route of ROUTES) {
    let html = baseHtml;

    // 1. Replace Title (< 60 chars)
    html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);
    html = html.replace(/<meta name="title" content=".*?" \/>/i, `<meta name="title" content="${route.title}" />`);

    // 2. Replace Meta Description (70 - 160 chars)
    html = html.replace(
      /<meta name="description" content=".*?" \/>/i,
      `<meta name="description" content="${route.description}" />`
    );

    // 3. Set Canonical URL (strictly no trailing slash)
    const canonicalUrl = route.path === '/' ? BASE_URL : `${BASE_URL}${route.path}`;
    html = html.replace(
      /<link rel="canonical" href=".*?" \/>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // 4. Open Graph Tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${route.ogTitle}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${route.ogDescription}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

    // 5. Twitter Card Tags
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.ogTitle}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.ogDescription}" />`);
    html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

    // 6. Robots tag (noindex for 404)
    if (route.noindex) {
      html = html.replace(/<meta name="robots" content=".*?" \/>/i, `<meta name="robots" content="noindex, nofollow" />`);
    } else {
      html = html.replace(/<meta name="robots" content=".*?" \/>/i, `<meta name="robots" content="index, follow" />`);
    }

    // 7. Inner pages BreadcrumbList JSON-LD
    if (route.breadcrumb) {
      const breadcrumbJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': BASE_URL
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': route.breadcrumb,
            'item': canonicalUrl
          }
        ]
      };
      const breadcrumbScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(breadcrumbJson, null, 2)}\n    </script>`;
      html = html.replace('</head>', `${breadcrumbScript}\n  </head>`);
    }

    // 8. Inject prerendered content into #root while keeping the smooth preloader overlay
    const preloaderHtml = `
      <div id="retalyy-preloader" style="position:fixed;inset:0;background:#07100C;display:flex;align-items:center;justify-content:center;z-index:9999;">
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" aria-label="Retalyy" role="img">
          <rect width="48" height="48" rx="12" fill="#0C2B1C"/>
          <path d="M14 15L23 31L20 37L9 15H14Z" fill="#FFFFFF"/>
          <path d="M31 7.5H39L32 20H24L31 7.5Z" fill="#46D279"/>
          <path d="M22.5 22H30.5L17 44H11.5L22.5 22Z" fill="#FFFFFF"/>
        </svg>
      </div>`;
    const content = buildPrerenderContent(route);
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>/i,
      `<div id="root">${preloaderHtml}${content}</div>`
    );

    // Write file to output target
    if (route.path === '/') {
      fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8');
      console.log('✓ Prerendered / -> dist/index.html');
    } else if (route.path === '/404') {
      fs.writeFileSync(path.join(distDir, '404.html'), html, 'utf-8');
      console.log('✓ Prerendered /404 -> dist/404.html');
    } else {
      const targetDir = path.join(distDir, route.dir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
      // Also write clean html file for direct file serving (e.g. dist/firms.html)
      fs.writeFileSync(path.join(distDir, `${route.dir}.html`), html, 'utf-8');
      console.log(`✓ Prerendered ${route.path} -> dist/${route.dir}/index.html & dist/${route.dir}.html`);
    }
  }

  console.log('All public routes successfully prerendered to static HTML!');
}

prerender();

