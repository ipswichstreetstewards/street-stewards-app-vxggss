import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ztctmemegkqiwptzygbt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y3RtZW1lZ2txaXdwdHp5Z2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTE5NTgsImV4cCI6MjA3NzA2Nzk1OH0.4D-jsGjcO_VfYYYATFM_SCgTbfOcGR-eZWN7ja3zdJA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
