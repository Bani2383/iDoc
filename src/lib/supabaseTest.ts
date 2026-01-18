import { supabase } from './supabase';

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }

    console.log('Supabase connection successful!');
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: String(err) };
  }
}
