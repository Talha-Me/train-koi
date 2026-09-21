const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const News = require('../models/News');

// বাংলা ও ইংরেজি সমর্থনকারী নিরাপদ Slug জেনারেটর
const makeSlug = (text) => {
  if (!text) return `post-${Date.now()}`;
  const clean = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // বাংলা ও অন্যান্য ইউনিকোড বর্ণ অক্ষুণ্ণ রাখবে
    .replace(/\s+/g, '-');
  return clean || `post-${Date.now()}`;
};

// --- ADMIN LOGIN API ---
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  const validUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
  const validPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();
  const secretToken = (process.env.ADMIN_SECRET_TOKEN || process.env.ADMIN_SECRET_KEY || 'trainkoi_super_secret_token_2026').trim();

  const inputUser = (username || '').trim();
  const inputPass = (password || '').trim();

  console.log('--- [ADMIN LOGIN ATTEMPT] ---');
  console.log('Received:', { username: inputUser, password: inputPass });
  console.log('Expected:', { validUsername, validPassword });

  if (inputUser === validUsername && inputPass === validPassword) {
    console.log('✅ Login successful');
    return res.json({
      success: true,
      token: secretToken,
      message: 'Login সফল হয়েছে!'
    });
  }

  console.log('❌ Login failed - Invalid credentials');
  return res.status(401).json({ error: 'ভুল ইউজারনেম বা পাসওয়ার্ড!' });
});

// --- ADMIN VERIFICATION MIDDLEWARE ---
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const secretToken = (process.env.ADMIN_SECRET_TOKEN || process.env.ADMIN_SECRET_KEY || 'trainkoi_super_secret_token_2026').trim();

  if (!authHeader) {
    return res.status(403).json({ error: 'Token পাওয়া যায়নি! অনুগ্রহ করে লগইন করুন।' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (token && token.trim() === secretToken) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized access! Token invalid.' });
  }
};


// ==========================================
// --- BLOG APIs ---
// ==========================================

// সব Blog দেখা (নতুন পোস্ট সবার উপরে)
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Blog পড়া (Views সংখ্যা বাড়বে)
router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog পাওয়া যায়নি' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Blog তৈরি করা (Protected)
router.post('/blogs/create', verifyAdmin, async (req, res) => {
  try {
    const { title, content, thumbnail, author, category } = req.body;
    const generatedSlug = `${makeSlug(title)}-${Date.now()}`;
    const newBlog = new Blog({
      title,
      slug: generatedSlug,
      content,
      category: category || 'ভ্রমণ গাইড',
      author: author || 'TrainKoi Team',
      thumbnail: thumbnail || '',
      views: 0
    });
    await newBlog.save();
    console.log('✅ Blog saved:', newBlog._id);
    res.status(201).json({ message: 'Blog সফলভাবে পোস্ট হয়েছে!', blog: newBlog });
  } catch (err) {
    console.error('❌ Blog Save Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Blog ডিলিট করা (Protected)
router.delete('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog খুঁজে পাওয়া যায়নি!' });
    }
    console.log('🗑️ Blog deleted:', req.params.id);
    res.json({ success: true, message: 'Blog সফলভাবে ডিলিট হয়েছে!' });
  } catch (err) {
    console.error('❌ Blog Delete Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- NEWS APIs ---
// ==========================================

// সব News দেখা (নতুন সংবাদ সবার উপরে)
router.get('/news', async (req, res) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 });
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single News পড়া
router.get('/news/:slug', async (req, res) => {
  try {
    const newsItem = await News.findOne({ slug: req.params.slug });
    if (!newsItem) return res.status(404).json({ message: 'News পাওয়া যায়নি' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// News তৈরি করা (Protected)
router.post('/news/create', verifyAdmin, async (req, res) => {
  try {
    const { title, content, source, thumbnail } = req.body;
    const generatedSlug = `${makeSlug(title)}-${Date.now()}`;
    const newNews = new News({
      title,
      slug: generatedSlug,
      content,
      source: source || 'TrainKoi Desk',
      thumbnail: thumbnail || ''
    });
    await newNews.save();
    console.log('✅ News saved:', newNews._id);
    res.status(201).json({ message: 'News সফলভাবে পোস্ট হয়েছে!', news: newNews });
  } catch (err) {
    console.error('❌ News Save Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// News ডিলিট করা (Protected)
router.delete('/news/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ error: 'News খুঁজে পাওয়া যায়নি!' });
    }
    console.log('🗑️ News deleted:', req.params.id);
    res.json({ success: true, message: 'News সফলভাবে ডিলিট হয়েছে!' });
  } catch (err) {
    console.error('❌ News Delete Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;