// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lczzaisvzahlqricnilo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjenphaXN2emFobHFyaWNuaWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMDMzMTAsImV4cCI6MjA2MTU3OTMxMH0.6ICSfmopBqyCYpXKHYJ1W5Mbej66cv1APuDcDpK9_ew";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);