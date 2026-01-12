// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// 🔧 Supabase ayarlarını gir
const SUPABASE_URL = 'https://khnwnznlnzctjlacfrib.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtobnduem5sbnpjdGpsYWNmcmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTEwNzgsImV4cCI6MjA4MzU2NzA3OH0.kAYxYdggFUMSX1bt7ese8TT-1V5tZNEDdP1zagsBxrg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

