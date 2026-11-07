const makeSlug = (text) => {
  if (!text) return 'post-' + Date.now();
  return text.toString().toLowerCase().trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
};

console.log('Test slug:', makeSlug('ঢাকা থেকে সিলেট ট্রেন ভ্রমণ গাইড ও সময়সূচি'));
