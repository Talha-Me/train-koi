import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function markdownToHtml(md) {
  if (!md) return '';
  let html = md
    // Escape basic html chars
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 19px; color: #006a4e; margin: 24px 0 10px; font-weight: 700;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 22px; color: #006a4e; margin: 28px 0 12px; font-weight: 800; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 26px; color: #111827; margin: 24px 0 14px; font-weight: 800;">$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 28px 0;" />')
    // Lists
    .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>')
    .replace(/^\s*\*\s+(.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>');

  // Wrap consecutive <li> into <ul>
  html = html.replace(/((<li[\s\S]*?<\/li>\s*)+)/gim, '<ul style="padding-left: 24px; margin: 14px 0; line-height: 1.75;">$1</ul>');

  // Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) {
        continue; // table separator
      }
      const cells = line.slice(1, -1).split('|').map(c => c.trim());
      if (!inTable) {
        inTable = true;
        tableHtml = '<div style="overflow-x: auto; margin: 20px 0;"><table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">';
        tableHtml += '<thead style="background: #006a4e; color: #ffffff;"><tr>';
        cells.forEach(c => { tableHtml += `<th style="padding: 10px 14px; border: 1px solid #005a43;">${c}</th>`; });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr style="border-bottom: 1px solid #e5e7eb;">';
        cells.forEach(c => { tableHtml += `<td style="padding: 10px 14px; border: 1px solid #e5e7eb;">${c}</td>`; });
        tableHtml += '</tr>';
      }
    } else {
      if (inTable) {
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
        inTable = false;
        tableHtml = '';
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table></div>';
    processedLines.push(tableHtml);
  }

  // Wrap loose paragraphs
  html = processedLines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h1') || trimmed.startsWith('<h2') || trimmed.startsWith('<h3') ||
        trimmed.startsWith('<ul') || trimmed.startsWith('<div') || trimmed.startsWith('<hr') ||
        trimmed.startsWith('<table')) {
      return line;
    }
    return `<p style="margin: 14px 0; line-height: 1.8; color: #374151; font-size: 15.5px;">${line}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function createPageHtml({ template, title, description, canonicalUrl, ogType = 'website', bodyHtml, schemaJson }) {
  let html = template;

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Canonical
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  if (!html.includes(`<link rel="canonical"`)) {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // Meta Title
  html = html.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escapeHtml(title)}" />`);

  // Meta Description
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);

  // Open Graph
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);

  // Twitter
  html = html.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

  // Schema Injection
  if (schemaJson) {
    const schemaTag = `\n    <script type="application/ld+json">\n    ${JSON.stringify(schemaJson, null, 2)}\n    </script>\n`;
    html = html.replace('</head>', `${schemaTag}</head>`);
  }

  // Replace content inside <div id="root">...</div>
  const rootRegex = /<div\s+id="root">[\s\S]*?<\/div>\s*(?=<noscript|<script)/i;
  const newRoot = `<div id="root">\n${bodyHtml}\n    </div>\n    `;
  if (rootRegex.test(html)) {
    html = html.replace(rootRegex, newRoot);
  } else {
    console.warn('⚠️ rootRegex did not match!');
  }

  return html;
}

function writeHtmlFile(subPath, content) {
  const targetDir = path.resolve(distDir, subPath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.resolve(targetDir, 'index.html'), content, 'utf-8');
}

async function main() {
  console.log('🚀 Starting Pre-rendering for TrainKoi Static Pages & Blogs...');

  const indexPath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(indexPath, 'utf-8');

  // Shared Header & Footer for Pre-rendered snapshots
  const sharedNav = `
    <header style="background: #006a4e; color: #ffffff; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="max-width: 1040px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <a href="/" style="display: flex; align-items: center; gap: 10px; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 20px;">
          🚆 ট্রেনকই (TrainKoi)
        </a>
        <nav style="display: flex; align-items: center; gap: 16px; font-size: 14px; font-weight: 600; flex-wrap: wrap;">
          <a href="/" style="color: #ffffff; text-decoration: none;">হোম</a>
          <a href="/schedule" style="color: #ffffff; text-decoration: none;">সময়সূচী</a>
          <a href="/live-trains" style="color: #ffffff; text-decoration: none;">লাইভ ট্রেন</a>
          <a href="/blogs" style="color: #ffffff; text-decoration: none;">ভ্রমণ ব্লগ</a>
          <a href="/rail-news" style="color: #ffffff; text-decoration: none;">রেল সংবাদ</a>
          <a href="/metro-rail" style="color: #ffffff; text-decoration: none;">মেট্রোরেল</a>
          <a href="/about" style="color: #ffffff; text-decoration: none;">আমাদের সম্পর্কে</a>
        </nav>
      </div>
    </header>
  `;

  const sharedFooter = `
    <footer style="background: #111827; color: #9ca3af; padding: 40px 20px 25px; margin-top: 60px; font-size: 13.5px; line-height: 1.8;">
      <div style="max-width: 1040px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; margin-bottom: 30px;">
          <div>
            <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 14px; font-weight: 700;">ট্রেন সেবা ও ট্র্যাকিং</h4>
            <p style="margin: 0 0 8px;"><a href="/" style="color: #9ca3af; text-decoration: none;">হোম পেজ</a></p>
            <p style="margin: 0 0 8px;"><a href="/schedule" style="color: #9ca3af; text-decoration: none;">ট্রেন সময়সূচী ও রুট</a></p>
            <p style="margin: 0 0 8px;"><a href="/live-trains" style="color: #9ca3af; text-decoration: none;">লাইভ রানিং ট্রেন</a></p>
            <p style="margin: 0 0 8px;"><a href="/metro-rail" style="color: #9ca3af; text-decoration: none;">ঢাকা মেট্রোরেল গাইড</a></p>
            <p style="margin: 0;"><a href="/travel-laws" style="color: #9ca3af; text-decoration: none;">রেল ভ্রমণ আইন ও বিধিমালা</a></p>
          </div>
          <div>
            <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 14px; font-weight: 700;">ভ্রমণ গাইড ও সংবাদ</h4>
            <p style="margin: 0 0 8px;"><a href="/blogs" style="color: #9ca3af; text-decoration: none;">ট্রেন ভ্রমণ ব্লগ ও গাইড</a></p>
            <p style="margin: 0 0 8px;"><a href="/rail-news" style="color: #9ca3af; text-decoration: none;">রেল বার্তা ও নোটিশ</a></p>
            <p style="margin: 0 0 8px;"><a href="/faq" style="color: #9ca3af; text-decoration: none;">সাধারণ জিজ্ঞাসা (FAQ)</a></p>
            <p style="margin: 0;"><a href="https://eticket.railway.gov.bd/" target="_blank" rel="noopener noreferrer" style="color: #9ca3af; text-decoration: none;">রেলওয়ে টিকিট পোর্টাল ↗</a></p>
          </div>
          <div>
            <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 14px; font-weight: 700;">পলিসি ও যোগাযোগ</h4>
            <p style="margin: 0 0 8px;"><a href="/about" style="color: #9ca3af; text-decoration: none;">আমাদের সম্পর্কে (About Us)</a></p>
            <p style="margin: 0 0 8px;"><a href="/contact" style="color: #9ca3af; text-decoration: none;">যোগাযোগ করুন (Contact)</a></p>
            <p style="margin: 0 0 8px;"><a href="/privacy" style="color: #9ca3af; text-decoration: none;">গোপনীয়তা নীতি (Privacy Policy)</a></p>
            <p style="margin: 0 0 8px;"><a href="/terms" style="color: #9ca3af; text-decoration: none;">ব্যবহারের শর্তাবলী (Terms of Service)</a></p>
            <p style="margin: 0;"><a href="/disclaimer" style="color: #9ca3af; text-decoration: none;">আইনগত দায়মুক্তি (Disclaimer)</a></p>
          </div>
        </div>

        <div style="border-top: 1px solid #374151; padding-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">
          <p style="margin: 0 0 6px;">
            <strong>দায়মুক্তি ঘোষণা (Disclaimer):</strong> ট্রেনকই (TrainKoi) একটি স্বাধীন, কমিউনিটি-চালিত তথ্য ও ট্র্যাকিং প্ল্যাটফর্ম। এটি বাংলাদেশ রেলওয়ে (BR) বা কোনো সরকারি সংস্থার অফিশিয়াল অঙ্গপ্রতিষ্ঠান নয়।
          </p>
          <p style="margin: 0;">© ২০২৬ ট্রেনকই (TrainKoi). সর্বস্বত্ব সংরক্ষিত • Developed by <a href="https://talhabyteit.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: #4ade80; text-decoration: none;">Talhabyte IT</a></p>
        </div>
      </div>
    </footer>
  `;

  // 1. PRIVACY POLICY
  console.log('📄 Pre-rendering /privacy...');
  const privacyBody = `
    ${sharedNav}
    <main style="max-width: 920px; margin: 30px auto; padding: 0 16px; color: #1f2937; line-height: 1.8;">
      <div style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px;">
          ✓ গুগল অ্যাডসেন্স ও ডাটা সুরক্ষা স্ট্যান্ডার্ড মেনে তৈরি
        </div>
        <h1 style="font-size: 28px; color: #006a4e; margin: 0 0 10px; font-weight: 800;">ট্রেনকই (TrainKoi) গোপনীয়তা নীতি</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 26px;">সর্বশেষ পরিমার্জন ও কার্যকারিতা: ২০২৬ সংস্করণ • আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা আমাদের দায়িত্ব</p>

        <section style="margin-bottom: 28px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">ভূমিকা ও অঙ্গীকার</h2>
          <p>
            <strong>TrainKoi.com</strong>-এ আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করা আমাদের সর্বোচ্চ অগ্রাধিকার। এই নীতিমালায় সুস্পষ্টভাবে ব্যাখ্যা করা হয়েছে যে, বাংলাদেশ রেলওয়ের লাইভ ট্রেন ট্র্যাকিং, ট্রেনের শিডিউল অনুসন্ধান এবং প্ল্যাটফর্ম সেবা ব্যবহারের সময় আমরা কীভাবে আপনার ডেটা সংগ্রহ, ব্যবহার ও নিরাপদ রাখি এবং গুগলের মতো থার্ড-পার্টি বিজ্ঞাপন পার্টনারদের সাথে কী কী শর্তে কাজ করি।
          </p>
        </section>

        <section style="margin-bottom: 28px; background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #006a4e;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin: 0 0 12px;">১. লোকেশন ডেটা ও ক্রাউডসোর্সড ট্র্যাকিং (Location Data)</h2>
          <p style="margin-bottom: 10px;">
            আমাদের লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্মটি কমিউনিটি ও ক্রাউডসোর্স ভিত্তিক। আপনি যখন স্বেচ্ছায় ট্রেনে বসে অবস্থান শেয়ার করতে সম্মতি দেন, তখন আপনার ডিভাইসের জিপিএস কো-অর্ডিনেটস (Latitude & Longitude) সাময়িকভাবে প্রসেস করা হয় কেবল ট্রেনের বর্তমান গতি ও স্টেশন দূরত্ব নির্ধারণের জন্য।
          </p>
          <p style="margin: 0;">
            আমরা আপনার নাম, ফোন নম্বর, জাতীয় পরিচয়পত্র বা কোনো স্থায়ী ব্যক্তিগত প্রোফাইলের সাথে এই অবস্থান যুক্ত করি না এবং আপনার লোকেশন হিস্ট্রি কারও কাছে বাণিজ্যিকভাবে বিক্রি বা বিতরণ করি না।
          </p>
        </section>

        <section style="margin-bottom: 28px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">২. লগ ফাইল ও সাইট অ্যানালিটিক্স (Log Files & Performance)</h2>
          <p style="margin-bottom: 10px;">
            অন্যান্য আধুনিক ওয়েবসাইটের মতো ট্রেনকই স্ট্যান্ডার্ড লগ ফাইল এবং ক্লাউড মনিটরিং ব্যবস্থা ব্যবহার করে। এর মধ্যে রয়েছে ইন্টারনেট প্রোটোকল (IP) অ্যাড্রেস, ব্রাউজারের ধরন, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), রেফারেল ও এক্সিট পেজ এবং তারিখ/সময়ের স্ট্যাম্প।
          </p>
          <p style="margin: 0;">
            এই তথ্যগুলো কোনোভাবেই আপনার ব্যক্তিগত পরিচয়ের সাথে যুক্ত নয়; এগুলো কেবল সার্ভার ট্রাফিক মনিটরিং, সাইটের স্পিড বাড়ানো, নিরাপত্তা বৃদ্ধি এবং কারিগরি বাগ ফিক্স করার কাজে ব্যবহৃত হয়।
          </p>
        </section>

        <section style="margin-bottom: 28px; background: #fefce8; padding: 22px; border-radius: 12px; border-left: 4px solid #ca8a04;">
          <h2 style="font-size: 20px; color: #854d0e; font-weight: 800; margin: 0 0 12px;">৩. গুগল অ্যাডসেন্স ও ডাবলক্লিক ডার্ট কুকিজ (Google AdSense & Cookies Policy)</h2>
          <p style="margin-bottom: 12px;">
            গুগল (Google) একজন বিশ্বস্ত থার্ড-পার্টি ভেন্ডর হিসেবে আমাদের ওয়েবসাইটে বিজ্ঞাপন প্রদর্শনের জন্য কুকিজ (Cookies) ব্যবহার করে থাকে।
          </p>
          <ul style="padding-left: 20px; margin: 0 0 14px;">
            <li style="margin-bottom: 8px;">
              গুগলের <strong>DART Cookie</strong> ব্যবহারের মাধ্যমে ব্যবহারকারী এই সাইট ও ইন্টারনেটের অন্যান্য সাইট পরিদর্শনের অতীত পছন্দের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন দেখতে পান।
            </li>
            <li style="margin-bottom: 8px;">
              থার্ড-পার্টি অ্যাড নেটওয়ার্ক বা অ্যাড সার্ভারগুলো তাদের বিজ্ঞাপনে কুকিজ, জাভাস্ক্রিপ্ট বা ওয়েব বীকন প্রযুক্তি ব্যবহার করতে পারে, যা ব্যবহারকারীর ব্রাউজারে সরাসরি পাঠানো হয়।
            </li>
            <li>
              ব্যবহারকারীরা চাইলে গুগলের নিজস্ব বিজ্ঞাপন পলিসি পাতা পরিদর্শন করে পার্সোনালাইজড কুকিজ ব্যবহার নিয়ন্ত্রণ বা বন্ধ করতে পারেন:
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style="color: #006a4e; font-weight: 700; text-decoration: underline;">Google Ads Settings ↗</a>
            </li>
          </ul>
          <p style="margin: 0; font-size: 13.5px; color: #713f12;">
            এছাড়াও আপনি বিশ্বব্যাপী ইন্ডাস্ট্রি স্ট্যান্ডার্ড <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color: #006a4e; font-weight: 700;">www.aboutads.info ↗</a> ভিজিট করে থার্ড-পার্টি অনলাইন বিজ্ঞাপনের ট্র্যাকিং অপ্ট-আউট করতে পারেন।
          </p>
        </section>

        <section style="margin-bottom: 28px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">৪. থার্ড-পার্টি ও বাহ্যিক লিংক (Third-Party Portals)</h2>
          <p>
            যাত্রীদের সুবিধার্থে আমাদের প্ল্যাটফর্মে বাংলাদেশ রেলওয়ের অফিসিয়াল টিকিট ক্রয় পোর্টাল (eticket.railway.gov.bd) বা প্রয়োজনীয় সরকারি সেবার লিংক থাকতে পারে। বাহ্যিক সাইটগুলোর নিজস্ব স্বতন্ত্র গোপনীয়তা নীতি থাকে, যার ওপর ট্রেনকই-এর কোনো প্রশাসনিক নিয়ন্ত্রণ বা দায়ভার নেই।
          </p>
        </section>

        <section style="margin-bottom: 28px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">৫. শিশু সুরক্ষা ও তথ্য নিরাপত্তা (Children's Privacy Protection)</h2>
          <p>
            ইন্টারনেট ব্যবহারে শিশুদের গোপনীয়তা ও নিরাপত্তা নিশ্চিত করা আমাদের নৈতিক দায়িত্ব। আমরা জেনেশুনে ১৩ বছরের কম বয়সী অপ্রাপ্তবয়স্কদের কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। আমাদের সিস্টেমে সমস্ত ডেটা আন্তর্জাতিক মানসম্পন্ন ক্লাউড আর্কিটেকচারে সর্বোচ্চ এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে।
          </p>
        </section>

        <section style="margin-bottom: 10px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">৬. যোগাযোগ ও মতামত (Contact Information)</h2>
          <p style="margin-bottom: 12px;">আমাদের গোপনীয়তা নীতি নিয়ে আপনার কোনো জিজ্ঞাসা, অভিযোগ বা পরামর্শ থাকলে নির্দ্বিধায় যোগাযোগ করুন:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 10px;">
            <p style="margin: 0 0 6px;"><strong>অফিসিয়াল ইমেইল:</strong> <a href="mailto:support@trainkoi.com" style="color: #006a4e; font-weight: 700;">support@trainkoi.com</a></p>
            <p style="margin: 0 0 6px;"><strong>মোবাইল / হোয়াটসঅ্যাপ:</strong> +8801516579760</p>
            <p style="margin: 0;"><strong>কারিগরি সহায়তা:</strong> Talhabyte IT, Bangladesh</p>
          </div>
        </section>
      </div>
    </main>
    ${sharedFooter}
  `;

  const privacyHtml = createPageHtml({
    template: baseTemplate,
    title: 'গোপনীয়তা নীতি (Privacy Policy) | TrainKoi',
    description: 'ট্রেনকই (TrainKoi) প্ল্যাটফর্মের গোপনীয়তা নীতি। জানুন আমরা কীভাবে ডেটা সুরক্ষা, কুকিজ এবং গুগল অ্যাডসেন্স কমপ্লায়েন্স নিশ্চিত করি।',
    canonicalUrl: 'https://www.trainkoi.com/privacy',
    bodyHtml: privacyBody
  });
  writeHtmlFile('privacy', privacyHtml);
  writeHtmlFile('privacy-policy', privacyHtml);

  // 2. TERMS OF SERVICE
  console.log('📄 Pre-rendering /terms...');
  const termsBody = `
    ${sharedNav}
    <main style="max-width: 920px; margin: 30px auto; padding: 0 16px; color: #1f2937; line-height: 1.8;">
      <div style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <h1 style="font-size: 28px; color: #006a4e; margin: 0 0 10px; font-weight: 800;">ব্যবহারের শর্তাবলী (Terms of Service)</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 26px;">সর্বশেষ পরিমার্জন: ২০২৬ সংস্করণ • ট্রেনকই প্ল্যাটফর্ম ব্যবহারের আইনি নীতিমালা</p>

        <section style="margin-bottom: 24px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">১. শর্তাবলীর স্বীকৃতি</h2>
          <p>
            ট্রেনকই (TrainKoi.com) ওয়েবসাইট বা মোবাইল অ্যাপ্লিকেশন ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী ও নীতিমালায় সম্পূর্ণ সম্মতি প্রকাশ করছেন। আপনি যদি এই শর্তাবলীতে সম্মত না হন, তবে অনুগ্রহ করে সেবাটি ব্যবহার করা থেকে বিরত থাকুন।
          </p>
        </section>

        <section style="margin-bottom: 24px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">২. সেবার প্রকৃতি ও অ-সরকারি অবস্থান</h2>
          <p>
            ট্রেনকই একটি স্বাধীন, ক্রাউডসোর্সড ও প্রযুক্তিভিত্তিক তথ্য প্ল্যাটফর্ম। এটি বাংলাদেশ রেলওয়ে (Bangladesh Railway), রেলপথ মন্ত্রণালয় কিংবা কোনো সরকারি বা স্বায়ত্তশাসিত প্রতিষ্ঠানের আনুষ্ঠানিক অংশ নয়। প্ল্যাটফর্মের সমস্ত তথ্য সাধারণ যাত্রীদের পারস্পরিক সহযোগিতা ও উন্মুক্ত সময়সূচীর পর্যালোচনার ভিত্তিতে প্রদর্শিত হয়।
          </p>
        </section>

        <section style="margin-bottom: 24px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">৩. লাইভ ডেটা ও ট্র্যাকিং নির্ভুলতা</h2>
          <p>
            লাইভ ট্রেন ট্র্যাকিং ডেটা ট্রেনের ভেতরে থাকা সহযাত্রীদের শেয়ার করা অবস্থান এবং ট্রেন চলাচলের রুটিন গতির ভিত্তিতে স্বয়ংক্রিয়ভাবে হিসাব করা হয়। রেললাইনের সিগন্যাল বিলম্ব, প্রাকৃতিক দুর্যোগ বা কারিগরি কারণে ট্রেনের সময়সূচী যেকোনো মুহূর্তে পরিবর্তিত হতে পারে। যাত্রীদেরকে গুরুত্বপূর্ণ ভ্রমণের ক্ষেত্রে স্টেশনের অফিশিয়াল ঘোষণা যাচাই করার অনুরোধ করা হচ্ছে।
          </p>
        </section>

        <section style="margin-bottom: 24px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">৪. মেধাস্বত্ব ও কপিরাইট</h2>
          <p>
            ট্রেনকই-এর সমস্ত ডিজাইন, কোড, ভ্রমণ গাইড ও বিশ্লেষণাত্মক ব্লগসমূহ ট্রেনকই ও তালহাবাইট আইটি (Talhabyte IT)-এর নিজস্ব মেধাস্বত্ব। অনুমতি ছাড়া কোনো কনটেন্ট হুবহু কপি বা অননুমোদিত বাণিজ্যিক উদ্দেশ্যে ব্যবহার আইনত নিষিদ্ধ।
          </p>
        </section>

        <section>
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">৫. যোগাযোগ ও আইনগত এখতিয়ার</h2>
          <p>ব্যবহারের শর্তাবলী সম্পর্কিত যেকোনো জিজ্ঞাসায় আমাদের সাথে যোগাযোগ করুন: <a href="mailto:support@trainkoi.com" style="color: #006a4e; font-weight: 700;">support@trainkoi.com</a></p>
        </section>
      </div>
    </main>
    ${sharedFooter}
  `;

  const termsHtml = createPageHtml({
    template: baseTemplate,
    title: 'ব্যবহারের শর্তাবলী (Terms of Service) | TrainKoi',
    description: 'ট্রেনকই (TrainKoi) ওয়েবসাইট ও ট্র্যাকিং সেবা ব্যবহারের বিস্তারিত আইনি নিয়মাবলী ও শর্তাবলী।',
    canonicalUrl: 'https://www.trainkoi.com/terms',
    bodyHtml: termsBody
  });
  writeHtmlFile('terms', termsHtml);

  // 3. ABOUT US
  console.log('📄 Pre-rendering /about...');
  const aboutBody = `
    ${sharedNav}
    <main style="max-width: 920px; margin: 30px auto; padding: 0 16px; color: #1f2937; line-height: 1.8;">
      <div style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <h1 style="font-size: 28px; color: #006a4e; margin: 0 0 10px; font-weight: 800;">আমাদের সম্পর্কে (About TrainKoi)</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 26px;">বাংলাদেশ রেলওয়ের সম্মানিত যাত্রীদের জন্য আধুনিক, নির্ভুল ও নির্ভরযোগ্য স্মার্ট ট্র্যাকিং প্ল্যাটফর্ম</p>

        <section style="margin-bottom: 26px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          <p>
            ট্রেনকই (TrainKoi)-এর মূল লক্ষ্য হলো প্রযুক্তির সর্বোচ্চ ব্যবহারের মাধ্যমে সাধারণ মানুষের ট্রেন ভ্রমণকে সহজ, চাপমুক্ত এবং আনন্দময় করে তোলা। বাংলাদেশের লক্ষ লক্ষ মানুষ প্রতিদিন ট্রেনে যাতায়াত করেন। কিন্তু ট্রেনের বিলম্ব, বর্তমান অবস্থান এবং প্ল্যাটফর্ম নম্বর জানার সুনির্দিষ্ট ও দ্রুত মাধ্যমের অভাবে যাত্রীদেরকে স্টেশনে দীর্ঘক্ষণ অনিশ্চয়তায় বসে থাকতে হতো। সেই ভোগান্তির অবসান ঘটাতেই ট্রেনকই-এর জন্ম।
          </p>
        </section>

        <section style="margin-bottom: 26px; background: #f0fdf4; padding: 22px; border-radius: 12px; border-left: 4px solid #006a4e;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin: 0 0 12px;">প্রধান সেবাসমূহ</h2>
          <ul style="padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>লাইভ জিপিএস ট্র্যাকিং:</strong> ট্রেনের রিয়েল-টাইম গতি, বর্তমান অবস্থান ও পরবর্তী স্টেশনের দূরত্ব প্রদর্শন।</li>
            <li style="margin-bottom: 8px;"><strong>গন্তব্য ওয়েক-আপ অ্যালার্ম:</strong> ঘুমিয়ে স্টেশন মিস করা ঠেকাতে পৌঁছানোর পূর্বে স্মার্ট অ্যালার্ম ও ভাইব্রেশন সতর্কতা।</li>
            <li style="margin-bottom: 8px;"><strong>বগি ও প্ল্যাটফর্ম বিন্যাস:</strong> ইঞ্জিন কোন প্রান্তে এবং আপনার বগি প্ল্যাটফর্মের কোথায় দাঁড়াবে তার নিখুঁত ডায়াগ্রাম।</li>
            <li style="margin-bottom: 8px;"><strong>সময়সূচী ও ভাড়ার তালিকা:</strong> সকল আন্তঃনগর ট্রেনের অফিশিয়াল শিডিউল, বিরতি স্টেশন ও ভাড়া।</li>
            <li><strong>ইন-ডেপথ ভ্রমণ গাইড:</strong> অভিজ্ঞ পর্যটক ও বিশ্লেষকদের তৈরি বিস্তারিত ভ্রমণ নির্দেশিকা ও রেল সংবাদ।</li>
          </ul>
        </section>

        <section style="margin-bottom: 26px;">
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">উদ্যোক্তা ও কারিগরি দল</h2>
          <p>
            ট্রেনকই প্ল্যাটফর্মটি তৈরি ও পরিচালনা করছে <strong>Talhabyte IT</strong>। আমাদের ডেডিকেটেড সফটওয়্যার টিম দিনরাত কাজ করে যাচ্ছে যাতে বাংলাদেশের রেলযাত্রীরা একটি বিশ্বমানের ডিজিটাল অভিজ্ঞতা উপভোগ করতে পারেন।
          </p>
          <div style="background: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 14px;">
            <p style="margin: 0 0 6px;"><strong>প্রধান কার্যালয়:</strong> ঢাকা, বাংলাদেশ</p>
            <p style="margin: 0 0 6px;"><strong>ইমেইল:</strong> support@trainkoi.com</p>
            <p style="margin: 0;"><strong>হটলাইন:</strong> +8801516579760</p>
          </div>
        </section>

        <section>
          <h2 style="font-size: 20px; color: #006a4e; font-weight: 700; margin-bottom: 12px;">আইনগত ঘোষণা ও দায়মুক্তি</h2>
          <p style="margin: 0; font-size: 13.5px; color: #6b7280;">
            ট্রেনকই একটি স্বাধীন কমিউনিটি-চালিত উদ্যোগ। এটি বাংলাদেশ রেলওয়ে বা কোনো সরকারি প্রতিষ্ঠানের অফিশিয়াল মুখপাত্র নয়। যাত্রীদের সহযোগিতা ও উন্মুক্ত ট্র্যাকিং ডেটার ভিত্তিতে তথ্য উপস্থাপন করা হয়।
          </p>
        </section>
      </div>
    </main>
    ${sharedFooter}
  `;

  const aboutHtml = createPageHtml({
    template: baseTemplate,
    title: 'আমাদের সম্পর্কে (About Us) | TrainKoi',
    description: 'ট্রেনকই (TrainKoi)-এর লক্ষ্য, সেবা ও দলের বিস্তারিত তথ্য। বাংলাদেশ রেলওয়ে যাত্রীদের জন্য আধুনিক লাইভ ট্র্যাকিং প্ল্যাটফর্ম।',
    canonicalUrl: 'https://www.trainkoi.com/about',
    bodyHtml: aboutBody
  });
  writeHtmlFile('about', aboutHtml);

  // 4. CONTACT US
  console.log('📄 Pre-rendering /contact...');
  const contactBody = `
    ${sharedNav}
    <main style="max-width: 920px; margin: 30px auto; padding: 0 16px; color: #1f2937; line-height: 1.8;">
      <div style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <h1 style="font-size: 28px; color: #006a4e; margin: 0 0 10px; font-weight: 800;">যোগাযোগ করুন (Contact Us)</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 26px;">ট্রেনকই সম্পর্কিত যেকোনো জিজ্ঞাসা, পরামর্শ, বাগ রিপোর্ট বা বিজ্ঞাপনের জন্য আমাদের সাথে যোগাযোগ করুন</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: #f0fdf4; padding: 22px; border-radius: 12px; border: 1px solid #bbf7d0;">
            <h3 style="color: #006a4e; margin: 0 0 8px; font-size: 18px;">সরাসরি ইমেইল</h3>
            <p style="margin: 0 0 10px; font-size: 14px; color: #4b5563;">সাধারণ জিজ্ঞাসা, রিপোর্ট ও সহায়তার জন্য:</p>
            <a href="mailto:support@trainkoi.com" style="color: #006a4e; font-weight: 700; font-size: 16px; text-decoration: underline;">support@trainkoi.com</a>
          </div>

          <div style="background: #eff6ff; padding: 22px; border-radius: 12px; border: 1px solid #bfdbfe;">
            <h3 style="color: #1d4ed8; margin: 0 0 8px; font-size: 18px;">ফোন ও হোয়াটসঅ্যাপ</h3>
            <p style="margin: 0 0 10px; font-size: 14px; color: #4b5563;">জরুরি সহায়তা ও টেকনিক্যাল সাপোর্ট:</p>
            <a href="tel:+8801516579760" style="color: #1d4ed8; font-weight: 700; font-size: 16px; text-decoration: none;">+8801516579760</a>
          </div>
        </div>

        <section style="background: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="font-size: 20px; color: #111827; font-weight: 700; margin: 0 0 14px;">অফিস ঠিকানা ও ডেভেলপমেন্ট পার্টনার</h2>
          <p style="margin: 0 0 8px;"><strong>প্রতিষ্ঠানের নাম:</strong> Talhabyte IT (ডেভেলপার ও টেকনিক্যাল অপারেটর)</p>
          <p style="margin: 0 0 8px;"><strong>অফিস:</strong> ঢাকা, বাংলাদেশ</p>
          <p style="margin: 0 0 8px;"><strong>ওয়েবসাইট:</strong> <a href="https://talhabyteit.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: #006a4e; font-weight: 700;">talhabyteit.vercel.app ↗</a></p>
          <p style="margin: 0;"><strong>কাজের সময়:</strong> শনিবার - বৃহস্পতিবার, সকাল ৯:০০ টা থেকে রাত ৮:০০ টা</p>
        </section>
      </div>
    </main>
    ${sharedFooter}
  `;

  const contactHtml = createPageHtml({
    template: baseTemplate,
    title: 'যোগাযোগ করুন (Contact Us) | TrainKoi',
    description: 'ট্রেনকই (TrainKoi) টিমের সাথে যোগাযোগের অফিসিয়াল ইমেইল, মোবাইল নম্বর ও ঠিকানা।',
    canonicalUrl: 'https://www.trainkoi.com/contact',
    bodyHtml: contactBody
  });
  writeHtmlFile('contact', contactHtml);

  // 5. DISCLAIMER
  console.log('📄 Pre-rendering /disclaimer...');
  const disclaimerBody = `
    ${sharedNav}
    <main style="max-width: 920px; margin: 30px auto; padding: 0 16px; color: #1f2937; line-height: 1.8;">
      <div style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <h1 style="font-size: 28px; color: #006a4e; margin: 0 0 10px; font-weight: 800;">আইনগত দায়মুক্তি নোটিশ (Legal Disclaimer)</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 26px;">বাংলাদেশ রেলওয়ে এবং সরকারি প্রতিষ্ঠান সংক্রান্ত দায়মুক্তি ও তথ্য ব্যবহারের শর্ত</p>

        <section style="margin-bottom: 24px; background: #fef2f2; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444;">
          <h2 style="font-size: 19px; color: #991b1b; font-weight: 800; margin: 0 0 10px;">১. অ-সরকারি সত্ত্বা ও স্বাধীন অবস্থান</h2>
          <p style="margin: 0; color: #7f1d1d;">
            <strong>TrainKoi (ট্রেনকই)</strong> কোনো সরকারি প্রতিষ্ঠান, বাংলাদেশ সরকার বা বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অঙ্গপ্রতিষ্ঠান কিংবা অনুমোদিত এজেন্ট নয়। এটি সাধারণ ট্রেন যাত্রীদের যাতায়াত সহজতর করার লক্ষ্যে সম্পূর্ণ স্বাধীন ও কমিউনিটি উদ্যোগে পরিচালিত একটি তথ্যভিত্তিক সহায়ক পোর্টাল।
          </p>
        </section>

        <section style="margin-bottom: 24px;">
          <h2 style="font-size: 19px; color: #006a4e; font-weight: 700; margin-bottom: 10px;">২. তথ্যের যথার্থতা ও পরিবর্তনশীলতা</h2>
          <p>
            ট্রেনকই প্ল্যাটফর্মে প্রদর্শিত ট্রেনের সময়সূচী, প্ল্যাটফর্ম তথ্য ও ট্র্যাকিং ডেটা উন্মুক্ত উৎস এবং সহযাত্রীদের রিয়েল-টাইম তথ্যের ওপর ভিত্তি করে পরিবেশিত হয়। রেলওয়ের পরিচালনাগত কারণে যেকোনো মুহূর্তে শিডিউল বা প্ল্যাটফর্মে পরিবর্তন হতে পারে। জরুরি পরিস্থিতিতে যাত্রীদের সংশ্লিষ্ট স্টেশনের সহায়তা কেন্দ্র বা অফিশিয়াল ঘোষণার সাথে তথ্য মিলিয়ে নেওয়ার পরামর্শ দেওয়া হচ্ছে।
          </p>
        </section>

        <section>
          <h2 style="font-size: 19px; color: #006a4e; font-weight: 700; margin-bottom: 10px;">৩. আর্থিক লেনদেন ও টিকিটিং দায়মুক্তি</h2>
          <p>
            ট্রেনকই সরাসরি কোনো ট্রেনের টিকিট বিক্রি করে না এবং কোনো আর্থিক লেনদেন গ্রহণ করে না। টিকিট কাটার জন্য যাত্রীদের বাংলাদেশ রেলওয়ের একমাত্র অনুমোদিত পোর্টাল (eticket.railway.gov.bd) বা স্টেশন কাউন্টার ব্যবহার করতে হবে।
          </p>
        </section>
      </div>
    </main>
    ${sharedFooter}
  `;

  const disclaimerHtml = createPageHtml({
    template: baseTemplate,
    title: 'আইনগত দায়মুক্তি নোটিশ (Disclaimer) | TrainKoi',
    description: 'ট্রেনকই (TrainKoi) প্ল্যাটফর্মের আইনগত দায়মুক্তি ও অ-সরকারি ঘোষণা। বাংলাদেশ রেলওয়ের তথ্যের সত্যতা ও ব্যবহারের নিয়মাবলী।',
    canonicalUrl: 'https://www.trainkoi.com/disclaimer',
    bodyHtml: disclaimerBody
  });
  writeHtmlFile('disclaimer', disclaimerHtml);

  // 6. FETCH BLOGS & PRE-RENDER EACH BLOG
  console.log('📚 Fetching Blogs from Render API and local files...');
  let blogs = [];
  try {
    const res = await fetch('https://train-koi.onrender.com/api/blogs', { 
      headers: { 'User-Agent': 'TrainKoi-Prerender/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      blogs = await res.json();
      console.log(`✅ Fetched ${blogs.length} blogs from Mongo API.`);
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch blogs from Render API, loading cached fallback:', err.message);
  }

  // Fallback to cached blogs if API fetch didn't return blogs
  if (blogs.length === 0) {
    try {
      const cachedBlogFile = path.resolve(rootDir, 'src/data/cached_blogs.json');
      if (fs.existsSync(cachedBlogFile)) {
        blogs = JSON.parse(fs.readFileSync(cachedBlogFile, 'utf-8'));
        console.log(`📦 Loaded ${blogs.length} blogs from local cache.`);
      }
    } catch (e) {
      console.warn('⚠️ Cache blog read note:', e.message);
    }
  }

  // Load local blogs as well
  try {
    const localBlogFile = path.resolve(rootDir, 'src/data/blogData.js');
    if (fs.existsSync(localBlogFile)) {
      const content = fs.readFileSync(localBlogFile, 'utf-8');
      const match = content.match(/export const blogs = (\[[\s\S]*\]);?/);
      if (match) {
        const localBlogs = JSON.parse(match[1]);
        const existingSlugs = new Set(blogs.map(b => b.slug || b._id));
        for (const lb of localBlogs) {
          const s = lb.slug || lb._id;
          if (!existingSlugs.has(s)) {
            blogs.push(lb);
            existingSlugs.add(s);
          }
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Local blog parse note:', e.message);
  }

  console.log(`📝 Total Blogs to Pre-render: ${blogs.length}`);

  // Pre-render Blog Directory (/blogs)
  const blogListItems = blogs.map(b => {
    const slug = b.slug || b._id;
    const excerpt = (b.content || '').slice(0, 150).replace(/[#*`_]/g, '') + '...';
    return `
      <article style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 22px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <span style="display: inline-block; background: #ecfdf5; color: #006a4e; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 12px; margin-bottom: 8px;">
          ${escapeHtml(b.category || 'ভ্রমণ গাইড')}
        </span>
        <h2 style="font-size: 20px; margin: 0 0 10px; font-weight: 700;">
          <a href="/blog/${slug}" style="color: #111827; text-decoration: none;">${escapeHtml(b.title)}</a>
        </h2>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 12px;">${escapeHtml(excerpt)}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #6b7280;">
          <span>✍️ ${escapeHtml(b.author || 'TrainKoi রিসার্চ টিম')}</span>
          <a href="/blog/${slug}" style="color: #006a4e; font-weight: 700; text-decoration: none;">সম্পূর্ণ পড়ুন ➔</a>
        </div>
      </article>
    `;
  }).join('\n');

  const blogsDirectoryBody = `
    ${sharedNav}
    <main style="max-width: 960px; margin: 30px auto; padding: 0 16px; color: #1f2937;">
      <div style="margin-bottom: 30px; text-align: center;">
        <h1 style="font-size: 32px; color: #006a4e; font-weight: 800; margin: 0 0 10px;">ট্রেন ভ্রমণ ব্লগ ও পূর্ণাঙ্গ নির্দেশিকা</h1>
        <p style="color: #4b5563; font-size: 16px; max-width: 680px; margin: 0 auto;">বাংলাদেশ রেলওয়ের বিভিন্ন রুটের সময়সূচী, টিকিট কাটার নিয়ম, ট্রেন নির্বাচন এবং ভ্রমণ অভিজ্ঞতা নিয়ে প্রামাণ্য বিশ্লেষণ</p>
      </div>
      <div>
        ${blogListItems}
      </div>
    </main>
    ${sharedFooter}
  `;

  const blogsDirectoryHtml = createPageHtml({
    template: baseTemplate,
    title: 'ট্রেন ভ্রমণ ব্লগ ও পূর্ণাঙ্গ নির্দেশিকা ২০২৬ | TrainKoi',
    description: 'বাংলাদেশ রেলওয়ের সকল আন্তঃনগর ট্রেনের ভ্রমণ গাইড, টিকিট কাটার হ্যাকস, ভাড়ার তালিকা ও সিট সিলেকশন গাইড।',
    canonicalUrl: 'https://www.trainkoi.com/blogs',
    bodyHtml: blogsDirectoryBody
  });
  writeHtmlFile('blogs', blogsDirectoryHtml);

  // Pre-render Individual Blog Posts
  for (const blog of blogs) {
    const slug = blog.slug || blog._id;
    if (!slug) continue;

    const blogHtmlContent = markdownToHtml(blog.content);
    const cleanExcerpt = (blog.content || '').slice(0, 160).replace(/[#*`_]/g, '').trim();

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": cleanExcerpt,
      "image": "https://www.trainkoi.com/homeimg.png",
      "author": {
        "@type": "Organization",
        "name": blog.author || "TrainKoi ট্রাভেল রিসার্চ টিম"
      },
      "publisher": {
        "@type": "Organization",
        "name": "TrainKoi",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.trainkoi.com/logo.png"
        }
      },
      "datePublished": blog.createdAt || "2026-11-20T10:00:00.000Z",
      "dateModified": blog.updatedAt || blog.createdAt || "2026-11-22T12:00:00.000Z",
      "mainEntityOfPage": `https://www.trainkoi.com/blog/${slug}`
    };

    const blogBody = `
      ${sharedNav}
      <main style="max-width: 860px; margin: 30px auto; padding: 0 16px; color: #1f2937;">
        <article style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 14px; font-size: 13px; color: #6b7280; flex-wrap: wrap;">
            <span style="background: #ecfdf5; color: #006a4e; font-weight: 700; padding: 4px 10px; border-radius: 12px;">${escapeHtml(blog.category || 'ভ্রমণ গাইড')}</span>
            <span>📅 ${new Date(blog.createdAt || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>✍️ ${escapeHtml(blog.author || 'TrainKoi ট্রাভেল রিসার্চ টিম')}</span>
          </div>

          <h1 style="font-size: 28px; line-height: 1.4; color: #111827; margin: 0 0 24px; font-weight: 800;">
            ${escapeHtml(blog.title)}
          </h1>

          <div class="blog-rendered-content" style="font-size: 16px; line-height: 1.8; color: #374151;">
            ${blogHtmlContent}
          </div>

          <div style="margin-top: 36px; padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #006a4e; font-size: 13.5px; color: #64748b;">
            <p style="margin: 0 0 6px;"><strong>তথ্যসূত্র ও দায়মুক্তি:</strong> এই ভ্রমণ নির্দেশিকাটি বাংলাদেশ রেলওয়ের অনুমোদিত সময়সূচী ও নিয়মিত যাত্রীদের বাস্তব অভিজ্ঞতার আলোকে তৈরি করা হয়েছে। ট্রেন পরিচালনার বাস্তব পরিস্থিতিতে শিডিউলে পরিবর্তন হতে পারে।</p>
            <p style="margin: 0;">লাইভ লোকেশন ও প্ল্যাটফর্ম তথ্য জানতে ব্যবহার করুন <a href="/" style="color: #006a4e; font-weight: 700;">TrainKoi লাইভ ট্রেন ট্র্যাকার</a>।</p>
          </div>
        </article>
      </main>
      ${sharedFooter}
    `;

    const singleBlogHtml = createPageHtml({
      template: baseTemplate,
      title: `${blog.title} | TrainKoi`,
      description: cleanExcerpt,
      canonicalUrl: `https://www.trainkoi.com/blog/${slug}`,
      ogType: 'article',
      bodyHtml: blogBody,
      schemaJson: schema
    });

    writeHtmlFile(`blog/${slug}`, singleBlogHtml);
  }

  // 7. FETCH NEWS & PRE-RENDER EACH NEWS
  console.log('📰 Fetching Railway News from Render API and local files...');
  let newsList = [];
  try {
    const res = await fetch('https://train-koi.onrender.com/api/news', { 
      headers: { 'User-Agent': 'TrainKoi-Prerender/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      newsList = await res.json();
      console.log(`✅ Fetched ${newsList.length} news items from Mongo API.`);
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch news from Render API, loading cached fallback:', err.message);
  }

  // Fallback to cached news if API fetch didn't return news
  if (newsList.length === 0) {
    try {
      const cachedNewsFile = path.resolve(rootDir, 'src/data/cached_news.json');
      if (fs.existsSync(cachedNewsFile)) {
        newsList = JSON.parse(fs.readFileSync(cachedNewsFile, 'utf-8'));
        console.log(`📦 Loaded ${newsList.length} news from local cache.`);
      }
    } catch (e) {
      console.warn('⚠️ Cache news read note:', e.message);
    }
  }

  try {
    const localNewsFile = path.resolve(rootDir, 'src/data/newsData.js');
    if (fs.existsSync(localNewsFile)) {
      const content = fs.readFileSync(localNewsFile, 'utf-8');
      const match = content.match(/export const newsData = (\[[\s\S]*\]);?/);
      if (match) {
        const localNews = JSON.parse(match[1]);
        const existingSlugs = new Set(newsList.map(n => n.slug || n._id));
        for (const ln of localNews) {
          const s = ln.slug || ln._id;
          if (!existingSlugs.has(s)) {
            newsList.push(ln);
            existingSlugs.add(s);
          }
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Local news parse note:', e.message);
  }

  console.log(`📝 Total News to Pre-render: ${newsList.length}`);

  // Pre-render News Directory (/rail-news)
  const newsListItems = newsList.map(n => {
    const slug = n.slug || n._id;
    const excerpt = (n.content || '').slice(0, 150).replace(/[#*`_]/g, '') + '...';
    return `
      <article style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 22px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <span style="display: inline-block; background: #fef2f2; color: #dc2626; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 12px; margin-bottom: 8px;">
          ${escapeHtml(n.category || 'রেল বার্তা')}
        </span>
        <h2 style="font-size: 20px; margin: 0 0 10px; font-weight: 700;">
          <a href="/news/${slug}" style="color: #111827; text-decoration: none;">${escapeHtml(n.title)}</a>
        </h2>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 12px;">${escapeHtml(excerpt)}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #6b7280;">
          <span>📢 সূত্র: ${escapeHtml(n.source || 'বাংলাদেশ রেলওয়ে ও TrainKoi ডেস্ক')}</span>
          <a href="/news/${slug}" style="color: #dc2626; font-weight: 700; text-decoration: none;">বিস্তারিত পড়ুন ➔</a>
        </div>
      </article>
    `;
  }).join('\n');

  const newsDirectoryBody = `
    ${sharedNav}
    <main style="max-width: 960px; margin: 30px auto; padding: 0 16px; color: #1f2937;">
      <div style="margin-bottom: 30px; text-align: center;">
        <h1 style="font-size: 32px; color: #dc2626; font-weight: 800; margin: 0 0 10px;">রেল বার্তা ও লাইভ নোটিশ</h1>
        <p style="color: #4b5563; font-size: 16px; max-width: 680px; margin: 0 auto;">বাংলাদেশ রেলওয়ের জরুরি বিজ্ঞপ্তি, নতুন ট্রেন সংযোজন, ছুটির শিডিউল ও উন্নয়ন প্রকল্পের সর্বশেষ খবর</p>
      </div>
      <div>
        ${newsListItems}
      </div>
    </main>
    ${sharedFooter}
  `;

  const newsDirectoryHtml = createPageHtml({
    template: baseTemplate,
    title: 'রেল বার্তা ও লাইভ নোটিশ ২০২৬ | TrainKoi',
    description: 'বাংলাদেশ রেলওয়ের সর্বশেষ নোটিশ, নতুন ট্রেন চালুর সময়সূচি এবং জরুরি রেলওয়ে বুলেটিন।',
    canonicalUrl: 'https://www.trainkoi.com/rail-news',
    bodyHtml: newsDirectoryBody
  });
  writeHtmlFile('rail-news', newsDirectoryHtml);

  // Pre-render Individual News Posts
  for (const item of newsList) {
    const slug = item.slug || item._id;
    if (!slug) continue;

    const newsHtmlContent = markdownToHtml(item.content);
    const cleanExcerpt = (item.content || '').slice(0, 160).replace(/[#*`_]/g, '').trim();

    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": item.title,
      "description": cleanExcerpt,
      "image": "https://www.trainkoi.com/homeimg.png",
      "author": {
        "@type": "Organization",
        "name": item.source || "TrainKoi নিউজ ডেস্ক"
      },
      "publisher": {
        "@type": "Organization",
        "name": "TrainKoi",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.trainkoi.com/logo.png"
        }
      },
      "datePublished": item.createdAt || "2026-11-20T10:00:00.000Z",
      "dateModified": item.updatedAt || item.createdAt || "2026-11-22T12:00:00.000Z",
      "mainEntityOfPage": `https://www.trainkoi.com/news/${slug}`
    };

    const newsBody = `
      ${sharedNav}
      <main style="max-width: 860px; margin: 30px auto; padding: 0 16px; color: #1f2937;">
        <article style="background: #ffffff; padding: 36px 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 14px; font-size: 13px; color: #6b7280; flex-wrap: wrap;">
            <span style="background: #fef2f2; color: #dc2626; font-weight: 700; padding: 4px 10px; border-radius: 12px;">${escapeHtml(item.category || 'রেল বার্তা')}</span>
            <span>📅 ${new Date(item.createdAt || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>📢 সূত্র: ${escapeHtml(item.source || 'TrainKoi নিউজ ডেস্ক')}</span>
          </div>

          <h1 style="font-size: 28px; line-height: 1.4; color: #111827; margin: 0 0 24px; font-weight: 800;">
            ${escapeHtml(item.title)}
          </h1>

          <div class="news-rendered-content" style="font-size: 16px; line-height: 1.8; color: #374151;">
            ${newsHtmlContent}
          </div>

          <div style="margin-top: 36px; padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #dc2626; font-size: 13.5px; color: #64748b;">
            <p style="margin: 0 0 6px;"><strong>নোটিশ ও দায়মুক্তি:</strong> প্রকাশিত সংবাদটি সরকারি গেজেট, রেলপথ মন্ত্রণালয় ও রেলওয়ের আনুষ্ঠানিক বিজ্ঞপ্তির তথ্যের ভিত্তিতে প্রস্তুতকৃত।</p>
            <p style="margin: 0;">লাইভ ট্রেনের আপডেট পেতে চোখ রাখুন <a href="/" style="color: #006a4e; font-weight: 700;">TrainKoi হোমপেজে</a>।</p>
          </div>
        </article>
      </main>
      ${sharedFooter}
    `;

    const singleNewsHtml = createPageHtml({
      template: baseTemplate,
      title: `${item.title} | TrainKoi`,
      description: cleanExcerpt,
      canonicalUrl: `https://www.trainkoi.com/news/${slug}`,
      ogType: 'article',
      bodyHtml: newsBody,
      schemaJson: schema
    });

    writeHtmlFile(`news/${slug}`, singleNewsHtml);
    writeHtmlFile(`rail-news/${slug}`, singleNewsHtml);
  }

  console.log('🎉 Pre-rendering completed successfully! All critical pages and blogs now exist as high-speed static HTML.');
}

main().catch(err => {
  console.error('❌ Error during pre-rendering:', err);
  process.exit(1);
});
