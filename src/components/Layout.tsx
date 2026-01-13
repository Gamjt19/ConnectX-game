import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
    const location = useLocation();
    const isWidePage = location.pathname === '/live-feed' || location.pathname === '/leaderboard' || location.pathname === '/admin';
    const isMediumPage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 animate-gradient-bg">
            <main className={cn(
                "container mx-auto px-4 py-6 pb-24 md:pb-6 md:pt-20 transition-all duration-500",
                isWidePage ? "max-w-7xl" : isMediumPage ? "max-w-5xl" : "max-w-2xl"
            )}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Navbar />
        </div>
    );
}
