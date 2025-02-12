import * as dotenv from 'dotenv';

// Load .env from the monorepo root
dotenv.config({ path: '../../../.env' });

export const environment = {
  supabaseUrl: process.env['SUPABASE_URL'] || '',
  supabaseKey: process.env['SUPABASE_KEY'] || '',
};
