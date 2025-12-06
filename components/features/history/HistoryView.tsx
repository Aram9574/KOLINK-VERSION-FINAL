import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePosts } from '../../../context/PostContext';
import { Post, AppLanguage, GenerationParams } from '../../../types';
import { translations } from '../../../translations';
import { FolderOpen } from 'lucide-react';
import HistoryFilter from './HistoryFilter';
import HistoryCard from './HistoryCard';
import { List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface HistoryViewProps {
    onSelect: (post: Post) => void;
    onReuse: (params: GenerationParams) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    language: AppLanguage;
}

const HistoryView: React.FC<HistoryViewProps> = ({
    onSelect,
    onReuse,
    onDelete,
    language
}) => {
    const {
        posts,
        searchQuery,
        setSearchQuery,
        selectedTone,
        setSelectedTone,
        loadMorePosts,
        hasMore,
        isLoadingMore
    } = usePosts();

    const [selectedFramework, setSelectedFramework] = useState<string>('all');
    const t = translations[language].app.history;

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesFramework = selectedFramework === 'all' || post.params.framework === selectedFramework;
            return matchesFramework;
        });
    }, [posts, selectedFramework]);

    // React Window v2 Row Component
    // Props are flattened: { index, style, ...rowProps }
    const Row = ({ index, style, itemsPerRow, posts, width }: any) => {
        const fromIndex = index * itemsPerRow;
        const toIndex = Math.min(fromIndex + itemsPerRow, posts.length);
        const rowItems = posts.slice(fromIndex, toIndex);

        // Gap calculation
        const gap = 24; // gap-6 is 1.5rem = 24px
        const availableWidth = width - (gap * (itemsPerRow - 1));
        const itemWidth = availableWidth / itemsPerRow;

        return (
            <div style={{ ...style, display: 'flex', gap: `${gap}px` }} className="pb-6">
                {rowItems.map((post: Post) => (
                    <div key={post.id} style={{ width: itemWidth, flexShrink: 0 }}>
                        <HistoryCard
                            post={post}
                            language={language}
                            onSelect={onSelect}
                            onReuse={onReuse}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">{t.viewTitle}</h1>
                    <p className="text-slate-500 mt-1">{t.viewSubtitle}</p>
                </div>
                <HistoryFilter
                    searchTerm={searchQuery}
                    setSearchTerm={setSearchQuery}
                    selectedTone={selectedTone}
                    setSelectedTone={setSelectedTone}
                    selectedFramework={selectedFramework}
                    setSelectedFramework={setSelectedFramework}
                    language={language}
                />
            </div>

            <div className="flex-1 min-h-0 pr-2 -mr-2 w-full">
                {filteredPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] bg-white border border-slate-200 border-dashed rounded-3xl text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <FolderOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t.noResults}</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">{t.noResultsDesc}</p>
                    </div>
                ) : (
                    <AutoSizer>
                        {({ height, width }: { height: number; width: number }) => {
                            // Responsive Column Logic
                            let itemsPerRow = 1;
                            if (width >= 1024) itemsPerRow = 3; // lg
                            else if (width >= 768) itemsPerRow = 2; // md

                            const rowCount = Math.ceil(filteredPosts.length / itemsPerRow);
                            const itemHeight = 420;

                            return (
                                <List
                                    style={{ height, width }}
                                    rowCount={rowCount}
                                    rowHeight={itemHeight}
                                    rowComponent={Row}
                                    rowProps={{ itemsPerRow, posts: filteredPosts, width }}
                                    onRowsRendered={({ stopIndex }) => {
                                        if (hasMore && !isLoadingMore && stopIndex >= rowCount - 2) {
                                            loadMorePosts();
                                        }
                                    }}
                                />
                            );
                        }}
                    </AutoSizer>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
