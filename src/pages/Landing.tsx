
import { useNavigate, Link } from 'react-router-dom';
import { Users, Camera, Trophy, ArrowRight } from 'lucide-react';
import logo from '../assets/etcetera-logo.png';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-10">

            {/* Hero Section */}
            <div className="text-center space-y-6 pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-700">
                    <img src={logo} className="w-4 h-4" alt="logo" />
                    <span>Presented by Etcetera Club</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-lg">
                    Connect<br />Quest
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-sm mx-auto leading-relaxed">
                    The ultimate networking game. Meet people. Take photos. Win the leaderboard.
                </p>
            </div>

            {/* Main CTA */}
            <div className="w-full max-w-xs pt-4 mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pt-8">
                <div className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:bg-slate-800/50 transition-colors group">
                    <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                        <Users size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200 text-lg">Meet New People</h3>
                        <p className="text-sm text-slate-400 mt-2">Find participants from other teams and colleges.</p>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:bg-slate-800/50 transition-colors group">
                    <div className="bg-pink-500/20 p-3 rounded-2xl text-pink-400 group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200 text-lg">Snap a Selfie</h3>
                        <p className="text-sm text-slate-400 mt-2">Take a photo together to prove your connection.</p>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:bg-slate-800/50 transition-colors group">
                    <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200 text-lg">Win Points</h3>
                        <p className="text-sm text-slate-400 mt-2">Each unique connection = 1 Point. Top the leaderboard!</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
