const SUPABASE_URL = "https://qxgimcqpzfscflsbenyh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Z2ltY3FwemZzY2Zsc2JlbnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQxNDQsImV4cCI6MjEwMDk5MDE0NH0.m32fpKuVnQt9rihu1lG3jeDJonYHyPHGHhRHmCD42lk";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);