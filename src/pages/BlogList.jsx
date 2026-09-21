import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Calendar, Clock, ArrowUpRight,
  BookOpen, Sparkles, RefreshCw, Compass, WifiOff, Newspaper
} from 'lucide-react';

const FALLBACK_IMG = '/homeimg.png';

const stripHtml = (text = '') => text.replace(/<[^>]+>/g, '').trim();

const excerpt = (text, len) => {
  const clean = stripHtml(text);
  if (!clean) return '';
  return clean.length > len ? clean.slice(0, len) + '...' : clean;
};

const formatDate = (value, long = false) =>
  new Date(value || Date.now()).toLocaleDateString(
    'bn-BD',
    long ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short' }
  );

const readMinutes = (text) => {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 160)).toLocaleString('bn-BD');
};

const useMedia = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, [query]);
  return matches;
};

const onImgError = (e) => {
  if (!e.currentTarget.src.endsWith(FALLBACK_IMG)) e.currentTarget.src = FALLBACK_IMG;
};

/* ---------- Card: list-row on phone, vertical card on tablet/desktop ---------- */
const Card = ({ blog, onOpen, onKey }) => {
  const cat = blog.category || 'ভ্রমণ টিপস';
  return (
    <article
      className="bl-card"
      role="link"
      tabIndex={0}
      onClick={() => onOpen(blog)}
      onKeyDown={(e) => onKey(e, blog)}
    >
      <div className="bl-card-media">
        <img src={blog.thumbnail || FALLBACK_IMG} alt={blog.title} loading="lazy" onError={onImgError} />
        <span className="bl-card-chip">{cat}</span>
      </div>

      <div className="bl-card-body">
        <span className="bl-card-cat">{cat}</span>
        <h4 className="bl-card-title">{blog.title}</h4>
        <p className="bl-card-text">{excerpt(blog.content, 100)}</p>

        <div className="bl-card-foot">
          <span className="bl-meta"><Calendar size={13} /> {formatDate(blog.createdAt)}</span>
          <span className="bl-meta"><Clock size={13} /> {readMinutes(blog.content)} মিনিট</span>
          <span className="bl-card-cta">পড়ুন <ArrowUpRight size={14} /></span>
        </div>
      </div>
    </article>
  );
};

/* ---------- Compact item for desktop side panel ---------- */
const MiniItem = ({ blog, onOpen, onKey }) => (
  <article
    className="bl-mini"
    role="link"
    tabIndex={0}
    onClick={() => onOpen(blog)}
    onKeyDown={(e) => onKey(e, blog)}
  >
    <img src={blog.thumbnail || FALLBACK_IMG} alt={blog.title} loading="lazy" onError={onImgError} />
    <div className="bl-mini-body">
      <span className="bl-card-cat">{blog.category || 'ভ্রমণ টিপস'}</span>
      <h4>{blog.title}</h4>
      <span className="bl-meta bl-mini-meta">
        <Calendar size={12} /> {formatDate(blog.createdAt)}
      </span>
    </div>
  </article>
);

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const isDesktop = useMedia('(min-width: 1024px)');

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://api.trainkoi.com';

  const fetchBlogs = () => {
    setLoading(true);
    setError(false);
    fetch(`${API_BASE_URL}/api/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Blog fetch error:', err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = ['সব', ...new Set(blogs.map((blog) => blog.category || 'ভ্রমণ টিপস'))];

  const filteredBlogs = selectedCategory === 'সব'
    ? blogs
    : blogs.filter((blog) => (blog.category || 'ভ্রমণ টিপস') === selectedCategory);

  const openBlog = (blog) => navigate(`/blog/${blog.slug || blog._id}`);

  const onKey = (e, blog) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBlog(blog);
    }
  };

  const featured = filteredBlogs[0];
  const rest = filteredBlogs.slice(1);
  const asideItems = isDesktop ? rest.slice(0, 3) : [];
  const gridItems = isDesktop ? rest.slice(3) : rest;

  return (
    <div className="bl-page">
      <style>{css}</style>

      {/* Masthead */}
      <div className="bl-mast">
        <div className="bl-mast-inner">
          <div className="bl-mast-top">
            <button className="bl-icon-btn" onClick={() => navigate(-1)} aria-label="Back">
              <ChevronLeft size={22} />
            </button>
            <button className="bl-refresh" onClick={fetchBlogs} aria-label="রিফ্রেশ">
              <RefreshCw size={15} className={loading ? 'bl-spin' : ''} />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          <h1 className="bl-title">রেলওয়ে ব্লগ ও ভ্রমণ গাইড</h1>
          <p className="bl-subtitle">
            <Sparkles size={15} /> ট্রেন ভ্রমণের নিখুঁত পরামর্শ ও অভিজ্ঞতা
          </p>
        </div>
        <div className="bl-track" aria-hidden="true" />
      </div>

      {/* Sticky category bar */}
      {categories.length > 1 && (
        <div className="bl-catbar">
          <div className="bl-cats" role="tablist" aria-label="Categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`bl-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="bl-main">
        {loading ? (
          <>
            <div className={`bl-top ${isDesktop ? 'has-aside' : ''}`}>
              <div className="bl-skel bl-skel-hero" />
              {isDesktop && <div className="bl-skel bl-skel-aside" />}
            </div>
            <div className="bl-list" style={{ marginTop: 28 }}>
              {[0, 1, 2].map((i) => <div key={i} className="bl-skel bl-skel-card" />)}
            </div>
          </>
        ) : error ? (
          <div className="bl-state">
            <div className="bl-state-icon is-error"><WifiOff size={30} /></div>
            <h3>ব্লগ লোড করা যায়নি</h3>
            <p>ব্যাকএন্ড সংযোগ পরীক্ষা করুন।</p>
            <button className="bl-primary-btn" onClick={fetchBlogs}>পুনরায় চেষ্টা করুন</button>
          </div>
        ) : featured ? (
          <>
            <div className={`bl-top ${asideItems.length ? 'has-aside' : ''}`}>
              {/* Featured */}
              <article
                className="bl-hero"
                role="link"
                tabIndex={0}
                onClick={() => openBlog(featured)}
                onKeyDown={(e) => onKey(e, featured)}
              >
                <img
                  className="bl-hero-img"
                  src={featured.thumbnail || FALLBACK_IMG}
                  alt={featured.title}
                  onError={onImgError}
                />
                <div className="bl-hero-shade" />
                <span className="bl-hero-chip">{featured.category || 'ফিচার্ড গাইড'}</span>

                <div className="bl-hero-body">
                  <h2 className="bl-hero-title">{featured.title}</h2>
                  <p className="bl-hero-text">{excerpt(featured.content, 150)}</p>

                  <div className="bl-hero-meta">
                    <span className="bl-meta"><Calendar size={14} /> {formatDate(featured.createdAt, true)}</span>
                    <span className="bl-meta"><Clock size={14} /> {readMinutes(featured.content)} মিনিট পাঠ</span>
                    <span className="bl-hero-cta">সম্পূর্ণ পড়ুন <ArrowUpRight size={16} /></span>
                  </div>
                </div>
              </article>

              {/* Desktop side panel */}
              {asideItems.length > 0 && (
                <aside className="bl-aside">
                  <h3 className="bl-aside-head"><Newspaper size={18} /> সাম্প্রতিক লেখা</h3>
                  {asideItems.map((blog) => (
                    <MiniItem key={blog._id || blog.slug} blog={blog} onOpen={openBlog} onKey={onKey} />
                  ))}
                </aside>
              )}
            </div>

            {gridItems.length > 0 && (
              <>
                <div className="bl-section-head">
                  <h3><Compass size={20} /> অন্যান্য ভ্রমণ প্রতিবেদন</h3>
                  <span className="bl-count">{gridItems.length.toLocaleString('bn-BD')}টি</span>
                </div>

                <div className="bl-list">
                  {gridItems.map((blog) => (
                    <Card key={blog._id || blog.slug} blog={blog} onOpen={openBlog} onKey={onKey} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bl-state">
            <div className="bl-state-icon"><BookOpen size={30} /></div>
            <h3>আপাতত কোনো ব্লগ পাওয়া যায়নি</h3>
            <p>অ্যাডমিন প্যানেল থেকে নতুন ব্লগ পাবলিশ করলে তা এখানে দৃশ্যমান হবে।</p>
          </div>
        )}
      </main>
    </div>
  );
};

const css = `
.bl-page {
  --ink: #0f1f1a;
  --muted: #5d6f68;
  --faint: #8a9a94;
  --green: #006a4e;
  --green-deep: #003726;
  --mint: #6ee7b7;
  --line: #e2ebe7;
  --bg: #f3f7f5;
  --surface: #ffffff;
  background: var(--bg);
  min-height: 100vh;
  padding-bottom: 70px;
  font-family: 'Hind Siliguri', sans-serif;
  color: var(--ink);
}
.bl-page *, .bl-page *::before, .bl-page *::after { box-sizing: border-box; }
.bl-page button { font-family: inherit; }
.bl-page :focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }
.bl-meta { display: inline-flex; align-items: center; gap: 5px; }

/* ---------- Masthead ---------- */
.bl-mast {
  background:
    radial-gradient(520px 220px at 88% -10%, rgba(110, 231, 183, .24), transparent 70%),
    linear-gradient(135deg, #005a40 0%, #002a1d 100%);
  color: #fff;
}
.bl-mast-inner { max-width: 1120px; margin: 0 auto; padding: 16px 18px 20px; }
.bl-mast-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.bl-icon-btn {
  width: 40px; height: 40px; display: grid; place-items: center;
  color: #fff; background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.18); border-radius: 14px; cursor: pointer;
  transition: background .15s, transform .15s;
}
.bl-icon-btn:hover { background: rgba(255,255,255,.22); }
.bl-icon-btn:active { transform: scale(.94); }
.bl-refresh {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 13px; font-size: 12.5px; font-weight: 700; color: #fff;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
  border-radius: 12px; cursor: pointer; transition: background .15s;
}
.bl-refresh:hover { background: rgba(255,255,255,.22); }
.bl-spin { animation: bl-spin 1s linear infinite; }
@keyframes bl-spin { to { transform: rotate(360deg); } }
.bl-title {
  margin: 0; font-size: 25px; font-weight: 800; line-height: 1.3; letter-spacing: -0.3px;
}
.bl-subtitle {
  margin: 8px 0 0; display: flex; align-items: center; gap: 7px;
  font-size: 13.5px; color: #a7f3d0;
}
/* railway track strip */
.bl-track {
  height: 14px;
  background:
    linear-gradient(rgba(255,255,255,.38), rgba(255,255,255,.38)) 0 3px / 100% 2px no-repeat,
    linear-gradient(rgba(255,255,255,.38), rgba(255,255,255,.38)) 0 9px / 100% 2px no-repeat,
    repeating-linear-gradient(90deg, rgba(255,255,255,.16) 0 4px, transparent 4px 20px);
}

/* ---------- Sticky category bar ---------- */
.bl-catbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(243, 247, 245, .85);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  backdrop-filter: saturate(160%) blur(16px);
  border-bottom: 1px solid var(--line);
}
.bl-cats {
  max-width: 1120px; margin: 0 auto; padding: 11px 18px;
  display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
}
.bl-cats::-webkit-scrollbar { display: none; }
.bl-pill {
  flex: none; padding: 7px 17px; border-radius: 999px;
  font-size: 13px; font-weight: 700; white-space: nowrap; cursor: pointer;
  color: var(--muted); background: var(--surface); border: 1px solid var(--line);
  transition: background .18s, color .18s, border-color .18s;
}
.bl-pill:hover { border-color: var(--green); color: var(--green); }
.bl-pill.is-active { background: var(--green-deep); border-color: var(--green-deep); color: #fff; }

/* ---------- Main ---------- */
.bl-main { max-width: 1120px; margin: 0 auto; padding: 20px 16px; }
.bl-top { display: grid; gap: 22px; grid-template-columns: minmax(0, 1fr); }

/* ---------- Featured ---------- */
.bl-hero {
  position: relative; overflow: hidden; cursor: pointer;
  height: 380px; border-radius: 26px; background: var(--green-deep);
  display: flex; align-items: flex-end;
  box-shadow: 0 22px 40px -22px rgba(0, 55, 38, .6);
  animation: bl-rise .5s ease both;
}
@keyframes bl-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.bl-hero-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; transition: transform .7s ease;
}
.bl-hero:hover .bl-hero-img { transform: scale(1.04); }
.bl-hero-shade {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,20,14,.1) 0%, rgba(0,20,14,.4) 42%, rgba(0,30,21,.94) 100%);
}
.bl-hero-chip {
  position: absolute; top: 16px; left: 16px;
  padding: 6px 15px; border-radius: 999px;
  font-size: 12.5px; font-weight: 700; color: #fff;
  background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.28);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
}
.bl-hero-body { position: relative; width: 100%; padding: 20px; color: #fff; }
.bl-hero-title {
  margin: 0 0 8px; font-size: 22px; font-weight: 800; line-height: 1.35; letter-spacing: -0.2px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.bl-hero-text {
  margin: 0 0 16px; font-size: 13.5px; line-height: 1.7; color: rgba(255,255,255,.82);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.bl-hero-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px;
  padding-top: 14px; border-top: 1.5px dashed rgba(255,255,255,.3); font-size: 12.5px;
}
.bl-hero-meta .bl-meta { color: rgba(255,255,255,.78); }
.bl-hero-cta {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 8px 16px; border-radius: 999px; font-weight: 800; font-size: 13px;
  color: var(--green-deep); background: var(--mint); transition: gap .2s, background .2s;
}
.bl-hero:hover .bl-hero-cta { gap: 8px; background: #a7f3d0; }

/* ---------- Desktop side panel ---------- */
.bl-aside {
  display: flex; flex-direction: column; gap: 6px; padding: 18px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 26px;
}
.bl-aside-head {
  margin: 0 0 6px; display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 800;
}
.bl-aside-head svg { color: var(--green); }
.bl-mini {
  flex: 1; display: grid; grid-template-columns: 92px 1fr; gap: 14px; align-items: center;
  padding: 10px; border-radius: 18px; cursor: pointer; transition: background .2s;
}
.bl-mini + .bl-mini { border-top: 1.5px dashed var(--line); border-radius: 0 0 18px 18px; }
.bl-mini:hover { background: #eef6f2; }
.bl-mini img { width: 92px; height: 92px; object-fit: cover; border-radius: 16px; background: #e6eeea; }
.bl-mini-body { min-width: 0; }
.bl-mini h4 {
  margin: 3px 0 6px; font-size: 14.5px; font-weight: 800; line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.bl-mini-meta { font-size: 12px; color: var(--faint); }

/* ---------- Section head ---------- */
.bl-section-head {
  display: flex; align-items: center; justify-content: space-between; margin: 32px 0 14px;
}
.bl-section-head h3 {
  margin: 0; display: flex; align-items: center; gap: 9px; font-size: 18px; font-weight: 800;
}
.bl-section-head h3 svg { color: var(--green); }
.bl-count {
  font-size: 12.5px; font-weight: 700; color: var(--green);
  background: #e3f3ec; padding: 4px 12px; border-radius: 999px;
}

/* ---------- Cards: PHONE = list rows ---------- */
.bl-list { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr); }
.bl-card {
  display: grid; grid-template-columns: 108px minmax(0, 1fr); gap: 14px;
  padding: 10px; cursor: pointer;
  background: var(--surface); border: 1px solid var(--line); border-radius: 22px;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.bl-card:active { transform: scale(.985); }
.bl-card-media {
  position: relative; overflow: hidden; border-radius: 16px;
  aspect-ratio: 1 / 1; background: #e6eeea;
}
.bl-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
.bl-card-chip { display: none; }
.bl-card-body { min-width: 0; display: flex; flex-direction: column; padding: 2px 4px 2px 0; }
.bl-card-cat { font-size: 11.5px; font-weight: 800; color: var(--green); }
.bl-card-title {
  margin: 3px 0 0; font-size: 15px; font-weight: 800; line-height: 1.45; color: var(--ink);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.bl-card-text { display: none; }
.bl-card-foot {
  margin-top: auto; padding-top: 8px; display: flex; align-items: center; gap: 12px;
  font-size: 12px; color: var(--faint);
}
.bl-card-foot .bl-meta:nth-child(2) { display: none; }
.bl-card-cta { display: none; }

/* ---------- Skeleton ---------- */
.bl-skel {
  border-radius: 24px;
  background: linear-gradient(100deg, #e4ece8 30%, #f1f6f3 50%, #e4ece8 70%);
  background-size: 200% 100%; animation: bl-shimmer 1.4s linear infinite;
}
.bl-skel-hero { height: 380px; }
.bl-skel-aside { height: 380px; }
.bl-skel-card { height: 128px; border-radius: 22px; }
@keyframes bl-shimmer { to { background-position: -200% 0; } }

/* ---------- Empty / error ---------- */
.bl-state {
  text-align: center; padding: 56px 24px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 24px;
}
.bl-state-icon {
  width: 68px; height: 68px; margin: 0 auto 14px; display: grid; place-items: center;
  border-radius: 22px; color: var(--green); background: #e3f3ec;
}
.bl-state-icon.is-error { color: #dc2626; background: #fee2e2; }
.bl-state h3 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
.bl-state p { margin: 0; font-size: 14px; color: var(--muted); }
.bl-primary-btn {
  margin-top: 18px; padding: 11px 24px; border: none; border-radius: 12px;
  font-size: 14px; font-weight: 800; color: #fff; background: var(--green);
  cursor: pointer; transition: background .15s;
}
.bl-primary-btn:hover { background: var(--green-deep); }

/* ---------- Phone: hide button label ---------- */
@media (max-width: 639px) {
  .bl-refresh span { display: none; }
  .bl-refresh { padding: 10px; }
}

/* ---------- TABLET: vertical cards, 2 columns ---------- */
@media (min-width: 640px) {
  .bl-main { padding: 26px 24px; }
  .bl-mast-inner { padding: 20px 24px 26px; }
  .bl-title { font-size: 32px; }
  .bl-subtitle { font-size: 15px; }
  .bl-cats { padding: 12px 24px; }
  .bl-hero { height: 440px; border-radius: 30px; }
  .bl-hero-body { padding: 30px; max-width: 760px; }
  .bl-hero-title { font-size: 30px; }
  .bl-hero-text { font-size: 15px; }
  .bl-hero-chip { top: 20px; left: 20px; }

  .bl-list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .bl-card {
    display: flex; flex-direction: column; gap: 0; padding: 0; overflow: hidden; border-radius: 22px;
  }
  .bl-card:hover {
    transform: translateY(-4px); border-color: #c5ddd3;
    box-shadow: 0 18px 30px -18px rgba(0, 55, 38, .4);
  }
  .bl-card:hover .bl-card-media img { transform: scale(1.06); }
  .bl-card-media { border-radius: 0; aspect-ratio: 16 / 10; }
  .bl-card-chip {
    display: block; position: absolute; top: 12px; left: 12px;
    padding: 4px 12px; border-radius: 999px; font-size: 11.5px; font-weight: 700; color: var(--green-deep);
    background: rgba(255,255,255,.92);
    -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  }
  .bl-card-cat { display: none; }
  .bl-card-body { padding: 18px 18px 16px; }
  .bl-card-title { margin: 0 0 8px; font-size: 17px; -webkit-line-clamp: 2; }
  .bl-card-text {
    display: -webkit-box; margin: 0 0 16px; font-size: 13.5px; line-height: 1.7; color: var(--muted);
    -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }
  .bl-card-foot { padding-top: 13px; border-top: 1.5px dashed var(--line); font-size: 12.5px; }
  .bl-card-foot .bl-meta:nth-child(2) { display: inline-flex; }
  .bl-card-cta {
    display: inline-flex; align-items: center; gap: 2px; margin-left: auto;
    font-weight: 800; color: var(--green); transition: gap .2s;
  }
  .bl-card:hover .bl-card-cta { gap: 6px; }
  .bl-skel-card { height: 320px; }
}

/* ---------- DESKTOP: magazine layout ---------- */
@media (min-width: 1024px) {
  .bl-mast-inner { padding: 26px 32px 40px; }
  .bl-title { font-size: 44px; letter-spacing: -0.6px; }
  .bl-subtitle { margin-top: 12px; font-size: 16px; }
  .bl-cats { padding: 14px 32px; }
  .bl-main { padding: 34px 32px; }

  .bl-top.has-aside {
    grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
    align-items: stretch;
  }
  .bl-hero { height: 100%; min-height: 520px; }
  .bl-hero-body { padding: 38px; }
  .bl-hero-title { font-size: 36px; line-height: 1.3; letter-spacing: -0.4px; }
  .bl-hero-text { font-size: 16px; }
  .bl-skel-hero, .bl-skel-aside { height: 520px; }

  .bl-section-head { margin: 46px 0 20px; }
  .bl-section-head h3 { font-size: 21px; }
  .bl-list { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .bl-page *, .bl-page *::before, .bl-page *::after {
    animation-duration: .01ms !important; transition-duration: .01ms !important;
  }
}
`;

export default BlogList;