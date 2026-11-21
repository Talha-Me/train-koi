const fs = require('fs');
const path = require('path');
const { trains } = require('../src/data/trainData.js');

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const getCleanSlug = (trainName) => {
  if (!trainName) return '';
  const englishMatch = trainName.match(/\(([^)]+)\)/);
  const nameToProcess = englishMatch ? englishMatch[1] : trainName;
  return nameToProcess.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

const uniqueSlugs = new Set();
trains.forEach(t => {
  const slug = getCleanSlug(t.name);
  if (slug) uniqueSlugs.add(slug);
});

console.log('Total unique train slugs:', uniqueSlugs.size);

const today = new Date().toISOString().split('T')[0];
let addedCount = 0;
let newEntries = '';

uniqueSlugs.forEach(slug => {
  const loc = `https://www.trainkoi.com/schedule/${slug}`;
  if (!sitemapContent.includes(`/schedule/${slug}`)) {
    newEntries += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    addedCount++;
  }
});

console.log('New URLs added to sitemap:', addedCount);

if (addedCount > 0) {
  sitemapContent = sitemapContent.replace('</urlset>', newEntries + '</urlset>');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('Successfully updated sitemap.xml with 100% of train schedule URLs!');
}
