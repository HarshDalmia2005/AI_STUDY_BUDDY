import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '../context/ThemeContext';
import { notesAPI } from '../services/api';
import {
  Upload, FileImage, X, Loader2, Sparkles, CheckCircle2
} from 'lucide-react';

export default function UploadNotesPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('English');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ''));
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image