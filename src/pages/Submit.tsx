
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { getUserProfile, uploadPhoto, submitConnection } from '../services/supabase';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

export default function Submit() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photo, setPhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Load initial state from local storage if available
    const savedProfile = getUserProfile();
    const [formData, setFormData] = useState({
        user_name: savedProfile.name || '',
        user_team: savedProfile.team || '',
        peer_name: '',
        peer_college: ''
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true
            };

            const compressedFile = await imageCompression(file, options);
            setPhoto(compressedFile);
            setPreviewUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Compression error:", error);
            // Fallback to original
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!photo) return alert("Photo is mandatory!");

        setLoading(true);
        try {
            const publicUrl = await uploadPhoto(photo);

            if (!publicUrl) throw new Error("Upload failed");

            await submitConnection({
                user_name: formData.user_name,
                user_team: formData.user_team,
                peer_name: formData.peer_name,
                peer_college: formData.peer_college,
                photo_url: publicUrl
            });

            // Celebration!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#a855f7', '#ec4899', '#3b82f6']
            });

            setTimeout(() => {
                navigate('/live-feed');
            }, 1000);
        } catch (error) {
            console.error(error);
            alert("Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                New Connection
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload Area */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Photo with Peer</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "relative aspect-video rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors overflow-hidden group",
                            previewUrl ? "border-purple-500" : ""
                        )}
                    >
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <div className="p-3 bg-slate-800 rounded-full">
                                    <Camera className="w-6 h-6 text-purple-400" />
                                </div>
                                <p className="text-sm">Tap to take photo</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500">Your Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Alice"
                            value={formData.user_name}
                            onChange={e => setFormData({ ...formData, user_name: e.target.value })}
                            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500">Your Team</label>
                        <input
                            required
                            type="text"
                            placeholder="Hackers"
                            value={formData.user_team}
                            onChange={e => setFormData({ ...formData, user_team: e.target.value })}
                            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500">Peer's Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Bob"
                            value={formData.peer_name}
                            onChange={e => setFormData({ ...formData, peer_name: e.target.value })}
                            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500">Peer's College / Info</label>
                        <input
                            required
                            type="text"
                            placeholder="MIT"
                            value={formData.peer_college}
                            onChange={e => setFormData({ ...formData, peer_college: e.target.value })}
                            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                    {loading ? 'Publishing...' : 'Submit Connection'}
                </button>

            </form>
        </div>
    );
}
