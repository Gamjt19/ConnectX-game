
import { Link } from 'react-router-dom';
import { Camera, Users, Trophy, Sparkles } from 'lucide-react';

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in duration-700">

            {/* Hero Section */}
            <div className="space-y-4">
                <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-3xl animate-pulse">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-lg">
                    Connect<br />Quest
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-sm mx-auto leading-relaxed">
                    The ultimate networking game. Meet people. Take photos. Win the leaderboard.
                </p>
            </div>

            {/* Main CTA */}
            <div className="w-full max-w-xs pt-4">
                <Link
                    to="/submit"
                    className="group relative flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-lg text-white shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                    <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left" />
                    <Camera className="mr-2" />
                    Start Playing
                </Link>
            </div>

            {/* Rules Cards */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm text-left pt-8">
                <div className="glass-card p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200">Meet New People</h3>
                        <p className="text-sm text-slate-500">Find participants from other teams and colleges.</p>
                    </div>
                </div>

                <div className="glass-card p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                    <div className="bg-pink-500/20 p-2 rounded-lg text-pink-400">
                        <Camera size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200">Snap a Selfie</h3>
                        <p className="text-sm text-slate-500">Take a photo together to prove your connection.</p>
                    </div>
                </div>

                <div className="glass-card p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                    <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200">Win Points</h3>
                        <p className="text-sm text-slate-500">Each unique connection = 1 Point. Top the leaderboard!</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
