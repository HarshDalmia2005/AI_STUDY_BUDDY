import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { notesAPI } from '../services/api';
import {
  FileText, Search, Sparkles, Clock, Tag, Trash2
} from 'lucide-react';

export default function NotesListPage() {
  const { dark } = useTheme();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    notesAPI.getAll(1, 50)
      .then(data => setNotes(data.notes || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const data = await notesAPI.search(search);
      setSearchResults(data.notes || []);
    } catch {
      setSearchResults([]);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this note?')) {
      await notesAPI.delete(id);
      setNotes(prev => prev.filter(n => n._id !== id));
    }
  };

  const displayNotes = searchResults !== null ? searchResults : notes;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-surface-900'}`}>
            My <span className="gradient-text">Notes</span>
          </h1>
          <p className={`mt-1 ${dark ? 'text-surface-200/50' : 'text-surface-600'}`}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} processed
          </p>
        </div>
        <Link to="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
          <Sparkles size={16} /> Upload New
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`} />
        <input type="text" value={search}
          onChange={e => { setSearch(e.target.value); if (!e.target.value) setSearchResults(null); }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all
            ${dark ? 'bg-surface-800/50 border border-primary-800/20 text-white placeholder-surface-200/30 focus:border-primary-500/50'
              : 'bg-white border border-surface-200 text-surface-900 placeholder-surface-400 focus:border-primary-500'}`}
          placeholder="Search notes by content or title... (press Enter)" />
      </div>

      {/* Notes Grid */}
      {displayNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayNotes.map((note, i) => (
            <Link key={note._id} to={`/notes/${note._id}`}
              className={`card-hover rounded-2xl border overflow-hidden animate-slide-in group
                ${dark ? 'bg-surface-800/50 border-primary-800/20 hover:border-primary-500/30' : 'bg-white border-surface-200 hover:border-primary-300'}`}
              style={{ animationDelay: `${i * 50}ms` }}>
              {}
              <div className={`h-40 overflow-hidden ${dark ? 'bg-surface-700/50' : 'bg-surface-100'}`}>
                <img src={note.originalImage} alt={note.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className={`font-semibold truncate flex-1 ${dark ? 'text-white' : 'text-surface-900'}`}>{note.title}</h3>
                  <button onClick={(e) => handleDelete(note._id, e)}
                    className={`ml-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all
                      ${dark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={12} className={dark ? 'text-surface-200/30' : 'text-surface-400'} />
                  <p className={`text-xs ${dark ? 'text-surface-200/40' : 'text-surface-500'}`}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {note.keyConcepts?.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    <Tag size={12} className={dark ? 'text-surface-200/20' : 'text-surface-400'} />
                    {note.keyConcepts.slice(0, 3).map(c => (
                      <span key={c} className={`text-xs px-2 py-0.5 rounded-md
                        ${dark ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <p className={`text-xs mt-3 line-clamp-2 ${dark ? 'text-surface-200/30' : 'text-surface-500'}`}>
                  {note.extractedText?.substring(0, 100)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={`text-center py-20 ${dark ? 'text-surface-200/30' : 'text-surface-400'}`}>
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">
            {searchResults !== null ? 'No notes found for your search' : 'No notes yet'}
          </p>
          <p className="text-sm mt-1">Upload your first handwritten note to get started</p>
        </div>
      )}
    </div>
  );
}
