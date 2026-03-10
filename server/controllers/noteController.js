const Note = require('../models/Note');
const { extractText } = require('../services/ocrService');
const { generateExplanation } = require('../services/explanationService');
const path = require('path');

exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image or PDF' });
    }

    const title = req.body.title || `Note - ${new Date().toLocaleDateString()}`;
    const language = req.body.language || 'English';
    const imagePath = req.file.path;

    
    const extractedText = await extractText(imagePath);

    
    const explanationData = await generateExplanation(extractedText, language);

    const note = await Note.create({
      title,
      originalImage: `/uploads/${req.file.filename}`,
      extractedText,
      explanation: explanationData.explanation,
      keyConcepts: explanationData.keyConcepts || [],
      summary: explanationData.summary || '',
      noteLanguage: language
    });

    res.status(201).json({
      note,
      steps: explanationData.steps || [],
      examples: explanationData.examples || []
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error processing note', error: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments({});

    res.json({
      notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    
    const explanationData = await generateExplanation(note.extractedText, note.noteLanguage);

    res.json({
      note,
      steps: explanationData.steps || [],
      examples: explanationData.examples || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const notes = await Note.find({
      $text: { $search: q }
    }).sort({ score: { $meta: 'textScore' } });

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
