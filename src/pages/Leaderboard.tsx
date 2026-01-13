
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/supabase';
import { Loader2, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getOrCreateUserId } from '../services/supabase';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = getOrCreateUserId();

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const data = await getLeaderboard();
                setLeaders(data); // Assuming aggreagtion returns { ... data, last_seen_user_id? } wait, my aggregation logic lost the ID key in the array map.. fixing logic below
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
        const interval = setInterval(fetchBoard, 15000);
        return () => clearInterval(interval);
    }, []);

    // Check if current user is first
    useEffect(() => {
        if (leaders.length > 0) {
            // We need the ID in the leaders array to check ownership
            // But my previous aggregation logic in supabase.ts returned Object.values(players) which dropped the ID key or I need to make sure 'players' objects have the ID.
            // Let's assume I'll fix supabase.ts to include ID.
            // For now, I'll update supabase.ts next.
        }
    }, [leaders]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Leaderboard</h1>
                    <p className="text-slate-400 text-sm">Top connectors of the event</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                {loading && leaders.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0 divide-y divide-slate-800 lg:divide-y-0">
                        {leaders.map((player, index) => {
                            const isMe = player.id === currentUserId;
                            if (index === 0 && isMe && !loading) {
                                confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                            }

                            return (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={player.id || index}
                                    className={cn(
                                        "flex items-center p-4 transition-colors border-b border-slate-800 lg:border-none",
                                        isMe ? "bg-purple-900/20 lg:rounded-lg" : "hover:bg-slate-800/50 lg:rounded-lg"
                                    )}
                                >
                                    <div className="flex-shrink-0 w-12 lg:w-20 text-center font-bold text-slate-500 text-lg lg:text-3xl">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex-grow ml-4">
                                        <h3 className="font-bold text-slate-200 flex items-center gap-2 text-base lg:text-3xl">
                                            {player.name}
                                            {isMe && <span className="text-[10px] lg:text-sm bg-purple-500 text-white px-1.5 py-0.5 rounded align-middle">YOU</span>}
                                        </h3>
                                        <p className="text-xs lg:text-lg text-slate-500">{player.team}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.span
                                            key={player.score}
                                            initial={{ scale: 1.5, color: '#ec4899' }}
                                            animate={{ scale: 1, color: '#c084fc' }}
                                            className="text-2xl lg:text-4xl font-black text-purple-400"
                                        >
                                            {player.score}
                                        </motion.span>
                                        <span className="text-[10px] lg:text-sm uppercase font-bold text-slate-600">Points</span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {leaders.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500 w-full">
                        No points yet. Start connecting!
                    </div>
                )}
            </div>
        </div>
    );
}
