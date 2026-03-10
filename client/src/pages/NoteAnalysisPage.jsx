import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { notesAPI, quizAPI } from '../services/api';
import {
  FileText, Brain, Lightbulb, BookOpen, Tag,
  Play, Pause, Volume2, Trash2, Loader2, Languages
} from 'lucide-react';

export default function NoteAnalysisPage() {
  const { id } = useParams();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [steps, setSteps] = useState([]);
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explanation');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    notesAPI.getById(id)
      .then(data => {
        setNote(data.note);
        setSteps(data.steps || []);
        setExamples(data.examples || []);
      })
      .catch(() => navigate('/notes'))
      .finally(() => setLoading(false));
  }, [id]);

  const langOptions = [
    { code: 'en-US', label: 'English' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'bn-IN', label: 'Bengali' },
    { code: 'ta-IN', label: 'Tamil' },
  ];

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const text = note.explanation || note.extractedText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const data = await quizAPI.generate(note._id);
      navigate(`/quiz/${data.quiz._id}`);
    } catch {
      setGeneratingQuiz(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this note?')) {
      await notesAPI.delete(id);
      navigate('/notes');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) return null;

  const tabs = [
    { id: 'explanation', icon: Brain, label: 'Explanation' },
    { id: 'extracted', icon: FileText, label: 'Extracted Text' },
    { id: 'steps', icon: Lightbulb, label: 'Steps' },
    { id: 'examples', icon: BookOpen, label: 'Examples' },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>{note.title}</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
            Created {new Date(note.createdAt).toLocaleDateString()} • {note.noteLanguage}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleGenerateQuiz} disabled={generatingQuiz}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {generatingQuiz ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            Generate Quiz
          </button>
          <button onClick={handleDelete}
            className={`p-2.5 rounded-xl transition-all ${dark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {}
      {note.keyConcepts?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={16} className={dark ? 'text-surface-200/30' : 'text-surface-400'} />
          {note.keyConcepts.map(c => (
            <span key={c} className={`text-xs px-3 py-1.5 rounded-lg font-medium
              ${dark ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-primary-50 text-primary-700'}`}>
              {c}
            </span>
          ))}
        </div>
      )}

      {}
      <div className={`flex items-center gap-4 p-4 rounded-2xl border
        ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
        <button onClick={handleSpeak}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
            ${isPlaying ? 'bg-red-500 text-white' : 'bg-gradient-to-br from-primary-500 to-purple-500 text-white hover:shadow-lg'}`}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="flex-1">
          <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-surface-900'}`}>
            {isPlaying ? 'Playing audio explanation...' : 'Audio Tutor'}
          </p>
          <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
            Listen to AI-generated voice explanation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Languages size={16} className={dark ? 'text-surface-200/30' : 'text-surface-400'} />
          <select value={speechLang} onChange={e => setSpeechLang(e.target.value)}
            className={`text-sm rounded-lg px-3 py-2 outline-none
              ${dark ? 'bg-white/5 border border-white/10 text-white' : 'bg-surface-50 border border-surface-200 text-surface-700'}`}>
            {langOptions.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
        <Volume2 size={18} className={dark ? 'text-surface-200/30' : 'text-surface-400'} />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {}
        <div className={`lg:col-span-2 rounded-2xl border overflow-hidden
          ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          <div className={`px-5 py-3 border-b ${dark ? 'border-primary-800/20' : 'border-surface-200'}`}>
            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-surface-900'}`}>Original Note</p>
          </div>
          <div className="p-4">
            <img src={note.originalImage} alt="Note" className="w-full rounded-xl object-contain max-h-[600px]" />
          </div>
        </div>

        {}
        <div className={`lg:col-span-3 rounded-2xl border
          ${dark ? 'bg-surface-800/50 border-primary-800/20' : 'bg-white border-surface-200'}`}>
          {}
          <div className={`flex overflow-x-auto border-b ${dark ? 'border-primary-800/20' : 'border-surface-200'}`}>
            {tabs.map(({ id: tabId, icon: Icon, label }) => (
              <button key={tabId} onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2
                  ${activeTab === tabId
                    ? `border-primary-500 ${dark ? 'text-primary-400' : 'text-primary-600'}`
                    : `border-transparent ${dark ? 'text-surface-200/40 hover:text-white' : 'text-surface-500 hover:text-surface-700'}`
                  }`}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {}
          <div className="p-6">
            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${dark ? 'text-surface-200/70' : 'text-surface-700'}`}>
                  {note.explanation}
                </div>
                {note.summary && (
                  <div className={`p-4 rounded-xl ${dark ? 'bg-primary-500/5 border border-primary-500/10' : 'bg-primary-50 border border-primary-100'}`}>
                    <p className={`text-xs font-semibold mb-1 ${dark ? 'text-primary-400' : 'text-primary-600'}`}>Summary</p>
                    <p className={`text-sm ${dark ? 'text-surface-200/60' : 'text-surface-600'}`}>{note.summary}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'extracted' && (
              <div className={`text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-xl
                ${dark ? 'bg-surface-900/50 text-surface-200/70' : 'bg-surface-50 text-surface-700'}`}>
                {note.extractedText}
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-3">
                {steps.length > 0 ? steps.map((step, i) => (
                  <div key={i} className={`flex gap-4 p-4 rounded-xl
                    ${dark ? 'bg-surface-900/30' : 'bg-surface-50'}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${dark ? 'text-surface-200/70' : 'text-surface-700'}`}>{step}</p>
                  </div>
                )) : (
                  <p className={`text-sm ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>No steps available</p>
                )}
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-3">
                {examples.length > 0 ? examples.map((ex, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 border-accent-500
                    ${dark ? 'bg-accent-500/5' : 'bg-accent-50'}`}>
                    <p className={`text-sm leading-relaxed ${dark ? 'text-surface-200/70' : 'text-surface-700'}`}>{ex}</p>
                  </div>
                )) : (
                  <p className={`text-sm ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>No examples available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
