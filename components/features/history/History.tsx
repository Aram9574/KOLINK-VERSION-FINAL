
import React from 'react';
import { AppLanguage, Post } from '../../../types';
import { Clock, ChevronRight, Sparkles, Copy, Trash2 } from 'lucide-react';
import { translations } from '../../../translations';

interface HistoryProps {
  posts: Post[];
  onSelect: (post: Post) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  selectedId?: string;
  language?: AppLanguage;
}

const History: React.FC<HistoryProps> = ({ posts, onSelect, onDelete, selectedId, language = 'en' }) => {

  const t = translations[language].app.history;

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    // In a real app, show a toast here
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t.empty}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">{t.title}</h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelect(post)}
            className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md
                ${selectedId === post.id
                ? 'bg-white border-brand-500 ring-1 ring-brand-500 shadow-sm'
                : 'bg-white border-slate-200/60/60 hover:border-brand-300'
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase">
                  {post.params.tone.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => copyToClipboard(post.content, e)}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title={t.copy}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => onDelete(post.id, e)}
                  className="p-1.5 hover:bg-red-50 rounded text-red-500" title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-700 font-medium line-clamp-2 mb-2 leading-snug">
              {post.params.topic}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span>{post.params.framework.split(' ')[0]}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === post.id ? 'text-brand-600 translate-x-1' : 'text-slate-300'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
