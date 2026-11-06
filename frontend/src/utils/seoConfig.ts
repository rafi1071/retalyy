export interface RouteSeoData {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  breadcrumbName: string;
  noindex?: boolean;
}

export const BASE_URL = 'https://retalyy.com';

export const SEO_ROUTES: Record<string, RouteSeoData> = {
  home: {
    path: '/',
    title: 'Retalyy | Autonomous AI Accounting & Monthly Close Platform',
    description: 'Retalyy is an autonomous monthly close platform for accounting firms and businesses. Eliminate manual reconciliation with verifiable GAAP double-entry.',
    ogTitle: 'Retalyy | Autonomous AI Accounting & Monthly Close Platform',
    ogDescription: 'Autonomous monthly close software that classifies transactions, enforces GAAP accounting policies, and reconciles general ledgers.',
    breadcrumbName: 'Home',
  },
  firms: {
    path: '/firms',
    title: 'Retalyy for Accounting Firms | Autonomous CPA Monthly Close',
    description: 'Scale your CPA practice without headcount. Retalyy automates transaction classification, review queues, and workpaper preparation with 99.4% accuracy.',
    ogTitle: 'Retalyy for Accounting Firms | Autonomous CPA Monthly Close',
    ogDescription: 'Scale your CPA practice without headcount. Autonomous transaction classification, review queues, and workpaper preparation.',
    breadcrumbName: 'For Accounting Firms',
  },
  trades: {
    path: '/trades',
    title: 'Retalyy for Trades & Small Business | Automated Bookkeeping',
    description: 'Automated bookkeeping built for contractors, trades, and service businesses. Turn job receipts, invoices, and bank feeds into reconciled books.',
    ogTitle: 'Retalyy for Trades & Small Business | Automated Bookkeeping',
    ogDescription: 'Automated bookkeeping built for contractors, trades, and service businesses. Turn job receipts and invoices into audit-ready books.',
    breadcrumbName: 'For Trades & Contractors',
  },
  solutions: {
    path: '/solutions',
    title: 'Retalyy Solutions | Automated General Ledger & Close Engine',
    description: 'Explore Retalyy modules for document intake, AI transaction classification, continuous reconciliation, and autonomous month-end financial closing.',
    ogTitle: 'Retalyy Solutions | Automated General Ledger & Close Engine',
    ogDescription: 'Explore Retalyy modules for document intake, AI transaction classification, continuous reconciliation, and autonomous month-end closing.',
    breadcrumbName: 'Solutions',
  },
  calculator: {
    path: '/calculator',
    title: 'CPA & Bookkeeping ROI Calculator | Retalyy Financial Tools',
    description: 'Calculate firm billable hour recovery, tax savings, and monthly close time reduction when switching from manual bookkeeping to autonomous workflows.',
    ogTitle: 'CPA & Bookkeeping ROI Calculator | Retalyy Financial Tools',
    ogDescription: 'Calculate firm billable hour recovery, tax savings, and monthly close time reduction with autonomous accounting.',
    breadcrumbName: 'ROI Calculator',
  },
  mission: {
    path: '/mission',
    title: 'Our Mission | Autonomous Accounting Built for CPAs | Retalyy',
    description: 'Read the Retalyy manifesto on why modern accounting software failed CPAs and how deterministic AI restores integrity, speed, and precision to the ledger.',
    ogTitle: 'Our Mission | Autonomous Accounting Built for CPAs | Retalyy',
    ogDescription: 'Read the Retalyy manifesto on how deterministic AI restores integrity, speed, and precision to the general ledger.',
    breadcrumbName: 'Our Mission',
  },
  findings: {
    path: '/findings',
    title: 'Retalyy Research | AI Accounting Benchmarks & GAAP Audit',
    description: 'Empirical accuracy benchmarks on 1,000+ real-world commercial transactions, OCR extraction fidelity, and GAAP tax compliance validation results.',
    ogTitle: 'Retalyy Research | AI Accounting Benchmarks & GAAP Audit',
    ogDescription: 'Empirical accuracy benchmarks on 1,000+ real-world commercial transactions and GAAP tax compliance validation results.',
    breadcrumbName: 'Research & Benchmarks',
  },
  education: {
    path: '/education',
    title: 'GAAP Accounting & Automation Knowledge Base | Retalyy',
    description: 'Learn modern double-entry standards, capitalization thresholds under ASC 360, prepaid amortization under ASC 340, and AI auditing best practices.',
    ogTitle: 'GAAP Accounting & Automation Knowledge Base | Retalyy',
    ogDescription: 'Learn modern double-entry standards, capitalization thresholds under ASC 360, prepaid amortization, and AI auditing.',
    breadcrumbName: 'Knowledge Base',
  },
  contact: {
    path: '/contact',
    title: 'Contact Retalyy | Schedule a Demo or Enterprise Consultation',
    description: 'Get in touch with Retalyy product specialists and accounting engineers. Schedule a technical architecture walk-through or request enterprise onboarding.',
    ogTitle: 'Contact Retalyy | Schedule a Demo or Enterprise Consultation',
    ogDescription: 'Get in touch with Retalyy product specialists and accounting engineers. Schedule a technical architecture walk-through.',
    breadcrumbName: 'Contact Us',
  },
  legal: {
    path: '/legal',
    title: 'Security, Compliance & Privacy Policy | Retalyy Trust Center',
    description: 'Review Retalyy SOC2 controls, data encryption protocols, client confidentiality standards, terms of service, and GAAP deterministic compliance model.',
    ogTitle: 'Security, Compliance & Privacy Policy | Retalyy Trust Center',
    ogDescription: 'Review Retalyy SOC2 controls, data encryption protocols, client confidentiality standards, and compliance terms.',
    breadcrumbName: 'Security & Legal',
  },
  portal: {
    path: '/portal',
    title: 'Client & Firm Portal Login | Secure Access | Retalyy',
    description: 'Secure access gateway for accounting firm staff and business clients to review closing pipelines, upload documents, and approve transactions.',
    ogTitle: 'Client & Firm Portal Login | Secure Access | Retalyy',
    ogDescription: 'Secure access gateway for accounting firm staff and business clients to review closing pipelines and approve transactions.',
    breadcrumbName: 'Client Portal',
  },
  404: {
    path: '/404',
    title: '404 - Page Not Found | Retalyy Autonomous Accounting',
    description: 'The requested page could not be found. Return to the Retalyy homepage to explore our autonomous monthly close platform for accounting firms.',
    ogTitle: '404 - Page Not Found | Retalyy',
    ogDescription: 'The requested page could not be found.',
    breadcrumbName: 'Page Not Found',
    noindex: true,
  },
};

export function updatePageSeo(tabKey: string) {
  if (typeof document === 'undefined') return;

  const data = SEO_ROUTES[tabKey] || SEO_ROUTES.home;

  // Title
  document.title = data.title;

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', data.description);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  const cleanUrl = data.path === '/' ? BASE_URL : `${BASE_URL}${data.path}`;
  canonical.setAttribute('href', cleanUrl);

  // Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', data.ogTitle);

  // Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', data.ogDescription);

  // Open Graph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', cleanUrl);

  // Twitter Title
  let twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', data.ogTitle);

  // Twitter Description
  let twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', data.ogDescription);

  // Robots (for 404 or index)
  let robots = document.querySelector('meta[name="robots"]');
  if (data.noindex) {
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
  } else if (robots) {
    robots.setAttribute('content', 'index, follow');
  }
}

