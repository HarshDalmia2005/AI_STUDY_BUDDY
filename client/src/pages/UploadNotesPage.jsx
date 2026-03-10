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
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setStatus('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('note', file);
      formData.append('title', title || file.name);
      formData.append('language', language);

      setProgress(20);
      setStatus('Processing with OCR...');

      const data = await notesAPI.upload(formData);

      setProgress(80);
      setStatus('Generating AI explanation...');

      await new Promise(r => setTimeout(r, 500));
      setProgress(100);
      setStatus('Done!');

      await new Promise(r => setTimeout(r, 800));
      navigate(`/notes/${data.note._id}`);
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean'];

  return (
    <div className={`min-h-screen p-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="text-purple-500" />
            Upload Notes
          </h1>
          <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload an image or PDF of your handwritten notes for AI-powered analysis
          </p>
        </div>

        {uploading ? (
          <div className={`rounded-2xl p-8 text-center ${dark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
            <p className="text-lg font-medium mb-2">{status}</p>
            <div className={`w-full rounded-full h-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm mt-2 text-gray-500">{progress}% complete</p>
          </div>
        ) : (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : file
                  ? 'border-green-500 bg-green-500/5'
                  : dark
                  ? 'border-gray-600 hover:border-purple-500 bg-gray-800/30'
                  : 'border-gray-300 hover:border-purple-500 bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                  ) : (
                    <FileImage className="w-12 h-12 text-green-500" />
                  )}
                  <div className="text-left">
                    <p className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1 mt-1"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your notes here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">or click to browse (Images & PDFs)</p>
                </>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your notes"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    dark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Explanation Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    dark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 ${
                  file
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Analyze Notes with AI
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}