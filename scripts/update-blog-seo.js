import fs from 'fs';

let content = fs.readFileSync('src/pages/BlogDetail.jsx', 'utf8');

const target1 = `const stripHtml = (text = '') => text.replace(/<[^>]+>/g, '').trim();`;
const addition1 = `const stripHtml = (text = '') => text.replace(/<[^>]+>/g, '').trim();

const SITE_NAME = 'TrainKoi';

/* ---------- SEO meta helper ---------- */
const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(\`meta[\${attr}="\${key}"]\`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};`;

content = content.replace(target1, addition1);

const target2 = `  /* ---------- Reading progress ---------- */`;
const addition2 = `  /* ---------- SEO: title, description, OG, JSON-LD Schema ---------- */
  useEffect(() => {
    if (!blog) return undefined;
    const prevTitle = document.title;
    const desc = stripHtml(blog.content).slice(0, 160).replace(/\\s+/g, ' ').trim();
    const url = window.location.href;
    const image = blog.thumbnail || FALLBACK_IMG;
    const category = blog.category || 'ভ্রমণ গাইড';

    document.title = \`\${blog.title} | \${SITE_NAME}\`;
    setMeta('name', 'description', desc);
    setMeta('name', 'keywords', \`\${blog.title}, \${category}, বাংলাদেশ রেলওয়ে, TrainKoi, ট্রেন ট্র্যাকিং\`);
    setMeta('property', 'og:title', blog.title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', url);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: desc,
      articleSection: category,
      datePublished: blog.createdAt || new Date().toISOString(),
      dateModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
      author: { '@type': 'Organization', name: blog.author || SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: url,
      image: [image]
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      if (ld.parentNode) ld.parentNode.removeChild(ld);
    };
  }, [blog]);

  /* ---------- Reading progress ---------- */`;

content = content.replace(target2, addition2);
fs.writeFileSync('src/pages/BlogDetail.jsx', content, 'utf8');
console.log('✅ Successfully updated BlogDetail.jsx with 100% SEO metadata and JSON-LD schema!');
