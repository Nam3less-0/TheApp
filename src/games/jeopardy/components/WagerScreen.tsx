import { useJeopardy } from '../context';
import { COLORS, formatScore, maxDailyDoubleWager, playSound } from '../utils';
import { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';
import WagerControl from './WagerControl';

export default function WagerScreen() {
  const { state, dispatch } = useJeopardy();
  const cell = state.cells.find((c) => c.id === state.activeCellId);
  const player = state.players[state.currentPlayerIndex];
  if (!cell || !player) return null;

  const topicName = state.columns[cell.columnIndex]?.name ?? '';
  const max = maxDailyDoubleWager(player.score);

  return (
    <JeopardyPageWrap>
      <div
        className="rounded-[18px] border p-5 sm:p-7"
        style={{
          borderColor: `color-mix(in srgb, ${COLORS.doubleBright} 45%, transparent)`,
          background: 'linear-gradient(180deg, #222428, #1A1C20)',
          boxShadow: `0 0 40px -20px ${COLORS.doubleBright}`,
        }}
      >
        <div className="mb-4 text-center">
          <div
            className="mb-2 inline-block rounded-[6px] border px-2.5 py-1 font-mono text-[10px] tracking-wider"
            style={{
              background: 'rgba(201,136,59,0.25)',
              borderColor: COLORS.doubleBright,
              color: COLORS.doubleBright,
            }}
          >
            ⚡ DAILY DOUBLE
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-text-low">
            {topicName}
          </div>
        </div>

        <div className="mb-5 flex items-center justify-center gap-2.5">
          <PlayerAvatar name={player.name} size="sm" />
          <span className="font-body text-sm font-semibold text-text-hi">
            {player.name}, place your wager
          </span>
        </div>

        <WagerControl
          min={0}
          max={max}
          initial={Math.min(cell.value, max)}
          confirmLabel="Lock in wager"
          hint={`Score ${formatScore(player.score)} · wager up to ${formatScore(max)}`}
          onConfirm={(amount) => {
            playSound('double', state.settings.soundEnabled);
            dispatch({ type: 'SET_WAGER', amount });
          }}
        />
      </div>
    </JeopardyPageWrap>
  );
}
