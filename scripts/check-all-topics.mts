import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const dir = new URL('../src/data/jeopardy/topics/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.ts')).sort();

const loadFailures: string[] = [];

for (const file of files) {
  try {
    await import(new URL(file, dir).href);
    console.log(`OK ${file}`);
  } catch (error) {
    const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
    loadFailures.push(`${file}: ${message}`);
    console.log(`FAIL ${file}: ${message}`);
  }
}

console.log(`\nLoad failures: ${loadFailures.length}`);
if (loadFailures.length > 0) process.exit(1);
