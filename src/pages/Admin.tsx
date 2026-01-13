
import { useState } from 'react';
import { getAdminFeed, deleteSubmission } from '../services/supabase';
import type { Submission } from '../types';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function Admin() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [pass, setPass] = useState('');
    const [authed, setAuthed] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const checkAuth = () => {
        // Simple MVP auth
        if (pass === 'hackathon2024') {
            setAuthed(true);
            fetchData();
        } else {
            alert('Wrong password');
        }
    };

    const fetchData = async () => {
        try {
            const data = await getAdminFeed();
            setSubmissions(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;
        try {
            await deleteSubmission(id);
            setSubmissions(s => s.filter(sub => sub.id !== id));
        } catch (e) {
            alert('Error deleting');
        }
    };

    if (!authed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Admin Access</h1>
                <input
                    type="password"
                    placeholder="Enter Admin Code"
                    className="p-2 rounded bg-slate-800 border border-slate-700"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                />
                <button onClick={checkAuth} className="bg-purple-600 px-4 py-2 rounded font-bold">Enter</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-red-500 flex items-center gap-2">
                <AlertTriangle /> Admin Panel
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {submissions.map(sub => (
                    <div key={sub.id} className="glass-card overflow-hidden flex flex-col group relative">
                        <div
                            className="relative w-full aspect-[4/3] cursor-zoom-in overflow-hidden bg-slate-800"
                            onClick={() => setSelectedImage(sub.photo_url)}
                        >
                            <img
                                src={sub.photo_url}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none">
                                    Click to Enlarge
                                </span>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col gap-3 flex-grow bg-slate-900/10">
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-white leading-tight mb-1">
                                    {sub.user_name} <span className="text-slate-500">&</span> {sub.peer_name}
                                </h3>
                                <p className="text-sm text-slate-400">{sub.user_team}</p>
                                <p className="text-sm text-slate-400 truncate">{sub.peer_college}</p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 mt-auto">
                                <span className="text-xs text-slate-600 font-mono">
                                    {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(sub.id);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
                    />
                    <button className="absolute top-4 right-4 p-4 text-white hover:text-red-400">
                        <Trash2 size={32} className="opacity-0" /> {/* Hidden visual cue or close icon could go here if needed, but clicking anywhere works */}
                        <span className="text-sm bg-black/50 px-2 py-1 rounded">Click anywhere to close</span>
                    </button>
                </div>
            )}
        </div>
    );
}
