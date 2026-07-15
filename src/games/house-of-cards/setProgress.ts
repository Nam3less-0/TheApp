import { SET_COUNT } from '../../data/house-of-cards/types';

const STORAGE_KEY = 'hoc-topic-set-progress-v1';

type TopicProgress = Record<string, number[]>;

function readProgress(): TopicProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TopicProgress;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeProgress(progress: TopicProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** Next set index (0–4) for a topic; skips sets already played this cycle. */
export function pickNextSetIndex(topicId: string): number {
  const progress = readProgress();
  const played = progress[topicId] ?? [];

  for (let index = 0; index < SET_COUNT; index += 1) {
    if (!played.includes(index)) return index;
  }

  progress[topicId] = [];
  writeProgress(progress);
  return 0;
}

/** Mark a set as played after a game starts with that topic. */
export function markSetPlayed(topicId: string, setIndex: number): void {
  const progress = readProgress();
  const played = progress[topicId] ?? [];
  if (!played.includes(setIndex)) {
    progress[topicId] = [...played, setIndex];
    writeProgress(progress);
  }
}

/** Reset progress for one topic or the entire pool (testing / admin). */
export function resetSetProgress(topicId?: string): void {
  if (!topicId) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const progress = readProgress();
  delete progress[topicId];
  writeProgress(progress);
}
