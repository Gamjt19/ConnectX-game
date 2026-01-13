
import { createClient } from '@supabase/supabase-js';
import type { Submission } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// --- User Identity Helper ---
export function getOrCreateUserId(): string {
    let userId = localStorage.getItem('hackathon_user_id');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('hackathon_user_id', userId);
    }
    return userId;
}

export function saveUserProfile(name: string, team: string) {
    localStorage.setItem('hackathon_user_name', name);
    localStorage.setItem('hackathon_user_team', team);
}

export function getUserProfile() {
    return {
        name: localStorage.getItem('hackathon_user_name') || '',
        team: localStorage.getItem('hackathon_user_team') || ''
    };
}
// ----------------------------

export async function uploadPhoto(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { error } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

    return publicUrl;
}

export async function submitConnection(submission: Omit<Submission, 'id' | 'created_at' | 'is_valid' | 'user_id'>) {
    const userId = getOrCreateUserId();

    // Save profile for autofill later
    saveUserProfile(submission.user_name, submission.user_team);

    const { data, error } = await supabase
        .from('submissions')
        .insert([{ ...submission, user_id: userId }])
        .select();

    if (error) throw error;
    return data;
}

export async function getLiveFeed() {
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    return data as Submission[];
}

export async function getLeaderboard() {
    // Fetch all valid submissions
    const { data, error } = await supabase
        .from('submissions')
        .select('user_id, user_name, user_team')
        .eq('is_valid', true)
        .order('created_at', { ascending: true }); // Oldest first to let newer names override? Or newest? 
    // Actually, let's just count.

    if (error) throw error;

    // Aggregation logic
    // Key = user_id (So even if they change name, their score aggregates)
    const players: Record<string, { id?: string, name: string, team: string, score: number, last_seen: number }> = {};

    data.forEach((sub: any) => {
        const id = sub.user_id;
        // If we haven't seen this ID, init it. 
        if (!players[id]) {
            players[id] = { id: id, name: sub.user_name, team: sub.user_team, score: 0, last_seen: 0 };
        }

        // Update score
        players[id].score += 1;

        // Update name/team to the LATEST used (assuming data order or simply overwriting works for "correcting typos")
        players[id].name = sub.user_name;
        players[id].team = sub.user_team;
    });

    return Object.values(players).sort((a, b) => b.score - a.score);
}

export async function deleteSubmission(id: string) {
    // 1. Get the photo path first
    const { data: submission, error: fetchError } = await supabase
        .from('submissions')
        .select('photo_url')
        .eq('id', id)
        .single();

    if (fetchError) throw fetchError;

    if (submission?.photo_url) {
        // Extract filename from URL (assumes standard Supabase Storage URL structure)
        const parts = submission.photo_url.split('/');
        const fileName = parts[parts.length - 1]; // Naive extraction, usually safe for this app

        // 2. Delete from Storage
        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('photos')
                .remove([fileName]);

            if (storageError) console.error('Error removing photo:', storageError);
        }
    }

    // 3. Delete from DB
    const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function getAdminFeed() {
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Submission[];
}
