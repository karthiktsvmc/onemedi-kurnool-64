
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://vuxriqkscbpbernwlwjp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eHJpcWtzY2JwYmVybndsd2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDA3OTgsImV4cCI6MjA3MDc3Njc5OH0.WKoXIjiXDK718R7SX9Lzs7naIzvmuH386MKR0rFUkwU";

export const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export default supabaseClient;
