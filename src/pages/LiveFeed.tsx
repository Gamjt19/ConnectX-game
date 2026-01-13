
import { useEffect, useState } from 'react';
import { getLiveFeed } from '../services/supabase';
import type { Submission } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveFeed() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            const data = await getLiveFeed();
            setSubmissions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
        const interval = setInterval(fetchFeed, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);



    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Live Wall
                </h1>
                <button onClick={fetchFeed} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                    <RefreshCw size={20} className={loading && submissions.length > 0 ? "animate-spin text-slate-500" : "text-slate-400"} />
                </button>
            </div>

            {loading && submissions.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <AnimatePresence mode="popLayout">
                        {submissions.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={item.id}
                                className="glass-card overflow-hidden group"
                            >
                                <div className="relative aspect-video bg-slate-800">
                                    <img
                                        src={item.photo_url}
                                        alt={`${item.user_name} & ${item.peer_name}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 pt-12">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="font-bold text-white text-lg">{item.user_name} <span className="text-slate-400 font-light">&</span> {item.peer_name}</p>
                                                <p className="text-xs text-slate-300 uppercase tracking-wider">{item.user_team} • {item.peer_college}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {submissions.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            No connections yet. Be the first!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
