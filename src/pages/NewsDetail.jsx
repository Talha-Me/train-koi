import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, Calendar, Clock, Globe, Share2, Check, Type,
  ArrowUpRight, SearchX, ArrowLeft, ListOrdered
} from 'lucide-react';

/* =====================================================================
   ADSENSE SETTINGS
   1) index.html এর <head> এ AdSense script একবার বসান:
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   2) নিচে নিজের publisher id ও ad unit slot id বসান।
   ফাঁকা থাকলে কোনো বিজ্ঞাপন দেখাবে না (সেফ)।
   ===================================================================== */
const ADSENSE_CLIENT = ''; // যেমন: 'ca-pub-1234567890123456'
const AD_SLOTS = {
  top: '',     // প্রথম অনুচ্ছেদের পরে
  middle: '',  // লেখার মাঝখানে (বড় লেখায়)
  bottom: '',  // লেখার শেষে
};

const SITE_NAME = 'TrainKoi';
const FALLBACK_IMG = '/homeimg.png';
const FONT_SIZES = [16.5, 18, 20];

/* ---------- helpers ---------- */
const htmlToText = (html = '') =>
  String(html)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*h[12][^>]*>/gi, '\n\n## ')
    .replace(/<\s*h[3-6][^>]*>/gi, '\n\n### ')
    .replace(/<\s*li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|h[1-6]|ul|ol|blockquote)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const plain = (text = '') =>
  htmlToText(text)
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^\s*[-•*]\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const formatDate = (value) =>
  new Date(value || Date.now()).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });

const formatTime = (value) => {
  const d = new Date(value || Date.now());
  return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' });
};

const readMinutes = (text) => {
  const words = plain(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 160)).toLocaleString('bn-BD');
};

const onImgError = (e) => {
  if (!e.currentTarget.src.endsWith(FALLBACK_IMG)) e.currentTarget.src = FALLBACK_IMG;
};

/*
  Content ke block e vag kore (plain text ba HTML dutoi chole):
  - "# / ## "  => heading (h2)
  - "### / #### " => sub-heading (h3)
  - "- " / "• " / "* " => bullet list
  - "1. " / "১. " => numbered list
  - "> " => quote
  - **text** => bold
  - faka line => notun paragraph
*/
const parseBlocks = (raw = '') => {
  const text = htmlToText(raw).replace(/\r\n/g, '\n');
  const blocks = [];
  let para = [];
  let list = null;
  let quote = [];

  const flush = () => {
    if (para.length) { blocks.push({ type: 'p', text: para.join('\n') }); para = []; }
    if (list) { blocks.push(list); list = null; }
    if (quote.length) { blocks.push({ type: 'quote', text: quote.join('\n') }); quote = []; }
  };

  text.split('\n').forEach((line) => {
    const t = line.trim();
    if (!t) { flush(); return; }

    const h = t.match(/^(#{1,4})\s+(.+)$/);
    if (h) { flush(); blocks.push({ type: 'h', level: h[1].length <= 2 ? 2 : 3, text: h[2] }); return; }

    const ul = t.match(/^[-•*]\s+(.+)$/);
    if (ul) {
      if (para.length || quote.length || (list && list.type !== 'ul')) flush();
      if (!list) list = { type: 'ul', items: [] };
      list.items.push(ul[1]);
      return;
    }

    const ol = t.match(/^[\d০-৯]+[.)।]\s+(.+)$/);
    if (ol) {
      if (para.length || quote.length || (list && list.type !== 'ol')) flush();
      if (!list) list = { type: 'ol', items: [] };
      list.items.push(ol[1]);
      return;
    }

    const q = t.match(/^>\s?(.*)$/);
    if (q) {
      if (para.length || list) flush();
      quote.push(q[1]);
      return;
    }

    if (list || quote.length) flush();
    para.push(t);
  });
  flush();

  let hi = 0;
  return blocks.map((b) => (b.type === 'h' && b.level === 2 ? { ...b, id: `sec-${hi++}` } : b));
};

const renderInline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );

/* ---------- AdSense slot ---------- */
const AdSlot = ({ slot }) => {
  const ready = Boolean(ADSENSE_CLIENT && slot);
  useEffect(() => {
    if (!ready) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (err) { console.error('AdSense error:', err); }
  }, [ready]);

  if (!ready) return null;
  return (
    <aside className="nd-ad" aria-label="বিজ্ঞাপন">
      <span className="nd-ad-label">বিজ্ঞাপন</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

/* ---------- SEO meta ---------- */
const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const NewsDetail = () => {
  const params = useParams();
  const rawKey = params.slug || params.id;
  const key = useMemo(() => {
    try { return decodeURIComponent(rawKey || ''); } catch { return rawKey || ''; }
  }, [rawKey]);

  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [showBarTitle, setShowBarTitle] = useState(false);

  const articleRef = useRef(null);
  const progressRef = useRef(null);

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://train-koi.onrender.com';

  /* ---------- Load (direct + list, parallel) ---------- */
  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    window.scrollTo(0, 0);
    setLoading(true);
    setNews(null);

    const getJson = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    };

    (async () => {
      const [listRes, directRes] = await Promise.allSettled([
        getJson(`${API_BASE_URL}/api/news`),
        getJson(`${API_BASE_URL}/api/news/${encodeURIComponent(key)}`),
      ]);

      const list = listRes.status === 'fulfilled' && Array.isArray(listRes.value) ? listRes.value : [];
      let found = null;
      if (directRes.status === 'fulfilled') {
        const d = directRes.value;
        found = d && d.title ? d : (d && (d.news || d.item)) || null;
      }
      if (!found || !found.title) {
        found = list.find((n) => n.slug === key || n._id === key) || null;
      }

      if (cancelled) return;
      setNews(found);
      if (found) {
        const currentId = found._id || found.slug;
        setRelated(list.filter((n) => (n._id || n.slug) !== currentId).slice(0, 4));
      } else {
        setRelated([]);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [key, API_BASE_URL]);

  /* ---------- SEO: title, description, OG, JSON-LD ---------- */
  useEffect(() => {
    if (!news) return undefined;
    const prevTitle = document.title;
    const desc = (news.metaDescription || '').trim() || plain(news.content).slice(0, 160);
    const keywords = Array.isArray(news.keywords) ? news.keywords.filter(Boolean) : [];
    const url = window.location.href;
    const image = news.thumbnail || news.image || '';

    document.title = `${news.title} | ${SITE_NAME}`;
    setMeta('name', 'description', desc);
    if (keywords.length) setMeta('name', 'keywords', keywords.join(', '));
    setMeta('property', 'og:title', news.title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', url);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: news.title,
      description: desc,
      datePublished: news.createdAt,
      dateModified: news.updatedAt || news.createdAt,
      author: { '@type': 'Organization', name: news.source || SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: url,
      ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
      ...(image ? { image: [image] } : {}),
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      if (ld.parentNode) ld.parentNode.removeChild(ld);
    };
  }, [news]);

  /* ---------- Reading progress ---------- */
  useEffect(() => {
    if (!news) return undefined;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = articleRef.current;
      if (el && progressRef.current) {
        const rect = el.getBoundingClientRect();
        const total = Math.max(rect.height - window.innerHeight * 0.5, 1);
        const done = Math.min(1, Math.max(0, -rect.top / total));
        progressRef.current.style.transform = `scaleX(${done})`;
      }
      setShowBarTitle(window.scrollY > 200);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [news]);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('/rail-news');
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: news ? news.title : 'TrainKoi নিউজ', url });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const cycleSize = () => setSizeIdx((i) => (i + 1) % FONT_SIZES.length);
  const openNews = (n) => navigate(`/news/${n.slug || n._id}`);
  const onKey = (e, n) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNews(n); }
  };

  const blocks = useMemo(() => (news ? parseBlocks(news.content) : []), [news]);
  const toc = useMemo(() => blocks.filter((b) => b.type === 'h' && b.level === 2), [blocks]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="nd-page">
        <style>{css}</style>
        <div className="nd-bar">
          <div className="nd-bar-in">
            <button className="nd-icon-btn" onClick={handleBack} aria-label="ফিরে যান"><ChevronLeft size={20} /></button>
            <div className="nd-bar-mid"><span className="nd-brand">রেল বার্তা</span></div>
            <span style={{ width: 40 }} />
          </div>
        </div>
        <div className="nd-wrap" style={{ paddingTop: 32 }}>
          <div className="nd-skel" style={{ width: 90, height: 26, borderRadius: 999 }} />
          <div className="nd-skel" style={{ height: 34, marginTop: 18 }} />
          <div className="nd-skel" style={{ height: 34, width: '70%', marginTop: 10 }} />
          <div className="nd-skel" style={{ height: 16, width: 240, marginTop: 24 }} />
        </div>
        <div className="nd-body">
          {[100, 96, 100, 88, 100, 72].map((w, i) => (
            <div key={i} className="nd-skel" style={{ height: 16, width: `${w}%`, marginBottom: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (!news) {
    return (
      <div className="nd-page">
        <style>{css}</style>
        <div className="nd-state">
          <div className="nd-state-icon"><SearchX size={32} /></div>
          <h2>নিউজটি পাওয়া যায়নি</h2>
          <p>এই নোটিশটি হয়তো সরানো হয়েছে অথবা সার্ভার সংযোগে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।</p>
          <div className="nd-state-actions">
            <button className="nd-btn" onClick={() => window.location.reload()}>আবার চেষ্টা করুন</button>
            <button className="nd-btn is-ghost" onClick={() => navigate('/rail-news')}>
              <ArrowLeft size={16} /> সব নোটিশ দেখুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const image = news.thumbnail || news.image;
  const time = formatTime(news.createdAt);
  const total = blocks.length;
  const topAdAfter = total > 2 ? 1 : -1;                 // ২য় ব্লকের পরে
  const midAdAfter = total >= 9 ? Math.floor(total / 2) : -1; // বড় লেখায় মাঝখানে
  const adKey = news._id || news.slug || key;

  /* ---------- Article ---------- */
  return (
    <div className="nd-page" style={{ '--fs': `${FONT_SIZES[sizeIdx]}px` }}>
      <style>{css}</style>

      <div className="nd-bar">
        <div className="nd-bar-in">
          <button className="nd-icon-btn" onClick={handleBack} aria-label="ফিরে যান"><ChevronLeft size={20} /></button>
          <div className="nd-bar-mid">
            <span className={`nd-brand ${showBarTitle ? 'is-hidden' : ''}`}>রেল বার্তা</span>
            <span className={`nd-bar-title ${showBarTitle ? 'is-shown' : ''}`}>{news.title}</span>
          </div>
          <div className="nd-bar-actions">
            <button className="nd-icon-btn" onClick={cycleSize} aria-label="লেখার আকার পরিবর্তন করুন" title="লেখার আকার">
              <Type size={18} />
            </button>
            <button className="nd-share-btn" onClick={handleShare} aria-label="শেয়ার করুন">
              {copied
                ? <><Check size={15} color="#16a34a" /> <span>কপি হয়েছে</span></>
                : <><Share2 size={15} /> <span>শেয়ার</span></>}
            </button>
          </div>
        </div>
        <div className="nd-progress"><div className="nd-progress-fill" ref={progressRef} /></div>
      </div>

      <article ref={articleRef} itemScope itemType="https://schema.org/NewsArticle">
        {/* Head */}
        <header className="nd-wrap nd-head">
          <nav className="nd-crumbs" aria-label="breadcrumb">
            <Link to="/">হোম</Link><span>/</span>
            <Link to="/rail-news">রেল বার্তা</Link>
          </nav>
          <span className="nd-cat">রেল বার্তা</span>
          <h1 className="nd-title" itemProp="headline">{news.title}</h1>

          <div className="nd-facts">
            {news.source && <span className="nd-fact"><Globe size={14} /> সূত্র: {news.source}</span>}
            <span className="nd-fact"><Calendar size={14} /> <time dateTime={news.createdAt}>{formatDate(news.createdAt)}</time></span>
            {time && <span className="nd-fact"><Clock size={14} /> {time}</span>}
            <span className="nd-fact">{readMinutes(news.content)} মিনিট পাঠ</span>
          </div>
        </header>

        {/* Cover (thakle) */}
        {image && (
          <figure className="nd-cover">
            <img src={image} alt={news.title} onError={onImgError} />
          </figure>
        )}

        {/* Body */}
        <div className="nd-body" itemProp="articleBody">
          {toc.length >= 3 && (
            <nav className="nd-toc" aria-label="সূচিপত্র">
              <div className="nd-toc-head"><ListOrdered size={16} /> এই লেখায় যা আছে</div>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} onClick={(e) => { e.preventDefault(); scrollToSection(h.id); }}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {blocks.map((b, i) => {
            let node;
            if (b.type === 'h') {
              node = b.level === 3
                ? <h3>{renderInline(b.text)}</h3>
                : <h2 id={b.id}>{renderInline(b.text)}</h2>;
            } else if (b.type === 'ul') {
              node = <ul>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>;
            } else if (b.type === 'ol') {
              node = <ol className="nd-ol">{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>;
            } else if (b.type === 'quote') {
              node = <blockquote>{renderInline(b.text)}</blockquote>;
            } else {
              node = <p className={i === 0 && total > 1 ? 'is-lead' : ''}>{renderInline(b.text)}</p>;
            }

            return (
              <React.Fragment key={i}>
                {node}
                {i === topAdAfter && <AdSlot key={`${adKey}-top`} slot={AD_SLOTS.top} />}
                {i === midAdAfter && <AdSlot key={`${adKey}-mid`} slot={AD_SLOTS.middle} />}
              </React.Fragment>
            );
          })}

          {news.source && (
            <p className="nd-credit">সূত্র: <strong>{news.source}</strong></p>
          )}
        </div>
      </article>

      {/* End */}
      <section className="nd-end">
        <AdSlot key={`${adKey}-bottom`} slot={AD_SLOTS.bottom} />
        <div className="nd-ticket">
          <p>তথ্যটি কাজে লাগলে অন্য যাত্রীদের সাথে শেয়ার করুন</p>
          <button className="nd-btn" onClick={handleShare}>
            {copied ? <><Check size={16} /> কপি হয়েছে</> : <><Share2 size={16} /> শেয়ার করুন</>}
          </button>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="nd-related">
          <div className="nd-related-in">
            <h2 className="nd-related-head">আরও নোটিশ</h2>
            <div className="nd-related-list">
              {related.map((n) => (
                <article
                  key={n._id || n.slug}
                  className="nd-rcard"
                  role="link"
                  tabIndex={0}
                  onClick={() => openNews(n)}
                  onKeyDown={(e) => onKey(e, n)}
                >
                  <div className="nd-rcard-body">
                    <h3>{n.title}</h3>
                    <div className="nd-rcard-foot">
                      <span className="nd-fact"><Calendar size={13} /> {formatDate(n.createdAt)}</span>
                      <span className="nd-rcard-cta">পড়ুন <ArrowUpRight size={14} /></span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button className="nd-btn is-ghost nd-back-all" onClick={() => navigate('/rail-news')}>
              <ArrowLeft size={16} /> সব নোটিশ দেখুন
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

const css = `
.nd-page {
  --ink: #0f1f1a; --body: #25332e; --muted: #5d6f68; --faint: #8a9a94;
  --green: #006a4e; --green-deep: #003726; --mint: #6ee7b7;
  --line: #e2ebe7; --bg: #f3f7f5; --surface: #ffffff; --fs: 18px;
  background: var(--surface); min-height: 100vh; padding-bottom: 60px;
  font-family: 'Hind Siliguri', sans-serif; color: var(--ink);
}
.nd-page *, .nd-page *::before, .nd-page *::after { box-sizing: border-box; }
.nd-page button { font-family: inherit; }
.nd-page :focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }

/* ---------- Top bar ---------- */
.nd-bar {
  position: sticky; top: 0; z-index: 60;
  background: rgba(255,255,255,.88);
  -webkit-backdrop-filter: saturate(160%) blur(16px); backdrop-filter: saturate(160%) blur(16px);
  border-bottom: 1px solid var(--line);
}
.nd-bar-in { max-width: 1080px; margin: 0 auto; height: 58px; padding: 0 14px; display: flex; align-items: center; gap: 10px; }
.nd-icon-btn {
  flex: none; width: 40px; height: 40px; display: grid; place-items: center;
  color: var(--green-deep); background: var(--bg); border: 1px solid var(--line);
  border-radius: 13px; cursor: pointer; transition: background .15s, color .15s, transform .15s;
}
.nd-icon-btn:hover { background: var(--green); color: #fff; }
.nd-icon-btn:active { transform: scale(.94); }
.nd-bar-mid { position: relative; flex: 1; min-width: 0; height: 24px; }
.nd-brand, .nd-bar-title {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  transition: opacity .25s, transform .25s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.nd-brand { font-size: 13.5px; font-weight: 800; color: var(--green); }
.nd-brand.is-hidden { opacity: 0; transform: translateY(-6px); }
.nd-bar-title {
  display: block; text-align: center; line-height: 24px; font-size: 14px; font-weight: 700;
  color: var(--ink); opacity: 0; transform: translateY(6px);
}
.nd-bar-title.is-shown { opacity: 1; transform: none; }
.nd-bar-actions { flex: none; display: flex; align-items: center; gap: 8px; }
.nd-share-btn {
  height: 40px; padding: 0 14px; display: flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 700; color: var(--green-deep);
  background: var(--bg); border: 1px solid var(--line); border-radius: 13px; cursor: pointer;
  transition: background .15s, color .15s;
}
.nd-share-btn:hover { background: var(--green); color: #fff; }
.nd-progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 3px; }
.nd-progress-fill {
  height: 100%; transform-origin: left center; transform: scaleX(0);
  background: linear-gradient(90deg, var(--green), var(--mint));
}

/* ---------- Head ---------- */
.nd-wrap { max-width: 760px; margin: 0 auto; padding: 0 20px; }
.nd-head { padding-top: 24px; }
.nd-crumbs { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; font-size: 13px; color: var(--faint); }
.nd-crumbs a { color: var(--muted); text-decoration: none; }
.nd-crumbs a:hover { color: var(--green); text-decoration: underline; }
.nd-cat {
  display: inline-block; padding: 5px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 800;
  color: #065f46; background: #e3f3ec; border: 1px solid #b7e4d0;
}
.nd-title { margin: 16px 0 20px; font-size: 27px; font-weight: 800; line-height: 1.4; letter-spacing: -0.3px; }
.nd-facts {
  display: flex; flex-wrap: wrap; gap: 8px 16px; padding: 14px 0;
  border-top: 1.5px dashed var(--line); border-bottom: 1.5px dashed var(--line);
}
.nd-fact { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--muted); }
.nd-fact svg { color: var(--green); }

/* ---------- Cover ---------- */
.nd-cover { max-width: 1000px; margin: 26px auto 0; padding: 0; }
.nd-cover img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: #e6eeea; }

/* ---------- Body ---------- */
.nd-body {
  max-width: 700px; margin: 0 auto; padding: 28px 20px 8px;
  font-size: var(--fs); line-height: 2; color: var(--body); transition: font-size .2s ease;
}
.nd-body p { margin: 0 0 1.35em; white-space: pre-line; }
.nd-body p.is-lead { font-size: 1.1em; font-weight: 500; color: var(--ink); }
.nd-body h2 {
  margin: 1.9em 0 .6em; padding-left: 14px; font-size: 1.32em; font-weight: 800;
  line-height: 1.45; color: var(--ink); border-left: 4px solid var(--green); scroll-margin-top: 76px;
}
.nd-body h3 { margin: 1.6em 0 .5em; font-size: 1.16em; font-weight: 800; line-height: 1.45; color: var(--green-deep); }
.nd-body ul, .nd-body ol.nd-ol { margin: 0 0 1.35em; padding: 0; list-style: none; }
.nd-body ol.nd-ol { counter-reset: nd; }
.nd-body li { position: relative; padding-left: 28px; margin-bottom: .55em; }
.nd-body ul > li::before {
  content: ''; position: absolute; left: 6px; top: .8em; width: 8px; height: 8px;
  border-radius: 50%; background: var(--green);
}
.nd-body ol.nd-ol > li { counter-increment: nd; }
.nd-body ol.nd-ol > li::before {
  content: counter(nd, bengali) "."; position: absolute; left: 0; top: 0; font-weight: 800; color: var(--green);
}
.nd-body blockquote {
  margin: 1.6em 0; padding: 18px 22px; white-space: pre-line;
  font-weight: 600; color: var(--green-deep); background: #eaf6f0; border-radius: 18px;
}
.nd-body strong { font-weight: 800; color: var(--ink); }
.nd-credit {
  margin-top: 1.8em !important; padding-top: 16px; border-top: 1.5px dashed var(--line);
  font-size: .85em; color: var(--muted);
}

/* ---------- TOC ---------- */
.nd-toc { margin: 0 0 1.8em; padding: 18px 20px; font-size: 15px; line-height: 1.7; background: var(--bg); border-radius: 18px; }
.nd-toc-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: 800; color: var(--ink); }
.nd-toc-head svg { color: var(--green); }
.nd-toc ol { margin: 0; padding-left: 22px; }
.nd-toc li { padding-left: 0 !important; margin-bottom: .3em !important; }
.nd-toc li::before { display: none !important; }
.nd-toc a { color: var(--green); text-decoration: none; font-weight: 600; }
.nd-toc a:hover { text-decoration: underline; }

/* ---------- Ads ---------- */
.nd-ad { margin: 1.8em 0; min-height: 120px; text-align: center; overflow: hidden; }
.nd-ad-label { display: block; margin-bottom: 6px; font-size: 11.5px; color: var(--faint); }

/* ---------- End ---------- */
.nd-end { max-width: 700px; margin: 18px auto 0; padding: 0 20px; }
.nd-ticket {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
  padding: 22px 0; border-top: 1.5px dashed var(--line);
}
.nd-ticket p { margin: 0; font-size: 15px; font-weight: 700; color: var(--body); }
.nd-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 22px; font-size: 14px; font-weight: 800; color: #fff;
  background: var(--green); border: 1px solid var(--green); border-radius: 14px; cursor: pointer;
  transition: background .15s, transform .15s;
}
.nd-btn:hover { background: var(--green-deep); }
.nd-btn:active { transform: scale(.97); }
.nd-btn.is-ghost { color: var(--green-deep); background: var(--surface); border-color: var(--line); }
.nd-btn.is-ghost:hover { background: var(--bg); border-color: var(--green); }

/* ---------- Related ---------- */
.nd-related { background: var(--bg); margin-top: 40px; padding: 40px 0 34px; }
.nd-related-in { max-width: 760px; margin: 0 auto; padding: 0 18px; }
.nd-related-head { margin: 0 0 18px; font-size: 20px; font-weight: 800; }
.nd-related-list { display: grid; gap: 12px; }
.nd-rcard {
  cursor: pointer; background: var(--surface); border: 1px solid var(--line); border-radius: 20px;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.nd-rcard:hover { border-color: #c5ddd3; box-shadow: 0 16px 28px -20px rgba(0,55,38,.4); }
.nd-rcard:active { transform: scale(.985); }
.nd-rcard-body { padding: 16px 18px; }
.nd-rcard h3 {
  margin: 0 0 12px; font-size: 16px; font-weight: 800; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.nd-rcard-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 11px; border-top: 1.5px dashed var(--line);
}
.nd-rcard-foot .nd-fact { font-size: 12px; color: var(--faint); }
.nd-rcard-cta { display: inline-flex; align-items: center; gap: 2px; font-size: 13px; font-weight: 800; color: var(--green); }
.nd-back-all { margin-top: 22px; }

/* ---------- Skeleton / states ---------- */
.nd-skel {
  border-radius: 10px;
  background: linear-gradient(100deg, #e4ece8 30%, #f1f6f3 50%, #e4ece8 70%);
  background-size: 200% 100%; animation: nd-shimmer 1.4s linear infinite;
}
@keyframes nd-shimmer { to { background-position: -200% 0; } }
.nd-state {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 24px; background: var(--bg);
}
.nd-state-icon {
  width: 72px; height: 72px; display: grid; place-items: center; margin-bottom: 16px;
  color: var(--green); background: #dcf0e6; border-radius: 24px;
}
.nd-state h2 { margin: 0 0 8px; font-size: 22px; font-weight: 800; }
.nd-state p { margin: 0 0 22px; max-width: 420px; font-size: 14.5px; line-height: 1.7; color: var(--muted); }
.nd-state-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }

/* ---------- Phone ---------- */
@media (max-width: 639px) {
  .nd-share-btn span { display: none; }
  .nd-share-btn { width: 40px; padding: 0; justify-content: center; }
}

/* ---------- Tablet ---------- */
@media (min-width: 640px) {
  .nd-bar-in { padding: 0 24px; }
  .nd-head { padding-top: 36px; }
  .nd-title { font-size: 34px; margin: 18px 0 24px; }
  .nd-cover { padding: 0 24px; margin-top: 30px; }
  .nd-cover img { border-radius: 26px; }
  .nd-body { padding-top: 36px; }
  .nd-related-in { padding: 0 24px; }
}

/* ---------- Desktop ---------- */
@media (min-width: 1024px) {
  .nd-head { padding-top: 48px; max-width: 800px; }
  .nd-title { font-size: 42px; line-height: 1.32; letter-spacing: -0.5px; }
  .nd-cover img { border-radius: 32px; box-shadow: 0 30px 50px -30px rgba(0,55,38,.5); }
  .nd-body { padding-top: 44px; }
  .nd-related { padding: 54px 0 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .nd-page *, .nd-page *::before, .nd-page *::after {
    animation-duration: .01ms !important; transition-duration: .01ms !important;
  }
}
`;

export default NewsDetail;
