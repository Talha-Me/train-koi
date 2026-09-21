const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'ব্লগের শিরোনাম আবশ্যক'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'স্লাগ আবশ্যক'],
      unique: true,
      trim: true,
      index: true
    },
    content: {
      type: String,
      required: [true, 'ব্লগের মূল কন্টেন্ট আবশ্যক']
    },
    category: {
      type: String,
      default: 'ভ্রমণ গাইড',
      trim: true
    },
    author: {
      type: String,
      default: 'TrainKoi Team',
      trim: true
    },
    thumbnail: {
      type: String,
      default: ''
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // createdAt এবং updatedAt স্বয়ংক্রিয়ভাবে ম্যানেজ হবে
  }
);

// যদি মডেলটি আগে কম্পাইল হয়ে থাকে তবে সেটি ব্যবহার করবে, নয়তো নতুন তৈরি করবে
module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);