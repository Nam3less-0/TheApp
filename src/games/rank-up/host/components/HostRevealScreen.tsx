import { useRankUpHost } from '../context';
import { labelForOption } from '../../utils';
import {
  CELL_TONE_STYLES,
  cellTone,
  guessedPosition,
} from '../comparisonGrid';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton, RankUpSecondaryButton } from '../../components/Layout';
import { CrownIcon } from '../../components/RankUpIcons';

export default function HostRevealScreen() {
  const { room, players, advanceTurn, isLastTurnOfRound, abandonRound } = useRankUpHost();

  if (!room?.rankerOrder?.length || !room.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);

  return (
    <RankUpPageWrap variant="display">
      <header className="mb-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6FA3C4]">
          Host display — reveal
        </p>
        <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight text-text-hi sm:text-3xl">
          Comparison grid
        </h1>
        <p className="mt-2 font-body text-sm text-text-mid">{room.prompt}</p>
        <p className="mt-2 inline-flex items-center justify-center gap-2 font-body text-sm text-text-mid">
          <CrownIcon className="h-4 w-4 text-pewter" />
          <span>
            {ranker?.name ?? 'Ranker'}&apos;s true order vs guesser placements
          </span>
        </p>
      </header>

      <RankUpPanel compact className="overflow-x-auto border-[#6FA3C4]/25 p-3 sm:p-4">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-[1] min-w-[180px] bg-[#1C1A20] px-3 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-text-low">
                True rank
              </th>
              {guessers.map((player) => (
                <th
                  key={player.id}
                  className="min-w-[88px] px-2 py-3 text-center font-body text-xs font-semibold text-text-hi"
                >
                  {player.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {room.rankerOrder.map((itemId, trueIndex) => (
              <tr key={itemId}>
                <td className="sticky left-0 z-[1] border-t border-line bg-[#1C1A20] px-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-pewter">{trueIndex + 1}</span>
                    <span className="font-body text-sm font-semibold text-text-hi">
                      {labelForOption(room.options, itemId)}
                    </span>
                  </div>
                </td>
                {guessers.map((player) => {
                  const guessedIndex = guessedPosition(player.guessOrder, itemId);
                  if (guessedIndex == null) {
                    return (
                      <td key={player.id} className="border-t border-line px-2 py-2 text-center">
                        <span className="font-mono text-sm text-text-low">—</span>
                      </td>
                    );
                  }

                  const tone = cellTone(trueIndex, guessedIndex);
                  const style = CELL_TONE_STYLES[tone];

                  return (
                    <td key={player.id} className="border-t border-line px-2 py-2">
                      <div
                        className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border font-mono text-sm font-bold"
                        style={{
                          backgroundColor: style.bg,
                          borderColor: style.border,
                          color: style.text,
                        }}
                        title={`Guessed #${guessedIndex + 1}`}
                      >
                        {guessedIndex + 1}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </RankUpPanel>

      <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-4">
        {(Object.entries(CELL_TONE_STYLES) as Array<[keyof typeof CELL_TONE_STYLES, typeof CELL_TONE_STYLES.exact]>).map(
          ([tone, style]) => (
            <div key={tone} className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-md border"
                style={{ backgroundColor: style.bg, borderColor: style.border }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-mid">
                {style.label}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3">
        <RankUpPrimaryButton onClick={() => advanceTurn()} className="w-full">
          {isLastTurnOfRound ? 'See round recap' : 'Next turn'}
        </RankUpPrimaryButton>
        <RankUpSecondaryButton
          onClick={() => {
            if (window.confirm('Abandon the current round for everyone and return to the lobby? Scores are kept.')) {
              void abandonRound();
            }
          }}
          className="w-full text-center text-bad hover:border-bad/40 hover:text-bad"
        >
          Abandon round
        </RankUpSecondaryButton>
      </div>
    </RankUpPageWrap>
  );
}
