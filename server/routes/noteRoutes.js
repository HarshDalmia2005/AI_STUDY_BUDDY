const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadNote, getNotes, getNoteById, deleteNote, searchNotes } = require('../controllers/noteController');
const auth = require('../middleware/auth');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, WebP) and PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); 

router.post('/upload', auth, upload.single('note'), uploadNote);
router.get('/', auth, getNotes);
router.get('/search', auth, searchNotes);
router.get('/:id', auth, getNoteById);
router.delete('/:id', auth, deleteNote);

module.exports = router;
