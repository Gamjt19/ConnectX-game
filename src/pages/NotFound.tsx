import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-red-500/10 p-6 rounded-full">
                <AlertCircle className="w-16 h-16 text-red-500" />
            </div>

            <div className="space-y-2">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    404
                </h1>
                <p className="text-xl font-bold text-slate-200">Page Not Found</p>
                <p className="text-slate-400 max-w-xs mx-auto">
                    The page you are looking for doesn't exist or has been moved.
                </p>
            </div>

            <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95"
            >
                <Home size={20} />
                Return Home
            </Link>
        </div>
    );
}
