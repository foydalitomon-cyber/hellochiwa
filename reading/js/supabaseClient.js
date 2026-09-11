// Supabase ulanish sozlamalari
const SUPABASE_URL = 'https://exicttrfficnkjyawhno.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_-HpLWwnbELQITRNhYMXQ8w_fgRjFAba';

// CDN bilan ishlash uchun window.supabase.createClient ishlatiladi
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,       // Sessiyani brauzer xotirasida (localStorage) saqlaydi
            autoRefreshToken: true,    // Token muddati tugasa, uni avtomatik yangilaydi
            detectSessionInUrl: true   // Google OAuth orqali qaytganda tokenni avtomatik ushlab qoladi
        }
    });
} else {
    console.error("Supabase CDN kutubxonasi yuklanmadi!");
}