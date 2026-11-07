import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const Blog = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({ title: String, slug: String }));
const News = mongoose.models.News || mongoose.model('News', new mongoose.Schema({ title: String, slug: String }));

const makeSlug = (text) => {
  if (!text) return 'post-' + Date.now();
  return text.toString().toLowerCase().trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
};

async function fixAllRemaining() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas.');

  const allNews = await News.find();
  for (const n of allNews) {
    if (n.title && n.slug && n.slug.includes('-179')) {
      const clean = makeSlug(n.title);
      const ts = n.slug.split('-').pop();
      const expected = `${clean}-${ts}`;
      if (n.slug !== expected) {
        await News.updateOne({ _id: n._id }, { $set: { slug: expected } });
        console.log(`Updated News slug for: "${n.title}"`);
      }
    }
  }

  const allBlogs = await Blog.find();
  for (const b of allBlogs) {
    if (b.title && b.slug && b.slug.includes('-179')) {
      const clean = makeSlug(b.title);
      const ts = b.slug.split('-').pop();
      const expected = `${clean}-${ts}`;
      if (b.slug !== expected) {
        await Blog.updateOne({ _id: b._id }, { $set: { slug: expected } });
        console.log(`Updated Blog slug for: "${b.title}"`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('✅ Done fixing all remaining slugs.');
}

fixAllRemaining();
