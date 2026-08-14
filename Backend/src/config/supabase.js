import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://nvtozwvlbjqbujnzafoh.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mSRd5dUpuEeF0OcFHdSAKg_13Ay72-K';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
