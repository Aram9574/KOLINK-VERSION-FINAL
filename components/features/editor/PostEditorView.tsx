import React, { useEffect, useRef, useState } from "react";
import {
  Eye,
  Sparkles,
} from "lucide-react";
import EditorHeader from "./layout/EditorHeader";
import EditorToolbar from "./layout/EditorToolbar";
import EditorCanvas from "./layout/EditorCanvas";
import EditorFooter from "./layout/EditorFooter";
import EditorSidebar from "./layout/EditorSidebar";
import { usePosts } from "../../../context/PostContext";
import { useUser } from "../../../context/UserContext";
import { translations } from "../../../translations";
import { toast } from "sonner";
import { type Post, type AppLanguage, ViralTone, ViralFramework, PostLength, EmojiDensity } from "../../../types";
import {
  clearUnicodeFormatting,
  convertToUnicode,
} from "../../../utils/unicode";
import {
  fetchHooks,
  fetchClosures,
  updatePost as updatePostInDb,
} from "../../../services/postRepository";
import { motion } from "framer-motion";
import { hapticFeedback } from "../../../lib/animations";
import { supabase } from "../../../services/supabaseClient";
import { streamMicroEdit } from "../../../services/geminiService";

// Lazy load for performance
// const LinkedInPreview = React.lazy(() => import("../generation/LinkedInPreview"));
import LinkedInPreview from "../generation/LinkedInPreview";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [isSplitView, setIsSplitView] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<
    "preview" | "hooks" | "endings" | "snippets" | "viral"
  >("preview");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [readTime, setReadTime] = useState("");
  const [grade, setGrade] = useState(1);
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [showMetricsMenu, setShowMetricsMenu] = useState(false);
  const [showDraftsMenu, setShowDraftsMenu] = useState(false);
  const [selectedMetric] = useState<
    "characters" | "words" | "paragraphs" | "sentences" | "readTime"
  >("characters");

  // Persistence: Load from localStorage on mount
  useEffect(() => {
    // Check key location state first
    if (location.state && (location.state as any).initialDraft) {
      setEditorContent((location.state as any).initialDraft);
      setPostTitle((location.state as any).initialTitle || "");
      window.history.replaceState({}, document.title);
      return;
    }

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

  // Viral Analysis State
  const [viralResult, setViralResult] = useState<any | null>(null);
  const [isAnalyzingViral, setIsAnalyzingViral] = useState(false);

  const handleAnalyzeViral = async () => {
    if (!editorContent.trim()) {
      toast.error(language === "es" ? "Escribe algo primero" : "Write something first");
      return;
    }

    setIsAnalyzingViral(true);
    setViralResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-viral-score", {
        body: { topic: editorContent, language },
      });

      if (error) throw error;
      setViralResult(data);
    } catch (err: any) {
      console.error("Viral analysis error:", err);
      toast.error(language === "es" ? "Error al analizar" : "Analysis error");
    } finally {
      setIsAnalyzingViral(false);
    }
  };

  const [snippets, setSnippets] = useState<
    { id: string; text: string; createdAt: number; lastUsed?: number }[]
  >([]);
  const [snippetSearch] = useState("");

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

  // Snippet and editor handlers removed as they were unsused or moved to direct injections

  // Hooks & Closures State (Dynamic)
  const [hooksList, setHooksList] = useState<any[]>([]);
  const [closuresList, setClosuresList] = useState<any[]>([]);
  const [shuffledHooks, setShuffledHooks] = useState<any[]>([]);
  const [hookSearch] = useState("");
  const [selectedHookTag] = useState("all");
  const [visibleHooksCount] = useState(6);

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


  const [endingSearch] = useState("");
  const [selectedEndingTag] = useState("all");
  const [visibleEndingsCount] = useState(6);
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
            tone: ViralTone.PROFESSIONAL,
            framework: ViralFramework.STANDARD,
            length: PostLength.MEDIUM,
            creativityLevel: 50,
            emojiDensity: EmojiDensity.MODERATE,
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



  const handleSmartEdit = async (action: string) => {
    const selectionStart = editorRef.current?.selectionStart || 0;
    const selectionEnd = editorRef.current?.selectionEnd || 0;
    const selectedText = editorContent.substring(selectionStart, selectionEnd);

    if (!selectedText.trim()) {
        toast.error("Select text to modify");
        return;
    }

    const startText = editorContent.substring(0, selectionStart);
    const endText = editorContent.substring(selectionEnd);
    
    // Optimistic UI: Clear selection or show loading? 
    // We'll replace continuously.
    let accumulated = "";

    try {
        await streamMicroEdit({
            topic: selectedText,
            action: action, // e.g., "Make shorter", "More professional"
            tone: currentPost?.params?.tone || ViralTone.PROFESSIONAL,
            stream: true
        }, (chunk) => {
            accumulated += chunk;
            setEditorContent(startText + accumulated + endText);
            
            // Keep cursor at end of insertion?
            // This might feel jumpy if not handled carefully, but functional for v1.
        });
        toast.success("Text updated with AI");
    } catch (e) {
        toast.error("AI Edit failed");
        console.error(e);
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
      <div className={`flex flex-col min-w-0 border-r border-slate-200/60 transition-all duration-300 ${isSplitView ? 'flex-1' : 'flex-[1.5]'}`}>
        <EditorHeader
          postTitle={postTitle}
          setPostTitle={setPostTitle}
          onSave={handleSave}
          showDraftsMenu={showDraftsMenu}
          setShowDraftsMenu={setShowDraftsMenu}
          drafts={drafts}
          onSelectDraft={handleSelectDraft}
          placeholder={t.unsavedDraft}
          saveLabel={t.saveDraft}
          openDraftLabel={t.openDraft}
          draftsLabel={t.drafts}
          noDraftsLabel={t.noDrafts}
          language={language}
          isSplitView={isSplitView}
          onToggleSplitView={() => {
              setIsSplitView(!isSplitView);
              // If enabling split view, ensure sidebar isn't on preview tab
              if (!isSplitView && sidebarTab === "preview") {
                  setSidebarTab("hooks");
              }
          }}
        />

        <EditorToolbar
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearAll={handleClearEditor}
            onFormat={handleFormat}
            onClearFormatting={handleClearFormatting}
            onInjectText={injectText}
            historyIndex={historyIndex}
            historyLength={history.length}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            commonEmojis={commonEmojis}
            emojiPickerRef={emojiPickerRef}
            onSmartEdit={handleSmartEdit}
        />

        <EditorCanvas
          content={editorContent}
          onChange={(e) => setEditorContent(e.target.value)}
          placeholder={t.placeholder}
          editorRef={editorRef as unknown as React.RefObject<HTMLTextAreaElement>}
        />

        <EditorFooter
          grade={grade}
          showGradeInfo={showGradeInfo}
          setShowGradeInfo={setShowGradeInfo}
          selectedMetric={selectedMetric}
          showMetricsMenu={showMetricsMenu}
          setShowMetricsMenu={setShowMetricsMenu}
          charCount={charCount}
          wordCount={wordCount}
          paragraphCount={paragraphCount}
          sentenceCount={sentenceCount}
          readTime={readTime}
          showLimitWarning={showLimitWarning}
          setShowLimitWarning={setShowLimitWarning}
          onPublish={handlePublish}
          language={language}
          labels={{
            grade: t.grade,
            metrics: t.metrics,
            continueLinkedIn: t.continueLinkedIn,
            readability: t.status.readability,
            limitWarning: t.limitWarning
          }}
          gradeInfoRef={gradeInfoRef as unknown as React.RefObject<HTMLDivElement>}
          metricsMenuRef={metricsMenuRef as unknown as React.RefObject<HTMLDivElement>}
          limitWarningRef={limitWarningRef as unknown as React.RefObject<HTMLDivElement>}
        />

      </div>

      {/* MIDDLE: Split View Mobile Preview */}
      {isSplitView && (
          <div className="w-[380px] bg-slate-100/50 border-r border-slate-200/60 flex flex-col relative shrink-0">
               <div className="p-3 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
                    <Eye className="w-3 h-3" />
                    Mobile Preview
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Live Sync" />
               </div>
               <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    <div className="bg-white rounded-none sm:rounded-md shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                        <LinkedInPreview 
                            content={editorContent}
                            user={user}
                            isLoading={false}
                            language={language as AppLanguage}
                            showEditButton={false}
                            isMobilePreview={true}
                        />
                    </div>
                    
                    {/* Helper Tip */}
                     <div className="mt-6 mx-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-900 font-semibold mb-0.5">WYSIWYG Mode</p>
                            <p className="text-[11px] text-blue-700/70 leading-relaxed">
                                This is exactly how your post will look on a mobile device. Watch out for line breaks!
                            </p>
                        </div>
                    </div>
               </div>
          </div>
      )}

      {/* RIGHT: Sidebar Column */}
      <EditorSidebar
        activeTab={sidebarTab}
        setActiveTab={setSidebarTab}
        previewContent={editorContent}
        isSplitView={isSplitView}
        user={user}
        hooks={filteredHooks.slice(0, visibleHooksCount).map(h => h.text)}
        endings={filteredEndings.slice(0, visibleEndingsCount).map(e => e.text)}
        snippets={snippets.filter(s => s.text.toLowerCase().includes(snippetSearch.toLowerCase())).map(s => ({ id: s.id, title: s.text.substring(0, 20), content: s.text, category: "Fragmento" }))}
        isGenerating={false}
        isAnalyzingViral={isAnalyzingViral}
        viralResult={viralResult}
        onAnalyzeViral={handleAnalyzeViral}
        onInjectText={injectText}
        onGenerateHook={handleShuffleHooks}
        onGenerateEnding={handleShuffleEndings}
        language={language}
        labels={{
          tabs: t.sidebar,
          preview: t.preview,
          hooks: t.hooks,
          endings: t.endings,
          snippets: t.snippets,
          viral: t.viralAnalysis
        }}
      />
    </div>
  );
};

export default PostEditorView;
