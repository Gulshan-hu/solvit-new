import { createClient } from '@supabase/supabase-js';

// Vite üçün mühit dəyişənlərini bu şəkildə oxuyuruq
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL və ya Key tapılmadı! .env faylını yoxlayın.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);