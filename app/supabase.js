import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kqkprfgkzijlnyrrzbuf.supabase.co'; // kendi URL’n
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxa3ByZmdremlqbG55cnJ6YnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjExNjgsImV4cCI6MjA3NDczNzE2OH0.zxy942v9uXTo-LSwcz1IHhuF6MWXRBDgLixi-xGz_ZM'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
