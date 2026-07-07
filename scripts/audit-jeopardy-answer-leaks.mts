import { JEOPARDY_TOPICS } from '../src/data/jeopardy/index.ts';
import {
  answerAppearsInQuestion,
  ANSWER_LEAK_EXEMPT_TOPIC_IDS,
} from '../src/data/jeopardy/validateQuestion.ts';

const hits: {
  topicId: string;
  difficulty: number;
  question: string;
  answer: string;
}[] = [];

const byTopic = new Map<string, number>();

for (const topic of JEOPARDY_TOPICS) {
  if (ANSWER_LEAK_EXEMPT_TOPIC_IDS.has(topic.id)) continue;
  for (const entry of topic.questions) {
    if (answerAppearsInQuestion(entry.question, entry.answer)) {
      hits.push({
        topicId: topic.id,
        difficulty: entry.difficulty,
        question: entry.question,
        answer: entry.answer,
      });
      byTopic.set(topic.id, (byTopic.get(topic.id) ?? 0) + 1);
    }
  }
}

console.log(`Found ${hits.length} leaks:\n`);
console.log('By topic:');
for (const [topicId, count] of [...byTopic.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${topicId}: ${count}`);
}
console.log('');

for (const hit of hits) {
  console.log(`[${hit.topicId} d${hit.difficulty}]`);
  console.log(`  Q: ${hit.question}`);
  console.log(`  A: ${hit.answer}\n`);
}
