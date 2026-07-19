import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const { error: schemaError } = await supabase
  .from('rank_up_rooms')
  .select('code, turn_order, turn_index, round_number, phase')
  .limit(1);

if (schemaError) {
  console.error('SCHEMA_CHECK_FAILED:', schemaError.code, schemaError.message);
  process.exit(2);
}

console.log('SCHEMA_CHECK_OK: turn_order, turn_index, round_number columns exist');

const testCode = 'ZZZZ';
await supabase.from('rank_up_rooms').delete().eq('code', testCode);

const { error: insertError } = await supabase.from('rank_up_rooms').insert({
  code: testCode,
  host_player_id: '00000000-0000-0000-0000-000000000001',
  ranker_player_id: '00000000-0000-0000-0000-000000000001',
  phase: 'round-recap',
  options: [],
  turn_order: [],
  turn_index: 0,
  round_number: 1,
});

if (insertError) {
  console.error('INSERT_CHECK_FAILED:', insertError.code, insertError.message);
  process.exit(3);
}

await supabase.from('rank_up_rooms').delete().eq('code', testCode);
console.log('INSERT_CHECK_OK: round-recap phase and rotation columns writable');
