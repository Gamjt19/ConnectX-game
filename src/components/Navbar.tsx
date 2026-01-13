
import { Link } from 'react-router-dom';
import { Camera, Trophy, Home } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 pb-safe md:top-0 md:bottom-auto md:border-t-0 md:border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-around md:justify-between">
                <Link to="/" className="hidden md:block font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    HackConnect
                </Link>

                <div className="flex items-center justify-around w-full md:w-auto md:gap-8">
                    <Link to="/" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
                        <Home size={24} />
                        <span className="text-xs">Home</span>
                    </Link>

                    <Link to="/submit" className="flex flex-col items-center gap-1 p-2 text-purple-400 hover:text-purple-300 transition-colors -mt-8 md:mt-0">
                        <div className="bg-purple-600 p-3 rounded-full shadow-lg shadow-purple-600/30">
                            <Camera size={28} className="text-white" />
                        </div>
                        <span className="text-xs font-medium">Scan</span>
                    </Link>

                    <Link to="/leaderboard" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
                        <Trophy size={24} />
                        <span className="text-xs">Rank</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
