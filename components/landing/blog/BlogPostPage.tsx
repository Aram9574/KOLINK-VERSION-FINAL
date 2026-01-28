import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useUser } from '../../../context/UserContext';
import { blogPosts } from '../../../data/blogPosts';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const BlogPostPage: React.FC = () => {
    const { user, language, setLanguage } = useUser();
    const { slug } = useParams<{ slug: string }>();
    const post = blogPosts.find(p => p.slug === slug);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return blogPosts
            .filter(p => p.id !== post.id)
            .slice(0, 3);
    }, [post]);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    // Basic Markdown-like renderer
    const renderContent = (content: string) => {
        const lines = content.split('\n');
        return lines.map((line, idx) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('# ')) {
                return <h1 key={idx} className="text-3xl md:text-4xl font-bold text-slate-900 mt-12 mb-6">{trimmedLine.replace('# ', '')}</h1>;
            }
            if (trimmedLine.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-5">{trimmedLine.replace('## ', '')}</h2>;
            }
            if (trimmedLine.startsWith('### ')) {
                return <h3 key={idx} className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-4">{trimmedLine.replace('### ', '')}</h3>;
            }
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return (
                    <div key={idx} className="flex gap-3 my-4">
                        <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-1" />
                        <span className="text-slate-600 leading-relaxed">{trimmedLine.substring(2)}</span>
                    </div>
                );
            }
            if (trimmedLine.startsWith('|')) {
                // Table header or row - very basic support
                const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim());
                if (trimmedLine.includes('---')) return null;
                return (
                    <div key={idx} className="grid grid-cols-2 gap-4 border-b border-slate-100 py-3 bg-slate-50/50 px-4 rounded-xl my-2">
                        {cells.map((cell, cidx) => (
                            <span key={cidx} className={cidx === 0 ? "font-bold text-slate-900" : "text-slate-600"}>{cell}</span>
                        ))}
                    </div>
                );
            }
            if (trimmedLine === '') return <div key={idx} className="h-4" />;

            // Handle bold text **
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={idx} className="text-lg text-slate-600 leading-relaxed mb-6">
                    {parts.map((part, pidx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pidx} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Enlace copiado al portapapeles");
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="blog" 
                scrollToSection={() => {}} 
            />
            
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-brand-600 z-[100] origin-left"
                style={{ scaleX }}
            />

            <main className="pt-32 pb-20">
                <article className="max-w-4xl mx-auto px-6">
                    {/* Back Link */}
                    <Link 
                        to="/blog" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-12 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Volver al blog</span>
                    </Link>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wider uppercase">
                                {post.category}
                            </span>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.readTime} de lectura</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between py-8 border-y border-slate-100">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={post.author.avatar} 
                                    alt={post.author.name}
                                    className="w-12 h-12 rounded-full border border-slate-200"
                                />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{post.author.name}</h4>
                                    <p className="text-xs text-slate-500">{post.author.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleShare}
                                    className="p-2.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-brand-600 transition-all"
                                    title="Compartir"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button 
                                    className="p-2.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-brand-600 transition-all"
                                    title="Guardar"
                                >
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="aspect-[21/10] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        {renderContent(post.content)}
                    </div>

                    {/* Author Footer */}
                    <div className="mt-20 p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <img 
                            src={post.author.avatar} 
                            alt={post.author.name}
                            className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
                        />
                        <div className="flex-1">
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Escrito por {post.author.name}</h4>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Curador de contenido profesional y fundador de Kolink. Ayudando a líderes de opinión a escalar su impacto digital sin perder la esencia humana en la era de la IA.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Link to="/login" className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
                                    Seguir en LinkedIn
                                </Link>
                                <button className="px-6 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                                    Ver perfil completo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Related Posts */}
                    <section className="mt-32 pt-20 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-slate-900">Artículos relacionados</h2>
                            <Link to="/blog" className="text-brand-600 font-bold text-sm hover:underline">
                                Ver todos
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map(rp => (
                                <Link key={rp.id} to={`/blog/${rp.slug}`} className="group block">
                                    <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 border border-slate-100 shadow-sm">
                                        <img 
                                            src={rp.image} 
                                            alt={rp.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                                        {rp.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </section>
                </article>
            </main>

            <Footer language={language} scrollToSection={() => {}} />
        </div>
    );
};

export default BlogPostPage;
