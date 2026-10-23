const SUPABASE_URL = "https://hkxhfonfgqgdbkpwbtva.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhreGhmb25mZ3FnZGJrcHdidHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTgwNzMsImV4cCI6MjEwMDk5NDA3M30.IaJgYYJoucmvr1X-MYqjmj2y7_cmy_ZLBh_QJgjf7_Q";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
