import { createClient } from '@supabase/supabase-js';

const url = 'https://rbsedzsckorcoijxuxpz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic2VkenNja29yY29panh1eHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTc5MzcsImV4cCI6MjEwNDYzMzkzN30.88xrDHD63xZg0HJQAYkctiIDgaywggOWuUMlsYufdjE';
const supabase = createClient(url, key);

async function test() {
  const email = 'test_pharmacy_' + Date.now() + '@example.com';
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'password123',
    options: {
      data: { role: 'pharmacy', full_name: 'Test Pharmacy' }
    }
  });
  
  if (data?.session) {
    const res = await supabase.from('returns').insert({
      tracking_id: "RET-2026-123456", 
      medicine_name: "Test", 
      batch_number: "123", 
      tablet_id: "123", 
      quantity_expected: 1, 
      pharmacy_id: data.user.id, 
      return_reason: "Expired", 
      status: "INITIATED"
    });
    console.log("Insert result (NO dist ID):", res.error);
  }
}
test();
