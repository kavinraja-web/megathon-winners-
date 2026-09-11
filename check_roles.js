import { createClient } from '@supabase/supabase-js';

const url = 'https://rbsedzsckorcoijxuxpz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic2VkenNja29yY29panh1eHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTc5MzcsImV4cCI6MjEwNDYzMzkzN30.88xrDHD63xZg0HJQAYkctiIDgaywggOWuUMlsYufdjE';
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('profiles').select('role').limit(10);
  console.log("Roles in profiles:", data);
}
test();
