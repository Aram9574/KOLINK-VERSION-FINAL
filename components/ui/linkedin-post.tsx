import { cn } from "@/lib/utils";
import { ThumbsUp, MessageCircle, Share2, Send, TrendingUp } from "lucide-react";

interface LinkedInPostProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
  date?: string;
  likes?: number;
  comments?: number;
  className?: string;
  metrics?: {
    value: string;
    label: string;
  };
}

export const LinkedInPost = ({
  name,
  role,
  avatar,
  content,
  date = "1w",
  likes = 42,
  comments = 12,
  className,
  metrics,
}: LinkedInPostProps) => {
  return (
    <div
      className={cn(
        "flex flex-col card-premium overflow-hidden relative",
        className
      )}
    >
        {metrics && (
            <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm z-10 animate-in fade-in slide-in-from-right-4 duration-700">
                <TrendingUp size={12} />
                <span>{metrics.value}</span>
            </div>
        )}

      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border border-slate-100"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate pr-20">
              {name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 truncate max-w-[180px]">{role}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
               🌐 Public
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 mt-2">
        <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
                 <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white z-10">
                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                 </div>
                 <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-white">
                    <div className="text-[6px] text-white font-bold">❤️</div>
                 </div>
            </div>
            <span className="text-xs text-slate-500">{likes}</span>
        </div>
        <span className="text-xs text-slate-500">{comments} comments</span>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button type="button" className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 rounded-lg transition-colors group">
          <ThumbsUp className="w-4 h-4 text-slate-500 group-hover:text-slate-600" />
          <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-600">Like</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 rounded-lg transition-colors group">
          <MessageCircle className="w-4 h-4 text-slate-500 group-hover:text-slate-600" />
          <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-600">Comment</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 rounded-lg transition-colors group">
          <Share2 className="w-4 h-4 text-slate-500 group-hover:text-slate-600" />
          <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-600">Repost</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 rounded-lg transition-colors group">
          <Send className="w-4 h-4 text-slate-500 group-hover:text-slate-600" />
          <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-600">Send</span>
        </button>
      </div>
    </div>
  );
};
