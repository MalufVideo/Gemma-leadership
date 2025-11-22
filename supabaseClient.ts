import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://supabase.onav.com.br';
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1NDEwMzkwMCwiZXhwIjo0OTA5Nzc3NTAwLCJyb2xlIjoiYW5vbiJ9.x8W-_hIodLFUZnajC1Jhu_wz9DaqceG2o5EwTq_RL9M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);