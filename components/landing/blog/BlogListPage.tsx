import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useUser } from '../../../context/UserContext';
import { blogPosts } from '../../../data/blogPosts';
import { Search, Calendar, Clock, User, ArrowRight, Sparkles, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogListPage: React.FC = () => {
    const { user, language, setLanguage } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const parseSpanishDate = (dateStr: string) => {
        const monthMap: { [key: string]: number } = {
            'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
        };
        // Format: "28 Ene, 2026"
        const parts = dateStr.replace(',', '').split(' ');
        if (parts.length !== 3) return 0;
        const [day, month, year] = parts;
        return new Date(parseInt(year), monthMap[month] || 0, parseInt(day)).getTime();
    };

    const categories = ['Todos', ...new Set(blogPosts.map(post => post.category))];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        const dateA = parseSpanishDate(a.date);
        const dateB = parseSpanishDate(b.date);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="blog" 
                scrollToSection={() => {}} 
            />
            
            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="px-6 mb-20 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-brand-600" />
                            <span>KOLINK BLOG</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6"
                        >
                            Ideas para dominar <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                                LinkedIn en 2026
                            </span>
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 max-w-2xl mx-auto mb-12"
                        >
                            Estrategias tácticas, psicología del usuario y análisis algorítmico para profesionales y creadores de alto nivel.
                        </motion.p>

                        {/* Search & Filter */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto"
                        >
                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Buscar artículos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 shadow-soft-glow"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                                            selectedCategory === cat 
                                            ? 'bg-white text-brand-600 shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center mt-6"
                        >
                            <button
                                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm group"
                            >
                                <ArrowUpDown className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                                <span>{sortOrder === 'newest' ? 'Más recientes' : 'Más antiguos'}</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/30 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] animate-pulse" />
                    </div>
                </section>

                {/* Posts Grid */}
                <section className="px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post, idx) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    layout
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="group relative flex flex-col bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                                >
                                    <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
                                    
                                    <div className="aspect-[16/9] overflow-hidden relative">
                                        <img 
                                            src={post.image} 
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold tracking-wider uppercase border border-white/20 shadow-sm">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-10 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{post.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                                            {post.title}
                                        </h3>

                                        <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={post.author.avatar} 
                                                    alt={post.author.name}
                                                    className="w-8 h-8 rounded-full border border-slate-200"
                                                />
                                                <span className="text-sm font-medium text-slate-900">{post.author.name}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-brand-600 font-bold text-sm group-hover:gap-3 transition-all duration-300">
                                                <span>Leer más</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-medium text-slate-400">No se encontraron artículos que coincidan con tu búsqueda.</h3>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                                className="mt-4 text-brand-600 font-bold hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </section>
            </main>

            <Footer language={language} scrollToSection={() => {}} />
        </div>
    );
};

export default BlogListPage;
