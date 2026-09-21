import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Calendar, Clock, Eye, Share2, Check, Type,
  ArrowUpRight, SearchX, ArrowLeft
} from 'lucide-react';

const FALLBACK_IMG = '/homeimg.png';
const FONT_SIZES = [16.5, 18, 20];

const stripHtml = (text = '') => text.replace(/<[^>]+>/g, '').trim();

const formatDate = (value, long = true) =>
  new Date(value || Date.now()).toLocaleDateString(
    'bn-BD',
    long ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short' }
  );

const readMinutes = (text) => {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 160)).toLocaleString('bn-BD');
};

const onImgError = (e) => {
  if (!e.currentTarget.src.endsWith(FALLBACK_IMG)) e.currentTarget.src = FALLBACK_IMG;
};

/*
  Content ke sundor block e vag kore:
  - faka line diye alada paragraph
  - "## " / "# " / "### " diye shuru hole heading
  - "- " / "• " diye shuru hole bullet list
  - "> " diye shuru hole quote
  Sadharon text hole shudhu paragraph hisebe dekhabe.
*/
const parseBlocks = (text = '') => {
  const blocks = [];
  const chunks = text.replace(/\r\n/g, '\n').split(/\n{2,}/);

  chunks.forEach((chunk) => {
    let c = chunk.trim();
    if (!c) return;

    const headingMatch = c.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length === 3 ? 3 : 2;
      const lines = c.split('\n');
      blocks.push({ type: 'h', level, text: lines[0].replace(/^#{1,3}\s+/, '') });
      c = lines.slice(1).join('\n').trim();
      if (!c) return;
    }

    const lines = c.split('\n');
    if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
      blocks.push({ type: 'ul', items: lines.map((l) => l.replace(/^\s*[-•*]\s+/, '')) });
    } else if (lines.every((l) => /^>\s?/.test(l))) {
      blocks.push({ type: 'quote', text: lines.map((l) => l.replace(/^>\s?/, '')).join('\n') });
    } else {
      blocks.push({ type: 'p', text: c });
    }
  });

  return blocks;
};

const BlogDetails = () => {
  // URL theke slug ba id — router e jei naam-i thakuk
  const params = useParams();
  const rawKey = params.slug || params.id;
  const key = useMemo(() => {
    try { return decodeURIComponent(rawKey || ''); } catch { return rawKey || ''; }
  }, [rawKey]);

  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [showBarTitle, setShowBarTitle] = useState(false);

  const articleRef = useRef(null);
  const progressRef = useRef(null);

  const isLocal = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// api.trainkoi.com এর বদলে সরাসরি আপনার Render ব্যাকএন্ড লিঙ্ক দিন:
const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://train-koi.onrender.com';
  /* ---------- Load blog (direct -> fallback to list lookup) ---------- */
  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    window.scrollTo(0, 0);
    setLoading(true);
    setBlog(null);

    const getJson = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    };

    (async () => {
      let list = [];
      try {
        const data = await getJson(`${API_BASE_URL}/api/blogs`);
        list = Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('Blog list fetch error:', err);
      }

      let found = null;
      try {
        const data = await getJson(`${API_BASE_URL}/api/blogs/${encodeURIComponent(key)}`);
        found = data && data.title ? data : (data && data.blog) || null;
      } catch (err) {
        console.error('Direct blog fetch failed, trying list lookup:', err);
      }

      // Fallback: list theke slug ba _id diye khuje ber kora
      if (!found || !found.title) {
        found = list.find((b) => b.slug === key || b._id === key) || null;
      }

      if (cancelled) return;

      setBlog(found);
      if (found) {
        const currentId = found._id || found.slug;
        const others = list.filter((b) => (b._id || b.slug) !== currentId);
        others.sort((a, b) => {
          const aSame = (a.category || '') === (found.category || '') ? 0 : 1;
          const bSame = (b.category || '') === (found.category || '') ? 0 : 1;
          return aSame - bSame;
        });
        setRelated(others.slice(0, 3));
      } else {
        setRelated([]);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [key, API_BASE_URL]);

  /* ---------- Reading progress ---------- */
  useEffect(() => {
    if (!blog) return undefined;
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
      setShowBarTitle(window.scrollY > 280);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [blog]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: blog ? blog.title : 'TrainKoi ব্লগ', url });
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

  const openBlog = (b) => navigate(`/blog/${b.slug || b._id}`);
  const onKey = (e, b) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBlog(b);
    }
  };

  const blocks = useMemo(() => (blog ? parseBlocks(blog.content) : []), [blog]);
  const author = (blog && blog.author) || 'TrainKoi টিম';
  const initial = Array.from(author.trim())[0] || 'T';

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="bd-page">
        <style>{css}</style>
        <div className="bd-bar">
          <div className="bd-bar-in">
            <button className="bd-icon-btn" onClick={() => navigate(-1)} aria-label="Back">
              <ChevronLeft size={20} />
            </button>
            <div className="bd-bar-mid"><span className="bd-brand">TrainKoi ব্লগ</span></div>
            <span style={{ width: 40 }} />
          </div>
        </div>
        <div className="bd-wrap" style={{ paddingTop: 32 }}>
          <div className="bd-skel" style={{ width: 90, height: 26, borderRadius: 999 }} />
          <div className="bd-skel" style={{ height: 34, marginTop: 18 }} />
          <div className="bd-skel" style={{ height: 34, width: '70%', marginTop: 10 }} />
          <div className="bd-skel" style={{ height: 44, width: 220, marginTop: 24, borderRadius: 999 }} />
        </div>
        <div className="bd-cover"><div className="bd-skel bd-skel-cover" /></div>
        <div className="bd-body">
          {[100, 96, 100, 88, 100, 72].map((w, i) => (
            <div key={i} className="bd-skel" style={{ height: 16, width: `${w}%`, marginBottom: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (!blog) {
    return (
      <div className="bd-page">
        <style>{css}</style>
        <div className="bd-state">
          <div className="bd-state-icon"><SearchX size={32} /></div>
          <h2>ব্লগটি পাওয়া যায়নি</h2>
          <p>এই ব্লগটি হয়তো সরানো হয়েছে অথবা সার্ভার কানেকশনে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।</p>
          <div className="bd-state-actions">
            <button className="bd-btn" onClick={() => window.location.reload()}>আবার চেষ্টা করুন</button>
            <button className="bd-btn is-ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> পূর্বের পেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Article ---------- */
  return (
    <div className="bd-page" style={{ '--fs': `${FONT_SIZES[sizeIdx]}px` }}>
      <style>{css}</style>

      {/* Sticky bar with reading progress */}
      <div className="bd-bar">
        <div className="bd-bar-in">
          <button className="bd-icon-btn" onClick={() => navigate(-1)} aria-label="Back">
            <ChevronLeft size={20} />
          </button>

          <div className="bd-bar-mid">
            <span className={`bd-brand ${showBarTitle ? 'is-hidden' : ''}`}>TrainKoi ব্লগ</span>
            <span className={`bd-bar-title ${showBarTitle ? 'is-shown' : ''}`}>{blog.title}</span>
          </div>

          <div className="bd-bar-actions">
            <button className="bd-icon-btn" onClick={cycleSize} aria-label="লেখার আকার পরিবর্তন করুন" title="লেখার আকার">
              <Type size={18} />
            </button>
            <button className="bd-share-btn" onClick={handleShare} aria-label="শেয়ার">
              {copied ? <><Check size={15} color="#16a34a" /> <span>কপি হয়েছে</span></> : <><Share2 size={15} /> <span>শেয়ার</span></>}
            </button>
          </div>
        </div>
        <div className="bd-progress"><div className="bd-progress-fill" ref={progressRef} /></div>
      </div>

      <article ref={articleRef}>
        {/* Head */}
        <header className="bd-wrap bd-head">
          <span className="bd-cat">{blog.category || 'ভ্রমণ গাইড'}</span>
          <h1 className="bd-title">{blog.title}</h1>

          <div className="bd-meta">
            <div className="bd-author">
              <span className="bd-avatar">{initial}</span>
              <div>
                <strong>{author}</strong>
                <span className="bd-author-sub">লেখক</span>
              </div>
            </div>
            <div className="bd-facts">
              <span className="bd-fact"><Calendar size={14} /> {formatDate(blog.createdAt)}</span>
              <span className="bd-fact"><Clock size={14} /> {readMinutes(blog.content)} মিনিট পাঠ</span>
              {blog.views !== undefined && (
                <span className="bd-fact"><Eye size={14} /> {Number(blog.views).toLocaleString('bn-BD')} বার পঠিত</span>
              )}
            </div>
          </div>
        </header>

        {/* Cover */}
        {blog.thumbnail && (
          <figure className="bd-cover">
            <img src={blog.thumbnail} alt={blog.title} onError={onImgError} />
          </figure>
        )}

        {/* Body */}
        <div className="bd-body">
          {blocks.map((b, i) => {
            if (b.type === 'h') {
              return b.level === 3
                ? <h3 key={i}>{b.text}</h3>
                : <h2 key={i}>{b.text}</h2>;
            }
            if (b.type === 'ul') {
              return <ul key={i}>{b.items.map((item, j) => <li key={j}>{item}</li>)}</ul>;
            }
            if (b.type === 'quote') {
              return <blockquote key={i}>{b.text}</blockquote>;
            }
            return <p key={i} className={i === 0 && blocks.length > 1 ? 'is-lead' : ''}>{b.text}</p>;
          })}
        </div>
      </article>

      {/* End of article */}
      <section className="bd-end">
        <div className="bd-ticket">
          <p>লেখাটি কাজে লাগলে অন্যদের সাথে শেয়ার করুন</p>
          <button className="bd-btn" onClick={handleShare}>
            {copied ? <><Check size={16} /> কপি হয়েছে</> : <><Share2 size={16} /> শেয়ার করুন</>}
          </button>
        </div>

        <div className="bd-author-card">
          <span className="bd-avatar is-lg">{initial}</span>
          <div>
            <strong>{author}</strong>
            <p>ট্রেন ভ্রমণের পরামর্শ, রুট গাইড আর অভিজ্ঞতা নিয়ে লেখা।</p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bd-related">
          <div className="bd-related-in">
            <h3 className="bd-related-head">আরও পড়ুন</h3>
            <div className="bd-related-row">
              {related.map((b) => (
                <article
                  key={b._id || b.slug}
                  className="bd-rcard"
                  role="link"
                  tabIndex={0}
                  onClick={() => openBlog(b)}
                  onKeyDown={(e) => onKey(e, b)}
                >
                  <div className="bd-rcard-media">
                    <img src={b.thumbnail || FALLBACK_IMG} alt={b.title} loading="lazy" onError={onImgError} />
                  </div>
                  <div className="bd-rcard-body">
                    <span className="bd-rcard-cat">{b.category || 'ভ্রমণ টিপস'}</span>
                    <h4>{b.title}</h4>
                    <div className="bd-rcard-foot">
                      <span className="bd-fact"><Calendar size={13} /> {formatDate(b.createdAt, false)}</span>
                      <span className="bd-rcard-cta">পড়ুন <ArrowUpRight size={14} /></span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="bd-btn is-ghost bd-back-all" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> ব্লগ তালিকায় ফিরে যান
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

const css = `
.bd-page {
  --ink: #0f1f1a;
  --body: #25332e;
  --muted: #5d6f68;
  --faint: #8a9a94;
  --green: #006a4e;
  --green-deep: #003726;
  --mint: #6ee7b7;
  --line: #e2ebe7;
  --bg: #f3f7f5;
  --surface: #ffffff;
  --fs: 18px;
  background: var(--surface);
  min-height: 100vh;
  padding-bottom: 60px;
  font-family: 'Hind Siliguri', sans-serif;
  color: var(--ink);
}
.bd-page *, .bd-page *::before, .bd-page *::after { box-sizing: border-box; }
.bd-page button { font-family: inherit; }
.bd-page :focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }

/* ---------- Top bar ---------- */
.bd-bar {
  position: sticky; top: 0; z-index: 60;
  background: rgba(255, 255, 255, .86);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  backdrop-filter: saturate(160%) blur(16px);
  border-bottom: 1px solid var(--line);
}
.bd-bar-in {
  max-width: 1080px; margin: 0 auto; height: 58px; padding: 0 14px;
  display: flex; align-items: center; gap: 10px;
}
.bd-icon-btn {
  flex: none; width: 40px; height: 40px; display: grid; place-items: center;
  color: var(--green-deep); background: var(--bg);
  border: 1px solid var(--line); border-radius: 13px; cursor: pointer;
  transition: background .15s, color .15s, transform .15s;
}
.bd-icon-btn:hover { background: var(--green); color: #fff; }
.bd-icon-btn:active { transform: scale(.94); }
.bd-bar-mid { position: relative; flex: 1; min-width: 0; height: 24px; }
.bd-brand, .bd-bar-title {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  transition: opacity .25s, transform .25s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bd-brand { font-size: 13.5px; font-weight: 800; color: var(--green); }
.bd-brand.is-hidden { opacity: 0; transform: translateY(-6px); }
.bd-bar-title {
  display: block; text-align: center; line-height: 24px;
  font-size: 14px; font-weight: 700; color: var(--ink);
  opacity: 0; transform: translateY(6px);
}
.bd-bar-title.is-shown { opacity: 1; transform: none; }
.bd-bar-actions { flex: none; display: flex; align-items: center; gap: 8px; }
.bd-share-btn {
  height: 40px; padding: 0 14px; display: flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 700; color: var(--green-deep);
  background: var(--bg); border: 1px solid var(--line); border-radius: 13px; cursor: pointer;
  transition: background .15s, color .15s;
}
.bd-share-btn:hover { background: var(--green); color: #fff; }
.bd-progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 3px; }
.bd-progress-fill {
  height: 100%; transform-origin: left center; transform: scaleX(0);
  background: linear-gradient(90deg, var(--green), var(--mint));
}

/* ---------- Head ---------- */
.bd-wrap { max-width: 760px; margin: 0 auto; padding: 0 20px; }
.bd-head { padding-top: 30px; }
.bd-cat {
  display: inline-block; padding: 5px 14px; border-radius: 999px;
  font-size: 12.5px; font-weight: 800; color: #065f46;
  background: #e3f3ec; border: 1px solid #b7e4d0;
}
.bd-title {
  margin: 16px 0 22px; font-size: 27px; font-weight: 800;
  line-height: 1.4; letter-spacing: -0.3px; color: var(--ink);
}
.bd-meta {
  display: flex; flex-direction: column; gap: 14px;
  padding: 16px 0; border-top: 1.5px dashed var(--line); border-bottom: 1.5px dashed var(--line);
}
.bd-author { display: flex; align-items: center; gap: 12px; }
.bd-author strong { display: block; font-size: 15px; font-weight: 800; line-height: 1.3; }
.bd-author-sub { font-size: 12px; color: var(--faint); }
.bd-avatar {
  flex: none; width: 42px; height: 42px; display: grid; place-items: center;
  font-size: 17px; font-weight: 800; color: #fff; border-radius: 50%;
  background: linear-gradient(135deg, var(--green), var(--green-deep));
}
.bd-avatar.is-lg { width: 54px; height: 54px; font-size: 21px; }
.bd-facts { display: flex; flex-wrap: wrap; gap: 8px 16px; }
.bd-fact { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--muted); }
.bd-fact svg { color: var(--green); }

/* ---------- Cover ---------- */
.bd-cover { max-width: 1000px; margin: 26px auto 0; padding: 0; }
.bd-cover img {
  display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover;
  background: #e6eeea;
}
.bd-skel-cover { aspect-ratio: 16 / 9; border-radius: 0; }

/* ---------- Body ---------- */
.bd-body {
  max-width: 700px; margin: 0 auto; padding: 32px 20px 8px;
  font-size: var(--fs); line-height: 2; color: var(--body);
  transition: font-size .2s ease;
}
.bd-body p { margin: 0 0 1.35em; white-space: pre-line; }
.bd-body p.is-lead { font-size: 1.1em; font-weight: 500; color: var(--ink); }
.bd-body h2 {
  margin: 1.9em 0 .6em; padding-left: 14px; font-size: 1.32em; font-weight: 800;
  line-height: 1.45; color: var(--ink); border-left: 4px solid var(--green);
}
.bd-body h3 { margin: 1.6em 0 .5em; font-size: 1.16em; font-weight: 800; line-height: 1.45; color: var(--ink); }
.bd-body ul { margin: 0 0 1.35em; padding: 0; list-style: none; }
.bd-body li { position: relative; padding-left: 26px; margin-bottom: .55em; }
.bd-body li::before {
  content: ''; position: absolute; left: 6px; top: .8em;
  width: 8px; height: 8px; border-radius: 50%; background: var(--green);
}
.bd-body blockquote {
  margin: 1.6em 0; padding: 18px 22px; white-space: pre-line;
  font-weight: 600; color: var(--green-deep);
  background: #eaf6f0; border-radius: 18px;
}

/* ---------- End of article ---------- */
.bd-end { max-width: 700px; margin: 18px auto 0; padding: 0 20px; }
.bd-ticket {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
  padding: 22px 0; border-top: 1.5px dashed var(--line);
}
.bd-ticket p { margin: 0; font-size: 15px; font-weight: 700; color: var(--body); }
.bd-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 22px; font-size: 14px; font-weight: 800; color: #fff;
  background: var(--green); border: 1px solid var(--green); border-radius: 14px; cursor: pointer;
  transition: background .15s, transform .15s;
}
.bd-btn:hover { background: var(--green-deep); }
.bd-btn:active { transform: scale(.97); }
.bd-btn.is-ghost { color: var(--green-deep); background: var(--surface); border-color: var(--line); }
.bd-btn.is-ghost:hover { background: var(--bg); border-color: var(--green); }
.bd-author-card {
  display: flex; align-items: center; gap: 16px; padding: 20px;
  background: var(--bg); border-radius: 22px;
}
.bd-author-card strong { font-size: 16px; font-weight: 800; }
.bd-author-card p { margin: 3px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--muted); }

/* ---------- Related ---------- */
.bd-related { background: var(--bg); margin-top: 48px; padding: 40px 0 34px; }
.bd-related-in { max-width: 1080px; margin: 0 auto; padding: 0 18px; }
.bd-related-head { margin: 0 0 18px; font-size: 20px; font-weight: 800; }
.bd-related-row {
  display: flex; gap: 14px; overflow-x: auto; padding-bottom: 8px;
  scroll-snap-type: x mandatory; scrollbar-width: none;
}
.bd-related-row::-webkit-scrollbar { display: none; }
.bd-rcard {
  flex: none; width: 78%; max-width: 320px; scroll-snap-align: start; cursor: pointer;
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--surface); border: 1px solid var(--line); border-radius: 22px;
  transition: transform .25s ease, box-shadow .25s ease;
}
.bd-rcard:active { transform: scale(.985); }
.bd-rcard-media { aspect-ratio: 16 / 10; overflow: hidden; background: #e6eeea; }
.bd-rcard-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
.bd-rcard-body { display: flex; flex-direction: column; flex: 1; padding: 16px; }
.bd-rcard-cat { font-size: 11.5px; font-weight: 800; color: var(--green); }
.bd-rcard h4 {
  margin: 4px 0 12px; font-size: 15.5px; font-weight: 800; line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.bd-rcard-foot {
  margin-top: auto; padding-top: 11px; border-top: 1.5px dashed var(--line);
  display: flex; align-items: center; justify-content: space-between;
}
.bd-rcard-foot .bd-fact { font-size: 12px; color: var(--faint); }
.bd-rcard-cta { display: inline-flex; align-items: center; gap: 2px; font-size: 13px; font-weight: 800; color: var(--green); }
.bd-back-all { margin-top: 24px; }

/* ---------- Skeleton / states ---------- */
.bd-skel {
  border-radius: 10px;
  background: linear-gradient(100deg, #e4ece8 30%, #f1f6f3 50%, #e4ece8 70%);
  background-size: 200% 100%; animation: bd-shimmer 1.4s linear infinite;
}
@keyframes bd-shimmer { to { background-position: -200% 0; } }
.bd-state {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 24px; background: var(--bg);
}
.bd-state-icon {
  width: 72px; height: 72px; display: grid; place-items: center; margin-bottom: 16px;
  color: var(--green); background: #dcf0e6; border-radius: 24px;
}
.bd-state h2 { margin: 0 0 8px; font-size: 22px; font-weight: 800; }
.bd-state p { margin: 0 0 22px; max-width: 420px; font-size: 14.5px; line-height: 1.7; color: var(--muted); }
.bd-state-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }

/* ---------- Phone tweaks ---------- */
@media (max-width: 639px) {
  .bd-share-btn span { display: none; }
  .bd-share-btn { width: 40px; padding: 0; justify-content: center; }
}

/* ---------- Tablet ---------- */
@media (min-width: 640px) {
  .bd-bar-in { padding: 0 24px; }
  .bd-head { padding-top: 44px; }
  .bd-title { font-size: 36px; margin: 18px 0 26px; }
  .bd-meta { flex-direction: row; align-items: center; justify-content: space-between; }
  .bd-cover { padding: 0 24px; margin-top: 34px; }
  .bd-cover img { border-radius: 26px; }
  .bd-body { padding-top: 42px; }
  .bd-related-in { padding: 0 24px; }
  .bd-rcard { width: 320px; }
}

/* ---------- Desktop ---------- */
@media (min-width: 1024px) {
  .bd-head { padding-top: 56px; max-width: 800px; }
  .bd-title { font-size: 46px; line-height: 1.32; letter-spacing: -0.6px; }
  .bd-cover { margin-top: 42px; }
  .bd-cover img { border-radius: 32px; box-shadow: 0 30px 50px -30px rgba(0, 55, 38, .5); }
  .bd-body { padding-top: 52px; }
  .bd-related { padding: 54px 0 44px; }
  .bd-related-row { overflow: visible; gap: 22px; }
  .bd-rcard { flex: 1 1 0; width: auto; max-width: none; }
  .bd-rcard:hover {
    transform: translateY(-4px); border-color: #c5ddd3;
    box-shadow: 0 18px 30px -18px rgba(0, 55, 38, .4);
  }
  .bd-rcard:hover .bd-rcard-media img { transform: scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .bd-page *, .bd-page *::before, .bd-page *::after {
    animation-duration: .01ms !important; transition-duration: .01ms !important;
  }
}
`;

export default BlogDetails;