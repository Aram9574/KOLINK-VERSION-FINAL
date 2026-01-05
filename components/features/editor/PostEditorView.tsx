import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  AlignLeft,
  ArrowDown,
  Bold as BoldIcon,
  ChevronDown,
  Code,
  Copy,
  Eraser,
  FileText,
  History,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Monitor,
  Plus,
  Redo,
  RefreshCw,
  Save,
  Search,
  Smartphone,
  Smile,
  Sparkles,
  Strikethrough,
  Trash2,
  Type,
  Underline,
  Undo,
  Zap,
} from "lucide-react";
import { usePosts } from "../../../context/PostContext.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { translations } from "../../../translations.ts";
import { toast } from "sonner";
import { type Post, type AppLanguage } from "../../../types.ts";
import {
  clearUnicodeFormatting,
  convertToUnicode,
} from "../../../utils/unicode.ts";
import {
  createPost,
  createSnippet,
  deleteSnippet,
  fetchSnippets,
  fetchHooks,
  fetchClosures,
  updatePost as updatePostInDb,
} from "../../../services/postRepository.ts";
import { motion } from "framer-motion";
import { hapticFeedback } from "../../../lib/animations.ts";

// Lazy load for performance
// const LinkedInPreview = React.lazy(() => import("../generation/LinkedInPreview"));
import LinkedInPreview from "../generation/LinkedInPreview.tsx";

const PostEditorView: React.FC = () => {
  const { user, language } = useUser();
  const {
    posts,
    addPost: addPostToContext,
    updatePost: updatePostInContext,
    currentPost: contextCurrentPost,
  } = usePosts();
  const t = translations[language as AppLanguage].app.editor;
  const [editorContent, setEditorContent] = useState("");
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<
    "preview" | "hooks" | "endings" | "snippets"
  >("preview");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "mobile",
  );
  const [showMetricsMenu, setShowMetricsMenu] = useState(false);
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [showDraftsMenu, setShowDraftsMenu] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<
    "characters" | "words" | "paragraphs" | "sentences" | "readTime"
  >("characters");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [readTime, setReadTime] = useState("");
  const [grade, setGrade] = useState(1);

  // Persistence: Load from localStorage on mount
  useEffect(() => {
    // Only load if context doesn't have a specific post selected
    if (!contextCurrentPost) {
      const savedContent = localStorage.getItem("kolink_post_editor_content");
      const savedTitle = localStorage.getItem("kolink_post_editor_title");
      if (savedContent) setEditorContent(savedContent);
      if (savedTitle) setPostTitle(savedTitle);
    }
  }, []);

  // Persistence: Save to localStorage on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editorContent) {
        localStorage.setItem("kolink_post_editor_content", editorContent);
      } else {
        localStorage.removeItem("kolink_post_editor_content");
      }
      if (postTitle) {
        localStorage.setItem("kolink_post_editor_title", postTitle);
      } else {
        localStorage.removeItem("kolink_post_editor_title");
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [editorContent, postTitle]);

  // Sync with Context Current Post (from History)
  useEffect(() => {
    if (contextCurrentPost) {
      setEditorContent(contextCurrentPost.content);
      setCurrentPost(contextCurrentPost);
      setPostTitle(contextCurrentPost.params?.topic || "");

      // Also sync to localStorage so if they switch tabs while editing a loaded post, it's saved
      localStorage.setItem(
        "kolink_post_editor_content",
        contextCurrentPost.content,
      );
      localStorage.setItem(
        "kolink_post_editor_title",
        contextCurrentPost.params?.topic || "",
      );
    }
  }, [contextCurrentPost]);

  // Snippets State
  const [snippets, setSnippets] = useState<
    { id: string; text: string; createdAt: number; lastUsed?: number }[]
  >([]);
  const [snippetSearch, setSnippetSearch] = useState("");
  const [selectedEditorText, setSelectedEditorText] = useState("");
  const [snippetSort, setSnippetSort] = useState<
    "newest" | "oldest" | "last_used"
  >("newest");

  // History Context
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const lastCaptureTime = useRef<number>(Date.now());
  const isUndoRedo = useRef(false);

  // History Tracking Effect
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }

    const now = Date.now();
    const isRecent = now - lastCaptureTime.current < 1000;
    const isAtTip = historyIndex === history.length - 1;

    if (isRecent && isAtTip) {
      // Merge into current snapshot (typing)
      setHistory((prev: string[]) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = editorContent;
        return newHistory;
      });
    } else {
      // Push new snapshot
      setHistory((prev: string[]) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(editorContent);
        return newHistory;
      });
      setHistoryIndex((prev: number) => prev + 1);
    }
    lastCaptureTime.current = now;
  }, [editorContent]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditorContent(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditorContent(history[newIndex]);
    }
  };

  // Load snippets from Database
  useEffect(() => {
    if (!user || !user.id) return;
    const loadSnippets = async () => {
      const data = await fetchSnippets(user.id);
      setSnippets(data);
    };
    loadSnippets();
  }, [user]);

  const handleCreateSnippet = async () => {
    if (!selectedEditorText.trim() || !user || !user.id) return;

    const snippet = await createSnippet(user.id, selectedEditorText.trim());
    if (snippet) {
      setSnippets((prev: typeof snippets) => [snippet, ...prev]);
      setSelectedEditorText("");
      toast.success(
        language === "es" ? "Fragmento guardado" : "Snippet saved",
      );
    } else {
      toast.error(
        language === "es"
          ? "Error al guardar fragmento"
          : "Error saving snippet",
      );
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    const success = await deleteSnippet(id);
    if (success) {
      setSnippets((prev: typeof snippets) => prev.filter((s) => s.id !== id));
      toast.success(
        language === "es" ? "Fragmento eliminado" : "Snippet deleted",
      );
    } else {
      toast.error(
        language === "es"
          ? "Error al eliminar fragmento"
          : "Error deleting snippet",
      );
    }
  };

  const handleEditorSelect = () => {
    const selectionStart = editorRef.current?.selectionStart || 0;
    const selectionEnd = editorRef.current?.selectionEnd || 0;
    const text = editorContent.substring(selectionStart, selectionEnd);
    setSelectedEditorText(text);
  };

  const handleInjectSnippet = (snippet: typeof snippets[0]) => {
    injectText("\n\n" + snippet.text);
    const updatedSnippets = snippets.map((s: typeof snippets[0]) =>
      s.id === snippet.id ? { ...s, lastUsed: Date.now() } : s
    );
    setSnippets(updatedSnippets);
  };

  // Hooks & Closures State (Dynamic)
  const [hooksList, setHooksList] = useState<any[]>([]);
  const [closuresList, setClosuresList] = useState<any[]>([]);
  const [shuffledHooks, setShuffledHooks] = useState<any[]>([]);
  const [hookSearch, setHookSearch] = useState("");
  const [selectedHookTag, setSelectedHookTag] = useState("all");
  const [visibleHooksCount, setVisibleHooksCount] = useState(6);

  // Load Library Data
  useEffect(() => {
    const loadLibraries = async () => {
        const hooks = await fetchHooks();
        const closures = await fetchClosures();
        setHooksList(hooks);
        setClosuresList(closures);
        setShuffledHooks(hooks); // Init shuffle with all
        setShuffledEndings(closures); // Init shuffle with all
    };
    loadLibraries();
  }, []);

  // Filter Hooks Effect
  useEffect(() => {
    let filtered = hooksList;
    if (hookSearch) {
        filtered = filtered.filter(h => h.text.toLowerCase().includes(hookSearch.toLowerCase()));
    }
    if (selectedHookTag && selectedHookTag !== "all") {
        filtered = filtered.filter(h => h.tags.includes(selectedHookTag));
    }
    setShuffledHooks(filtered);
  }, [hookSearch, selectedHookTag, hooksList]);


  const [endingSearch, setEndingSearch] = useState("");
  const [selectedEndingTag, setSelectedEndingTag] = useState("all");
  const [visibleEndingsCount, setVisibleEndingsCount] = useState(6);
  const [shuffledEndings, setShuffledEndings] = useState<any[]>([]);

  const handleShuffleEndings = () => {
    const shuffled = [...shuffledEndings].sort(() => Math.random() - 0.5);
    setShuffledEndings(shuffled);
  };

  const allEndingTags = [
    "all",
    ...Array.from(new Set(closuresList.flatMap((e) => e.tags))),
  ];

  const filteredEndings = shuffledEndings.filter((ending) => {
    const matchesSearch = ending.text.toLowerCase().includes(
      endingSearch.toLowerCase(),
    );
    const matchesTag = selectedEndingTag === "all" ||
      ending.tags.includes(selectedEndingTag);
    return matchesSearch && matchesTag;
  });

  const handleShuffleHooks = () => {
    const shuffled = [...shuffledHooks].sort(() => Math.random() - 0.5);
    setShuffledHooks(shuffled);
  };

  const allHookTags = [
    "all",
    ...Array.from(new Set(hooksList.flatMap((h) => h.tags))),
  ];

  const filteredHooks = shuffledHooks.filter((hook) => {
    const matchesSearch = hook.text.toLowerCase().includes(
      hookSearch.toLowerCase(),
    );
    const matchesTag = selectedHookTag === "all" ||
      hook.tags.includes(selectedHookTag);
    return matchesSearch && matchesTag;
  });

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const metricsMenuRef = useRef<HTMLDivElement>(null);
  const gradeInfoRef = useRef<HTMLDivElement>(null);
  const limitWarningRef = useRef<HTMLDivElement>(null);
  const draftsMenuRef = useRef<HTMLDivElement>(null);

  const commonEmojis = ["🔥", "🚀", "💡", "💪", "📈", "✅", "🙌", "✨"];

  useEffect(() => {
    const text = editorContent.trim();
    const chars = editorContent.length;
    const words = text ? text.split(/\s+/).length : 0;
    const paragraphs = text ? text.split(/\n\s*\n/).length : 0;
    const totalSeconds = Math.round(chars / 20.63);
    let timeLabel = "";
    if (totalSeconds < 60) {
      timeLabel = `${totalSeconds} seg`;
    } else {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      timeLabel = s > 0 ? `${m} min ${s} seg` : `${m} min`;
    }

    // For readability formula, we use alphanumeric chars and treat newlines as sentence breaks
    const alphaNumericChars = text.replace(/[^a-zA-Z0-9]/g, "").length;
    const sentences = text
      ? text.split(/[.!?\n]+/).filter((s) => s.trim().length > 0).length
      : 0;

    // Readability logic: "Density" based approach
    // Simple posts should stay Grade 1-3 regardless of length.
    // We only penalize technical density (long words) and run-on sentences.
    let calculatedGrade = 1;
    if (words > 0 && sentences > 0) {
      // In Spanish/Professional contexts, words are ~5 chars long on average.
      // We start penalizing if the average word length exceeds 4.8 chars.
      const avgWordLen = alphaNumericChars / words;
      const wordPenalty = Math.max(0, (avgWordLen - 4.8) * 3.5);

      // Ideal LinkedIn sentences are under 15 words.
      // Penalty starts after 14 words per sentence average.
      const avgSentLen = words / sentences;
      const sentencePenalty = Math.max(0, (avgSentLen - 14) * 0.5);

      calculatedGrade = Math.round(1 + wordPenalty + sentencePenalty);
    }

    // Force bounds for LinkedIn context
    calculatedGrade = Math.max(1, Math.min(14, calculatedGrade));

    setCharCount(chars);
    setWordCount(words);
    setParagraphCount(paragraphs);
    setSentenceCount(sentences);
    setReadTime(timeLabel);
    setGrade(calculatedGrade);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        metricsMenuRef.current &&
        !metricsMenuRef.current.contains(event.target as Node)
      ) {
        setShowMetricsMenu(false);
      }
      if (
        gradeInfoRef.current &&
        !gradeInfoRef.current.contains(event.target as Node)
      ) {
        setShowGradeInfo(false);
      }
      if (
        limitWarningRef.current &&
        !limitWarningRef.current.contains(event.target as Node)
      ) {
        setShowLimitWarning(false);
      }
      if (
        draftsMenuRef.current &&
        !draftsMenuRef.current.contains(event.target as Node)
      ) {
        setShowDraftsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editorContent]);

  const handleFormat = (
    type: "bold" | "italic" | "strike" | "underline" | "code",
  ) => {
    const selectionStart = editorRef.current?.selectionStart || 0;
    const selectionEnd = editorRef.current?.selectionEnd || 0;
    const selectedText = editorContent.substring(
      selectionStart,
      selectionEnd,
    );

    if (!selectedText) {
      toast.error(
        language === "es" ? "Selecciona texto primero" : "Select text first",
      );
      return;
    }

    const formattedText = convertToUnicode(selectedText, type);
    const newContent = editorContent.substring(0, selectionStart) +
      formattedText +
      editorContent.substring(selectionEnd);

    setEditorContent(newContent);
  };

  const injectText = (text: string) => {
    const selectionStart = editorRef.current?.selectionStart || 0;
    const selectionEnd = editorRef.current?.selectionEnd || 0;

    const newContent = editorContent.substring(0, selectionStart) +
      text +
      editorContent.substring(selectionEnd);

    setEditorContent(newContent);
    // Focus back
    setTimeout(() => editorRef.current?.focus(), 10);
  };

  const handleClearFormatting = () => {
    setEditorContent(clearUnicodeFormatting(editorContent));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    toast.success(
      language === "es" ? "Copiado al portapapeles" : "Copied to clipboard",
    );
  };

  const handlePublish = () => {
    navigator.clipboard.writeText(editorContent);
    toast.success(
      language === "es"
        ? "Texto copiado. Pegalo en LinkedIn."
        : "Text copied. Paste it on LinkedIn.",
    );
    globalThis.open("https://www.linkedin.com/feed/", "_blank");
  };

  const handleSave = async () => {
    if (!editorContent.trim()) {
      toast.error(
        language === "es" ? "El post está vacío" : "Post is empty",
      );
      return;
    }

    try {
      if (currentPost && currentPost.id) {
        // Update existing
        const success = await updatePostInDb(currentPost.id, {
          content: editorContent,
          status: "draft",
          params: {
            ...currentPost.params,
            topic: postTitle ||
              (language === "es" ? "Borrador sin título" : "Untitled Draft"),
          },
        });

        if (success) {
          const updatedPost: Post = {
            ...currentPost,
            content: editorContent,
            status: "draft",
            params: {
              ...currentPost.params,
              topic: postTitle ||
                (language === "es" ? "Borrador sin título" : "Untitled Draft"),
            },
          };
          updatePostInContext(updatedPost);
          setCurrentPost(updatedPost);
          localStorage.removeItem("kolink_post_editor_content");
          localStorage.removeItem("kolink_post_editor_title");
          toast.success(
            language === "es" ? "Borrador actualizado" : "Draft updated",
          );
        } else {
          throw new Error("Failed to update");
        }
      } else {
        // Create new
        const createdPost = await createPost({
          userId: user.id,
          content: editorContent,
          status: "draft",
          params: {
            topic: postTitle ||
              (language === "es" ? "Borrador sin título" : "Untitled Draft"),
            audience: "General",
            tone: "Professional",
            framework: "STANDARD",
            length: "MEDIUM",
            creativityLevel: 50,
            emojiDensity: "MODERATE",
            hashtagCount: 3,
            includeCTA: true,
          },
        });

        if (createdPost) {
          addPostToContext(createdPost);
          setCurrentPost(createdPost);
          localStorage.removeItem("kolink_post_editor_content");
          localStorage.removeItem("kolink_post_editor_title");
          toast.success(
            language === "es" ? "Borrador guardado" : "Draft saved",
          );
        } else {
          throw new Error("Failed to create");
        }
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error(
        language === "es"
          ? "Error al guardar el borrador"
          : "Failed to save draft",
      );
    }
  };

  const handleClearEditor = () => {
    if (
      globalThis.confirm(language === "es" ? "¿Borrar todo?" : "Clear all?")
    ) {
      setEditorContent("");
      setPostTitle("");
      setCurrentPost(null);
      localStorage.removeItem("kolink_post_editor_content");
      localStorage.removeItem("kolink_post_editor_title");
    }
  };

  const handleSelectDraft = (post: Post) => {
    setEditorContent(post.content);
    setCurrentPost(post);
    setPostTitle(post.params?.topic || "");
    setShowDraftsMenu(false);
    toast.success(language === "es" ? "Borrador cargado" : "Draft loaded");
  };

  const drafts = posts.filter((p) => p.status === "draft");

  return (
    <div className="flex h-full bg-white overflow-hidden select-none">
      {/* LEFT: Editor Column */}
      <div className="flex-[1.5] flex flex-col min-w-0 border-r border-slate-200/60/60">
        {/* 1. Header Row */}
        <div className="h-14 border-b border-slate-200/60/60 flex items-center justify-between px-6 bg-white shrink-0">
          <input
            type="text"
            value={postTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostTitle(e.target.value)}
            placeholder={t.unsavedDraft}
            className="text-sm text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] outline-none border-b border-transparent hover:border-slate-300 focus:border-brand-500 bg-transparent transition-all placeholder:text-slate-400"
          />
          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              onClick={handleSave}
              {...hapticFeedback}
              className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.saveDraft}
              </span>
            </motion.button>
            <div className="w-px h-4 bg-slate-200" />
            <div className="w-px h-4 bg-slate-200" />
            <div className="relative" ref={draftsMenuRef}>
              <motion.button
                type="button"
                onClick={() => setShowDraftsMenu(!showDraftsMenu)}
                {...hapticFeedback}
                className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t.openDraft}
                </span>
                <ChevronDown
                  className={`w-3 h-3 ml-1 transition-transform ${
                    showDraftsMenu ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {showDraftsMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200/60/60 rounded-xl shadow-xl z-[50] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-slate-200/60/60 bg-slate-50">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t.drafts} ({drafts.length})
                    </h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {drafts.length === 0
                      ? (
                        <div className="p-8 text-center text-slate-400">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            {t.noDrafts}
                          </p>
                        </div>
                      )
                      : (
                        drafts.map((draft: Post) => (
                          <motion.button
                            type="button"
                            key={draft.id}
                            onClick={() =>
                              handleSelectDraft(
                                draft,
                              )}
                            {...hapticFeedback}
                            className="w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                          >
                            <p className="font-medium text-slate-700 text-sm truncate group-hover:text-brand-600 transition-colors">
                              {draft.params
                                ?.topic ||
                                (language ===
                                    "es"
                                  ? "Sin título"
                                  : "Untitled")}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-slate-400 truncate max-w-[150px]">
                                {draft.content
                                  .substring(
                                    0,
                                    30,
                                  )}...
                              </p>
                              <span className="text-[10px] text-slate-300 font-medium">
                                {new Date(
                                  draft
                                    .createdAt,
                                ).toLocaleDateString(
                                  language ===
                                      "es"
                                    ? "es-ES"
                                    : "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </motion.button>
                        ))
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Advanced Toolbar */}
        <div className="h-12 border-b border-slate-200/60/60 flex items-center px-4 bg-white gap-0.5 shrink-0 overflow-x-auto no-scrollbar">
          <motion.button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            {...hapticFeedback}
            className={`p-2 rounded-lg ${
              historyIndex > 0
                ? "text-slate-500 hover:bg-slate-50"
                : "text-slate-300 cursor-not-allowed"
            }`}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            {...hapticFeedback}
            className={`p-2 rounded-lg ${
              historyIndex < history.length - 1
                ? "text-slate-500 hover:bg-slate-50"
                : "text-slate-300 cursor-not-allowed"
            }`}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={handleClearEditor}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            title="Clear All"
          >
            <Eraser className="w-4 h-4" />
          </motion.button>
          <div className="w-px h-6 bg-slate-100 mx-2" />

          <motion.button
            type="button"
            onClick={() => handleFormat("bold")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-brand-600 font-bold"
            title="Bold"
          >
            <BoldIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleFormat("italic")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-brand-600 italic"
            title="Italic"
          >
            <ItalicIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleFormat("strike")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleFormat("underline")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleFormat("code")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={handleClearFormatting}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-300"
            title="Clear Formatting"
          >
            <Type className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-slate-100 mx-2" />
          <motion.button
            type="button"
            onClick={() => injectText("• ")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            <List className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => injectText("1. ")}
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            <ListOrdered className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-slate-100 mx-2" />
          <motion.button
            type="button"
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            <Zap className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 rotate-45"
          >
            <Zap className="w-4 h-4 rotate-45" />
          </motion.button>
          <motion.button
            type="button"
            {...hapticFeedback}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 -rotate-45"
          >
            <Zap className="w-4 h-4 -rotate-45" />
          </motion.button>

          <div className="w-px h-6 bg-slate-100 mx-2" />
          <div className="relative" ref={emojiPickerRef}>
            <motion.button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              {...hapticFeedback}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            >
              <Smile className="w-4 h-4" />
            </motion.button>
            {showEmojiPicker && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200/60/60 rounded-xl shadow-2xl p-3 z-[100] grid grid-cols-4 gap-2 w-56">
                {commonEmojis.map((emoji) => (
                  <motion.button
                    type="button"
                    key={emoji}
                    onClick={() => {
                      injectText(emoji);
                      setShowEmojiPicker(false);
                    }}
                    {...hapticFeedback}
                    className="text-xl p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Text Area Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            onSelect={handleEditorSelect}
            placeholder={language === "es"
              ? "Escribe algo increíble..."
              : "Write something amazing..."}
            className="w-full h-full text-lg leading-relaxed text-slate-800 placeholder:text-slate-300 border-none focus:ring-0 resize-none p-8 lg:p-12 font-sans"
          />
        </div>

        {/* 4. Bottom Metric Bar */}
        <div className="h-16 border-t border-slate-200/60/60 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2 relative"
              ref={gradeInfoRef}
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.grade}:
              </span>
              <motion.button
                type="button"
                onClick={() => setShowGradeInfo(!showGradeInfo)}
                {...hapticFeedback}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all shadow-sm
                                    ${
                  grade <= 5
                    ? "border-emerald-200 text-emerald-600 bg-emerald-50"
                    : grade <= 8
                    ? "border-blue-200 text-blue-600 bg-blue-50"
                    : grade <= 11
                    ? "border-amber-200 text-amber-600 bg-amber-50"
                    : "border-rose-200 text-rose-600 bg-rose-50"
                }
                                `}
              >
                {grade}
              </motion.button>

              {showGradeInfo && (
                <div className="absolute bottom-full mb-4 left-0 w-[280px] bg-white border border-slate-200/60/60 rounded-xl shadow-2xl p-4 z-[110] animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500" />
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === "es"
                          ? "Nivel de Lectura"
                          : "Readability Level"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {language === "es"
                          ? "Estimación basada en la complejidad del texto (Automated Readability Index)."
                          : "Estimate based on text complexity (Automated Readability Index)."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        g: "1-5",
                        desc: language === "es"
                          ? "Muy fácil de leer"
                          : "Very easy to read",
                        color: "text-emerald-500",
                      },
                      {
                        g: "5-8",
                        desc: language === "es"
                          ? "Ideal para LinkedIn"
                          : "Ideal for LinkedIn",
                        color: "text-blue-500",
                      },
                      {
                        g: "8-11",
                        desc: language === "es"
                          ? "Dificultad media"
                          : "Fairly difficult",
                        color: "text-amber-500",
                      },
                      {
                        g: "11+",
                        desc: language === "es"
                          ? "Demasiado complejo"
                          : "Too complex",
                        color: "text-rose-500",
                      },
                    ].map((level, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[10px] font-bold py-1 border-b border-slate-50 last:border-0"
                      >
                        <span className={level.color}>
                          {level.g}
                        </span>
                        <span className="text-slate-500">
                          {level.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] text-slate-400 italic">
                    {language === "es"
                      ? "Los mejores posts suelen tener un grado de 8 o inferior."
                      : "Top performing posts usually aim for a grade of 8 or lower."}
                  </p>
                </div>
              )}
            </div>
            <div className="relative" ref={metricsMenuRef}>
              <motion.button
                type="button"
                onClick={() => setShowMetricsMenu(!showMetricsMenu)}
                {...hapticFeedback}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest">
                  {selectedMetric === "characters" &&
                    `${charCount} ${t.metrics.characters}`}
                  {selectedMetric === "words" &&
                    `${wordCount} ${t.metrics.words}`}
                  {selectedMetric === "paragraphs" &&
                    `${paragraphCount} ${t.metrics.paragraphs}`}
                  {selectedMetric === "sentences" &&
                    `${sentenceCount} ${t.metrics.sentences}`}
                  {selectedMetric === "readTime" &&
                    `${readTime} ${t.metrics.readingTime}`}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-300 transition-transform ${
                    showMetricsMenu ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {showMetricsMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-white border border-slate-200/60/60 rounded-xl shadow-xl p-1 z-[100] min-w-[170px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {[
                    {
                      id: "characters",
                      val: charCount,
                      label: t.metrics.characters,
                    },
                    {
                      id: "words",
                      val: wordCount,
                      label: t.metrics.words,
                    },
                    {
                      id: "paragraphs",
                      val: paragraphCount,
                      label: t.metrics.paragraphs,
                    },
                    {
                      id: "sentences",
                      val: sentenceCount,
                      label: t.metrics.sentences,
                    },
                    {
                      id: "readTime",
                      val: readTime,
                      label: t.metrics.readingTime,
                    },
                  ].map((m) => (
                    <motion.button
                      type="button"
                      key={m.id}
                      onClick={() => {
                        setSelectedMetric(m.id as typeof selectedMetric);
                        setShowMetricsMenu(false);
                      }}
                      {...hapticFeedback}
                      className={`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-between ${
                        selectedMetric === m.id
                          ? "bg-brand-50 text-brand-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      <span>{m.val} {m.label}</span>
                      {selectedMetric === m.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Character Limit Warning */}
            {charCount > 3000 && (
              <div className="relative" ref={limitWarningRef}>
                <motion.button
                  type="button"
                  onClick={() =>
                    setShowLimitWarning(!showLimitWarning)}
                  {...hapticFeedback}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#EE5D28] text-white rounded-full text-xs font-bold hover:bg-[#D64D1C] transition-colors shadow-sm animate-in fade-in zoom-in duration-300 transform scale-100 opacity-100"
                >
                  <AlertTriangle className="w-3.5 h-3.5 fill-white stroke-white" />
                  <span>{charCount} / 3000</span>
                </motion.button>

                {showLimitWarning && (
                  <div className="absolute bottom-full mb-4 left-0 w-[420px] bg-white border border-[#E76236] border-l-8 rounded-lg shadow-2xl p-5 z-[120] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <p className="text-sm text-slate-700 font-medium mb-3 leading-relaxed">
                      {language === "es"
                        ? "Las publicaciones de LinkedIn deben tener menos de 3000 caracteres. Estás excediendo ese límite."
                        : "LinkedIn posts must be shorter than 3000 characters. You are exceeding that limit."}
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-[#EE5D28]" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {language === "es"
                          ? (
                            <>
                              Ten en cuenta que <b>negritas</b>,{" "}
                              <i>cursivas</i>, emojis 👋 y otras características
                              "especiales" cuentan como 2 o más caracteres. Por
                              lo que este recuento puede ser mayor que el
                              recuento visual de caracteres.
                            </>
                          )
                          : (
                            <>
                              Note that <b>bold</b>,{" "}
                              <i>italic</i>, emojis 👋 and similar "special"
                              features are treated as 2 or more characters. So
                              this count might be higher than the visible
                              character count.
                            </>
                          )}
                      </p>
                    </div>
                    {/* Little triangle arrow at bottom */}
                    <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-r border-[#E76236] transform rotate-45 z-10" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              onClick={handlePublish}
              {...hapticFeedback}
              className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/10 transition-all flex items-center gap-2"
            >
              {t.continueLinkedIn}
              <Zap className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* RIGHT: Tools & Preview Column */}
      <div className="flex-1 flex flex-col bg-slate-50/50 min-w-0">
        {/* 1. Tabs */}
        <div className="flex items-center gap-8 px-8 h-14 border-b border-slate-200/60/60 bg-white shrink-0">
          {[
            {
              id: "preview",
              label: language === "es" ? "Vista previa" : "Preview",
              icon: Monitor,
            },
            {
              id: "hooks",
              label: language === "es" ? "Hooks" : "Hooks",
              icon: Sparkles,
            },
            {
              id: "endings",
              label: language === "es" ? "Cierre" : "Endings",
              icon: AlignLeft,
            },
            {
              id: "snippets",
              label: language === "es" ? "Fragmentos" : "Snippets",
              icon: Copy,
            },
          ].map((tab) => (
            <motion.button
              type="button"
              key={tab.id}
              onClick={() => setSidebarTab(tab.id as typeof sidebarTab)}
              {...hapticFeedback}
              className={`flex items-center gap-2 h-full text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                sidebarTab === tab.id
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden xl:inline">
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* 2. Content Area */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {sidebarTab === "preview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex bg-white p-1 rounded-xl border border-slate-200/60/60">
                  <motion.button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    {...hapticFeedback}
                    className={`p-1.5 rounded-lg transition-all ${
                      previewMode === "mobile"
                        ? "bg-brand-50 text-brand-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    {...hapticFeedback}
                    className={`p-1.5 rounded-lg transition-all ${
                      previewMode === "desktop"
                        ? "bg-brand-50 text-brand-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    type="button"
                    onClick={handleCopy}
                    {...hapticFeedback}
                    className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {t.copyText}
                  </motion.button>
                </div>
              </div>

              {/* LinkedIn Preview Box */}
              <div className="flex justify-center w-full">
                <div
                  className={`transition-all duration-300 w-full ${
                    previewMode === "mobile" ? "max-w-[375px]" : "max-w-2xl"
                  }`}
                >
                  <LinkedInPreview
                    content={editorContent}
                    user={user}
                    isLoading={false}
                    language={language}
                    showEditButton={false}
                    isMobilePreview={previewMode ===
                      "mobile"}
                    // Viral Potential removed as per request for Editor view
                  />
                </div>
              </div>
            </div>
          )}

          {sidebarTab === "hooks" && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    value={hookSearch}
                    onChange={(e) => setHookSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/60/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tag:
                  </span>
                  <select
                    value={selectedHookTag}
                    onChange={(e) => setSelectedHookTag(e.target.value)}
                    className="bg-white border border-slate-200/60/60 rounded-xl text-sm px-3 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none min-w-[120px]"
                  >
                    {allHookTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "all" ? "Todos" : tag.charAt(0)
                          .toUpperCase() +
                          tag.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <motion.button
                  type="button"
                  onClick={handleShuffleHooks}
                  {...hapticFeedback}
                  className="p-2.5 bg-white border border-slate-200/60/60 rounded-xl hover:text-brand-600 transition-colors shadow-sm"
                  title="Mezclar ganchos"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Hook List */}
              <div className="space-y-4">
                {filteredHooks.slice(0, visibleHooksCount)
                    .length > 0
                  ? (
                    filteredHooks.slice(
                      0,
                      visibleHooksCount,
                    ).map((hook, i) => (
                      <motion.button
                        type="button"
                        key={i}
                        onClick={() =>
                          injectText(
                            hook.text + "\n\n",
                          )}
                        {...hapticFeedback}
                        className="w-full text-left p-5 bg-white border border-slate-200/60/60 rounded-[22px] hover:border-brand-400 transition-all shadow-sm hover:shadow-md group relative overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {hook.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-full group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-[14px] font-semibold text-slate-700 leading-relaxed">
                          {hook.text}
                        </p>
                      </motion.button>
                    ))
                  )
                  : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        No se encontraron ganchos
                      </p>
                    </div>
                  )}
              </div>

              {/* Load More */}
              {filteredHooks.length > visibleHooksCount && (
                <motion.button
                  type="button"
                  onClick={() => setVisibleHooksCount((prev: number) => prev + 6)}
                  {...hapticFeedback}
                  className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                  Cargar más ganchos
                </motion.button>
              )}
            </div>
          )}

          {sidebarTab === "endings" && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar cierres..."
                    value={endingSearch}
                    onChange={(e) => setEndingSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/60/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tag:
                  </span>
                  <select
                    value={selectedEndingTag}
                    onChange={(e) =>
                      setSelectedEndingTag(
                        e.target.value,
                      )}
                    className="bg-white border border-slate-200/60/60 rounded-xl text-sm px-3 py-2 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none min-w-[120px]"
                  >
                    {allEndingTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "all" ? "Todos" : tag.charAt(0)
                          .toUpperCase() +
                          tag.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <motion.button
                  type="button"
                  onClick={handleShuffleEndings}
                  {...hapticFeedback}
                  className="p-2.5 bg-white border border-slate-200/60/60 rounded-xl hover:text-brand-600 transition-colors shadow-sm"
                  title="Mezclar cierres"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Ending List */}
              <div className="space-y-4">
                {filteredEndings.slice(0, visibleEndingsCount)
                    .length > 0
                  ? (
                    filteredEndings.slice(
                      0,
                      visibleEndingsCount,
                    ).map((ending, i) => (
                      <motion.button
                        type="button"
                        key={i}
                        onClick={() =>
                          injectText(
                            "\n\n" + ending.text,
                          )}
                        {...hapticFeedback}
                        className="w-full text-left p-5 bg-white border border-slate-200/60/60 rounded-[22px] hover:border-brand-400 transition-all shadow-sm hover:shadow-md group relative overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {ending.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-full group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-[14px] font-semibold text-slate-700 leading-relaxed">
                          {ending.text}
                        </p>
                      </motion.button>
                    ))
                  )
                  : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        No se encontraron cierres
                      </p>
                    </div>
                  )}
              </div>

              {/* Load More */}
              {filteredEndings.length > visibleEndingsCount && (
                <motion.button
                  type="button"
                  onClick={() => setVisibleEndingsCount((prev: number) => prev + 6)}
                  {...hapticFeedback}
                  className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                  Cargar más cierres
                </motion.button>
              )}
            </div>
          )}

          {sidebarTab === "snippets" && (
            <div className="space-y-6">
              {/* Create Snippet Area */}
              <div className="bg-slate-50 border border-slate-200/60/60 border-dashed rounded-[22px] p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Crear nuevo fragmento
                </p>
                <div className="bg-white border border-slate-200/60/60 rounded-xl p-3 min-h-[80px] text-sm text-slate-600 mb-3 italic">
                  {selectedEditorText
                    ? selectedEditorText
                    : (
                      <span className="text-slate-300 not-italic">
                        Selecciona texto en el editor para crear un fragmento...
                      </span>
                    )}
                </div>
                <motion.button
                  type="button"
                  onClick={handleCreateSnippet}
                  disabled={!selectedEditorText}
                  {...hapticFeedback}
                  className="w-full py-2.5 bg-brand-600 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-sm font-bold transition-all shadow-sm disabled:shadow-none hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear Fragmento
                </motion.button>
              </div>

              {/* Search and Sort */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar mis fragmentos..."
                    value={snippetSearch}
                    onChange={(e) => setSnippetSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/60/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Ordenar:
                  </span>
                  <select
                    value={snippetSort}
                    onChange={(e) =>
                      setSnippetSort(
                        e.target.value as typeof snippetSort,
                      )}
                    className="bg-white border border-slate-200/60/60 rounded-xl text-sm px-3 py-2 outline-none focus:border-brand-500 min-w-[100px]"
                  >
                    <option value="newest">
                      Más recientes
                    </option>
                    <option value="oldest">
                      Más antiguos
                    </option>
                    <option value="last_used">
                      Último uso
                    </option>
                  </select>
                </div>
              </div>

              {/* Snippets List */}
              <div className="space-y-4">
                {snippets
                    .filter((s) =>
                      s.text.toLowerCase().includes(
                        snippetSearch.toLowerCase(),
                      )
                    )
                    .sort((a, b) => {
                      if (
                        snippetSort === "newest"
                      ) {
                        return b.createdAt -
                          a.createdAt;
                      }
                      if (
                        snippetSort === "oldest"
                      ) {
                        return a.createdAt -
                          b.createdAt;
                      }
                      if (
                        snippetSort === "last_used"
                      ) {
                        return (b.lastUsed || 0) -
                          (a.lastUsed || 0);
                      }
                      return 0;
                    })
                    .length > 0
                  ? (
                    snippets
                      .filter((s) =>
                        s.text.toLowerCase().includes(
                          snippetSearch.toLowerCase(),
                        )
                      )
                      .sort((a, b) => {
                        if (
                          snippetSort === "newest"
                        ) {
                          return b.createdAt -
                            a.createdAt;
                        }
                        if (
                          snippetSort === "oldest"
                        ) {
                          return a.createdAt -
                            b.createdAt;
                        }
                        if (
                          snippetSort === "last_used"
                        ) {
                          return (b.lastUsed || 0) -
                            (a.lastUsed || 0);
                        }
                        return 0;
                      })
                      .map((snippet) => (
                        <div
                          key={snippet.id}
                          className="group relative"
                        >
                          <motion.button
                            type="button"
                            onClick={() =>
                              handleInjectSnippet(
                                snippet,
                              )}
                            {...hapticFeedback}
                            className="w-full text-left p-5 bg-white border border-slate-200/60/60 rounded-[22px] hover:border-brand-400 transition-all shadow-sm hover:shadow-md pr-12"
                          >
                            <p className="text-[14px] font-medium text-slate-700 leading-relaxed line-clamp-3">
                              {snippet.text}
                            </p>
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() =>
                              handleDeleteSnippet(
                                snippet.id,
                              )}
                            {...hapticFeedback}
                            className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title="Eliminar fragmento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ))
                  )
                  : (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-200/60/60">
                        <Sparkles className="w-8 h-8 text-slate-300" />
                      </div>
                      <h4 className="text-slate-900 font-bold mb-2">
                        No tienes fragmentos aún
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Con los fragmentos puedes guardar firmas, llamadas a la
                        acción o frases que usas a menudo.
                        <br />
                        <br />
                        <span className="font-medium text-brand-600">
                          Selecciona texto en el editor
                        </span>{" "}
                        para crear tu primero.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditorView;
