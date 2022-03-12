import mongoose from 'mongoose';

export const privateUrlFields = ['__v', '_id'];

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  date: { type: String, default: Date.now },
});

export default mongoose.model('URL', urlSchema);
