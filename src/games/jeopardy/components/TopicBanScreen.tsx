import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useJeopardy } from '../context';
import { JEOPARDY_TOPICS } from '../../../data/jeopardy';
import { getTopicSummariesForTheme } from '../utils';
import JeopardyPanel, { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';

const GOLD_BUTTON = 'linear-gradient(180deg, #EAC870, #C9A44A 55%, #8A6F2A)';

function topicName(id: string): string {
  return JEOPARDY_TOPICS.find((t) => t.id === id)?.name ?? id;
}

function BanChoiceView() {
  const { state, dispatch } = useJeopardy();
  const previousBans = state.blacklistedTopicIds;
  const hasPrevious = previousBans.length > 0;

  return (
    <JeopardyPageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
        Ban phase
      </p>
      <h1 className="mb-2 text-center font-display text-2xl font-extrabold text-text-hi sm:text-[30px]">
        Topic bans
      </h1>
      <p className="mx-auto mb-6 max-w-[360px] text-center font-body text-sm text-text-mid">
        {hasPrevious
          ? 'Keep last game\u2019s bans, pick a new list, or skip straight to categories.'
          : 'Each player can ban one topic they don\u2019t want on the board \u2014 or skip this and pick categories now.'}
      </p>

      {hasPrevious && (
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {previousBans.map((id) => (
            <span
              key={id}
              className="rounded-full border border-bad/40 bg-bad/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-bad"
            >
              {topicName(id)}
            </span>
          ))}
        </div>
      )}

      <JeopardyPanel>
        <div className="flex flex-col gap-2.5">
          {hasPrevious && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'KEEP_TOPIC_BANS' })}
              className="w-full rounded-xl border-none px-4 py-3.5 font-display text-base font-extrabold text-void"
              style={{ background: GOLD_BUTTON }}
            >
              Keep these bans
            </button>
          )}
          <button
            type="button"
            onClick={() => dispatch({ type: 'START_TOPIC_BAN' })}
            className={`w-full rounded-xl px-4 py-3.5 font-display text-base font-extrabold ${
              hasPrevious
                ? 'border border-line text-text-hi transition-colors hover:border-line-bright'
                : 'border-none text-void'
            }`}
            style={hasPrevious ? undefined : { background: GOLD_BUTTON }}
          >
            {hasPrevious ? 'Reselect bans' : 'Start banning'}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SKIP_TOPIC_BAN' })}
            className="w-full rounded-xl border border-line px-4 py-3.5 font-body text-[15px] font-semibold text-text-hi transition-colors hover:border-line-bright"
          >
            Skip to categories
          </button>
        </div>
      </JeopardyPanel>

      <button
        type="button"
        onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
        className="mt-3 w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright"
      >
        Back to setup
      </button>
    </JeopardyPageWrap>
  );
}

function BanPickingView() {
  const { state, dispatch } = useJeopardy();
  const [query, setQuery] = useState('');

  const picker = state.pendingPlayers[state.banPickerIndex];
  const lockedBans = state.blacklistedTopicIds.slice(0, state.banPickerIndex);
  const myBan = state.blacklistedTopicIds[state.banPickerIndex] ?? null;
  const topics = useMemo(
    () => getTopicSummariesForTheme(state.settings.themeId),
    [state.settings.themeId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => t.name.toLowerCase().includes(q));
  }, [query, topics]);

  if (!picker) return null;

  return (
    <JeopardyPageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
        Ban phase &middot; player {state.banPickerIndex + 1} of {state.pendingPlayers.length}
      </p>

      <div className="mb-4 flex items-center justify-center gap-2">
        {state.pendingPlayers.map((_, i) => (
          <span
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === state.banPickerIndex ? '22px' : '9px',
              background:
                i < state.banPickerIndex
                  ? 'rgba(201,164,74,0.5)'
                  : i === state.banPickerIndex
                    ? '#C9A44A'
                    : 'rgba(220,224,232,0.2)',
            }}
          />
        ))}
      </div>

      <div className="mb-5 flex flex-col items-center gap-2 text-center">
        <PlayerAvatar name={picker.name} size="lg" />
        <h1 className="font-display text-2xl font-extrabold text-text-hi">{picker.name}</h1>
        <p className="max-w-[320px] font-body text-[13px] text-text-mid">
          Ban <span className="font-bold text-text-hi">one</span> topic you don&rsquo;t want showing up
          on the board tonight.
        </p>
      </div>

      {lockedBans.length > 0 && (
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {lockedBans.map((id) => (
            <span
              key={id}
              className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-low"
            >
              {topicName(id)} banned
            </span>
          ))}
        </div>
      )}

      <JeopardyPanel className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics…"
          className="mb-3 w-full rounded-xl border border-line bg-void px-3.5 py-2.5 font-body text-sm text-text-hi placeholder:text-text-low focus:border-gold focus:outline-none"
        />

        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-low">
            {myBan ? '1 / 1 chosen' : '0 / 1 chosen'}
          </span>
          <span className="font-mono text-[10px] text-text-low">
            {filtered.length} of {topics.length}
          </span>
        </div>

        <div className="max-h-[340px] overflow-y-auto pr-1">
          <ul className="grid grid-cols-2 gap-1.5">
            {filtered.map((topic) => {
              const isMine = myBan === topic.id;
              const bannedEarlier = lockedBans.includes(topic.id);
              return (
                <li key={topic.id}>
                  <button
                    type="button"
                    disabled={bannedEarlier}
                    onClick={() => dispatch({ type: 'BAN_TOPIC', topicId: topic.id })}
                    className={`flex w-full items-center gap-1.5 rounded-lg border px-2.5 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                      isMine ? 'border-bad text-bad' : 'border-line text-text-mid hover:border-line-bright'
                    }`}
                    style={isMine ? { background: 'rgba(224,139,122,0.12)' } : undefined}
                  >
                    <span className="font-mono text-[10px]">
                      {isMine ? '✕' : bannedEarlier ? '—' : '+'}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-body text-[12px]">{topic.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {filtered.length === 0 && (
            <p className="py-6 text-center font-body text-[13px] text-text-low">
              Nothing matches &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </JeopardyPanel>

      {myBan && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 rounded-xl border border-bad/40 bg-bad/10 px-3.5 py-2.5 text-center"
        >
          <p className="font-body text-[13px] text-text-hi">
            Banning <span className="font-bold text-bad">{topicName(myBan)}</span>
          </p>
        </motion.div>
      )}

      <button
        type="button"
        disabled={!myBan}
        onClick={() => {
          dispatch({ type: 'CONFIRM_TOPIC_BAN' });
          setQuery('');
        }}
        className="w-full rounded-xl border-none px-4 py-3.5 font-display text-base font-extrabold text-void transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: GOLD_BUTTON }}
      >
        {state.banPickerIndex + 1 < state.pendingPlayers.length
          ? 'Lock in — pass to next player'
          : 'Lock in — draw the board'}
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: 'SKIP_TOPIC_BAN' })}
        className="mt-2.5 w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright"
      >
        {state.blacklistedTopicIds.length > 0
          ? 'Skip remaining bans'
          : 'Skip to categories'}
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
        className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright"
      >
        Back to setup
      </button>
    </JeopardyPageWrap>
  );
}

export default function TopicBanScreen() {
  const { state } = useJeopardy();
  if (state.banStage !== 'picking') return <BanChoiceView />;
  return <BanPickingView />;
}
