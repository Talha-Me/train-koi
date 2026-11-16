import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  source: { type: String, default: 'TrainKoi Desk' },
  thumbnail: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const News = mongoose.models.News || mongoose.model('News', newsSchema);
export default News;
