import { motion } from 'framer-motion';
import { useJeopardy } from '../context';
import {
  COLORS,
  LIGHTNING_REMAINING,
  boardShapeFor,
  boardTileValue,
  countRemainingCells,
  formatScore,
  getCellByColumnAndDifficulty,
  inflationFactor,
  isCellBlockedThisTurn,
  playSound,
} from '../utils';
import ScoreChips from './ScoreChips';
import { JeopardyPageWrap } from './JeopardyPanel';

export default function BoardScreen() {
  const { state, dispatch } = useJeopardy();
  const activePlayer = state.players[state.currentPlayerIndex];
  const remaining = countRemainingCells(state.cells);
  const difficulties = boardShapeFor(state.settings).difficulties;
  const inflate = inflationFactor(state.settings, state.cells);
  const hideValues = state.settings.hiddenValues;

  function handleSelect(cellId: string) {
    // Always the neutral pick sound — a double must stay a surprise.
    playSound('select', state.settings.soundEnabled);
    dispatch({ type: 'SELECT_CELL', cellId });
  }

  return (
    <JeopardyPageWrap>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <motion.span
            key={activePlayer?.id}
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: COLORS.sapphireBright }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <div>
            <div className="font-display text-[15px] font-bold text-text-hi">
              {activePlayer?.name}&rsquo;s turn
            </div>
            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-text-low">
              {remaining} clue{remaining === 1 ? '' : 's'} left
              {state.settings.strictRotation
                ? ' · pick always passes'
                : ' · get it right to pick again'}
              {state.settings.freeLowTiles
                ? ''
                : ' · one $200 & $400 per turn'}
              {state.settings.openPicking ? ' · tap a name to hand off' : ''}
              {state.settings.lightningFinish && remaining <= LIGHTNING_REMAINING
                ? ' · lightning'
                : ''}
              {inflate > 1 ? ` · ${inflate}× values` : ''}
              {state.settings.invertedValues ? ' · inverted' : ''}
              {state.settings.hiddenValues ? ' · mystery $' : ''}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {state.settings.missPot && (
            <div
              className="rounded-full border px-3 py-1.5 font-mono text-[11px]"
              style={{
                borderColor: `color-mix(in srgb, ${COLORS.goldBright} 40%, transparent)`,
                color: COLORS.goldBright,
                background: `color-mix(in srgb, ${COLORS.gold} 12%, #1A1C20)`,
              }}
              title="Taken by the next correct answer"
            >
              Pot {formatScore(state.scorePot)}
            </div>
          )}
        <ScoreChips
          players={state.players}
          activePlayerId={activePlayer?.id ?? null}
          onSelectPlayer={
            state.settings.openPicking
              ? (playerId) => dispatch({ type: 'SET_PICKER', playerId })
              : undefined
          }
        />
        </div>
      </div>

      {state.undoSnapshot && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
          <span className="font-mono text-[11px] text-text-mid">
            Marked the wrong result? You can undo the last clue.
          </span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'UNDO_RESOLVE' })}
            className="shrink-0 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-steel-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            ↩ Undo last
          </button>
        </div>
      )}

      <div className="grid grid-cols-6 gap-1.5">
        {state.columns.map((column) => (
          <div
            key={column.id}
            className="flex min-h-[50px] items-center justify-center overflow-hidden rounded-lg px-0.5 py-2 text-center font-display text-[8px] font-bold leading-tight tracking-normal hyphens-auto break-words sm:px-1 sm:py-2.5 sm:text-[9.5px] sm:tracking-[0.3px]"
            style={{
              background: `linear-gradient(180deg, ${COLORS.sapphire}, ${COLORS.sapphireDim})`,
              color: '#F2F4F8',
            }}
          >
            {state.settings.hiddenCategories &&
            !state.revealedColumnIds.includes(column.id)
              ? '???'
              : column.name}
          </div>
        ))}

        {difficulties.map((difficulty) =>
          state.columns.map((column, columnIndex) => {
            const cell = getCellByColumnAndDifficulty(
              state.cells,
              columnIndex,
              difficulty,
            );
            if (!cell) return null;

            if (cell.used) {
              return (
                <div
                  key={cell.id}
                  className="flex aspect-[5/4] items-center justify-center rounded-lg border border-line font-display text-xs text-text-low"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  aria-hidden="true"
                >
                  &mdash;
                </div>
              );
            }

            const blockedThisTurn = isCellBlockedThisTurn(
              cell.value,
              state.turnPickedValues,
              state.settings.freeLowTiles,
            );
            const shownValue = hideValues
              ? '???'
              : boardTileValue(cell, state.settings, state.cells);
            const valueLabel = hideValues
              ? `${column.name}, hidden value`
              : `${column.name} for ${shownValue} points`;

            if (blockedThisTurn) {
              return (
                <div
                  key={cell.id}
                  className="flex aspect-[5/4] flex-col items-center justify-center rounded-lg border border-line font-display text-sm font-extrabold tracking-[0.5px] text-text-low opacity-45"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  title={
                    hideValues
                      ? 'Already picked this value this turn'
                      : `Already picked a $${cell.value} clue this turn`
                  }
                  aria-label={`${valueLabel} — already picked this turn`}
                >
                  {shownValue}
                </div>
              );
            }

            // Double Trouble tiles look identical to every other tile so the
            // bonus stays hidden until the clue is opened.
            return (
              <motion.button
                key={cell.id}
                type="button"
                onClick={() => handleSelect(cell.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                className="relative flex aspect-[5/4] items-center justify-center rounded-lg border font-display text-sm font-extrabold tracking-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                style={{
                  background: `linear-gradient(165deg, ${COLORS.sapphire}, ${COLORS.sapphireDim} 80%)`,
                  borderColor: `color-mix(in srgb, ${COLORS.sapphireBright} 30%, transparent)`,
                  color: COLORS.goldBright,
                  boxShadow:
                    '0 4px 12px -6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
                aria-label={valueLabel}
              >
                {shownValue}
              </motion.button>
            );
          }),
        )}
      </div>

      {state.settings.finalJeopardy && (
        <p className="mt-3 text-center font-mono text-[10.5px] text-text-low">
          Final Jeopardy waits after the board is cleared.
        </p>
      )}
    </JeopardyPageWrap>
  );
}
