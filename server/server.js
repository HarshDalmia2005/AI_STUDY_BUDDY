const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');


const noteRoutes = require('./routes/noteRoutes');
const quizRoutes = require('./routes/quizRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));



app.use('/api/notes', noteRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  
  try {
    const mongoose = require('mongoose');
    const collection = mongoose.connection.collection('notes');
    
    
    await collection.updateMany(
      { language: { $exists: true } },
      { $rename: { language: 'noteLanguage' } }
    );
    
    
    const indexes = await collection.indexes();
    const textIndex = indexes.find(idx => idx.key && idx.key._fts === 'text');
    if (textIndex && textIndex.language_override !== 'textSearchLang') {
      await collection.dropIndex(textIndex.name);
      console.log('Dropped old text index, new one will be auto-created');
    }
  } catch (e) {  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 MentorMate server running on port ${PORT}`);
    });
  }
});

module.exports = app;
