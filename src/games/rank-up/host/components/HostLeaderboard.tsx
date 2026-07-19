import { useMemo } from 'react';
import { useRankUpHost } from '../context';
import { CrownIcon } from '../../components/RankUpIcons';

const RANK_TIERS = [
  {
    label: '1st',
    rankText: 'text-[#FFE08A]',
    rankBg: 'linear-gradient(135deg, rgba(216,179,106,0.35), rgba(120,90,40,0.15))',
    rowBorder: 'border-[#D8B36A]/55',
    rowGlow: '0 0 32px rgba(216,179,106,0.18), inset 0 1px 0 rgba(255,224,138,0.12)',
    bar: 'linear-gradient(90deg, #D8B36A, #FFE08A)',
    badge: 'LEADER',
  },
  {
    label: '2nd',
    rankText: 'text-[#E8EDF2]',
    rankBg: 'linear-gradient(135deg, rgba(195,201,209,0.22), rgba(80,85,92,0.12))',
    rowBorder: 'border-[#C3C9D1]/45',
    rowGlow: '0 0 20px rgba(195,201,209,0.08)',
    bar: 'linear-gradient(90deg, #9AA3AD, #E8EDF2)',
    badge: '2ND',
  },
  {
    label: '3rd',
    rankText: 'text-[#E8B48A]',
    rankBg: 'linear-gradient(135deg, rgba(192,138,92,0.22), rgba(90,60,40,0.12))',
    rowBorder: 'border-[#C08A5C]/45',
    rowGlow: '0 0 16px rgba(192,138,92,0.08)',
    bar: 'linear-gradient(90deg, #A66B42, #E8B48A)',
    badge: '3RD',
  },
] as const;

const DEFAULT_TIER = {
  label: '',
  rankText: 'text-text-mid',
  rankBg: 'linear-gradient(135deg, rgba(111,163,196,0.12), rgba(28,26,32,0.4))',
  rowBorder: 'border-line',
  rowGlow: 'none',
  bar: 'linear-gradient(90deg, #4E7F9C, #6FA3C4)',
  badge: '',
};

function tierForRank(index: number) {
  return RANK_TIERS[index] ?? DEFAULT_TIER;
}

interface HostLeaderboardProps {
  variant?: 'sidebar' | 'hero';
}

export default function HostLeaderboard({ variant = 'sidebar' }: HostLeaderboardProps) {
  const { room, players, roundNumber } = useRankUpHost();
  const hero = variant === 'hero';

  const standings = useMemo(
    () => [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [players],
  );

  const leaderScore = standings[0]?.score ?? 0;
  const maxScore = Math.max(leaderScore, 1);
  const showTurnDelta = room?.phase === 'reveal';
  const turnLabel =
    room && room.turnOrder.length > 0
      ? `Round ${roundNumber} · Turn ${room.turnIndex + 1} of ${room.turnOrder.length}`
      : `Round ${roundNumber}`;

  return (
    <section
      className={`relative overflow-hidden rounded-[22px] border ${
        hero ? 'mx-auto max-w-4xl border-[#6FA3C4]/35' : 'border-[#6FA3C4]/25'
      }`}
      style={{
        background:
          'linear-gradient(165deg, rgba(36,34,40,0.98) 0%, rgba(20,18,24,0.99) 55%, rgba(28,26,32,0.98) 100%)',
        boxShadow: hero
          ? '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(111,163,196,0.12)'
          : '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(111,163,196,0.08)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% -20%, rgba(111,163,196,0.18), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className={`relative ${hero ? 'px-6 py-7 sm:px-8 sm:py-9' : 'px-4 py-5'}`}>
        <header className={hero ? 'mb-8 text-center' : 'mb-5 text-center'}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6FA3C4]/30 bg-[#6FA3C4]/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6FA3C4] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6FA3C4]" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8BB8D4]">
              Live standings
            </span>
          </div>

          <h2
            className={`mt-4 font-display font-extrabold uppercase tracking-[0.06em] text-text-hi ${
              hero ? 'text-[34px] sm:text-[42px]' : 'text-2xl'
            }`}
            style={{
              textShadow: hero ? '0 0 28px rgba(111,163,196,0.25)' : undefined,
            }}
          >
            Leaderboard
          </h2>

          <p
            className={`mt-2 font-mono uppercase tracking-[0.14em] text-text-low ${
              hero ? 'text-xs' : 'text-[10px]'
            }`}
          >
            {turnLabel}
          </p>
        </header>

        {standings.length === 0 ? (
          <p className="text-center font-body text-sm text-text-mid">Waiting for players…</p>
        ) : hero && standings.length >= 2 ? (
          <div className="mb-8 flex items-end justify-center gap-3 sm:gap-5">
            {[1, 0, 2].map((rankIndex) => {
              const player = standings[rankIndex];
              if (!player) {
                return <div key={`empty-${rankIndex}`} className="w-[88px] sm:w-[110px]" />;
              }

              const tier = tierForRank(rankIndex);
              const heightClass =
                rankIndex === 0 ? 'h-[132px] sm:h-[156px]' : rankIndex === 1 ? 'h-[108px] sm:h-[124px]' : 'h-[96px] sm:h-[112px]';

              return (
                <div key={player.id} className="flex w-[88px] flex-col items-center sm:w-[110px]">
                  <div
                    className={`flex w-full flex-col items-center justify-end rounded-2xl border px-2 pb-3 pt-4 ${tier.rowBorder}`}
                    style={{
                      height: heightClass,
                      background:
                        'linear-gradient(180deg, rgba(36,34,40,0.95), rgba(18,16,22,0.98))',
                      boxShadow: tier.rowGlow,
                    }}
                  >
                    <span className={`font-mono text-[10px] uppercase ${tier.rankText}`}>
                      {tier.label}
                    </span>
                    <p className="mt-2 max-w-full truncate font-display text-base font-extrabold text-text-hi sm:text-lg">
                      {player.name}
                    </p>
                    <p className={`mt-1 font-display text-2xl font-extrabold sm:text-3xl ${tier.rankText}`}>
                      {player.score}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <ol className={`flex flex-col ${hero ? 'gap-3 sm:gap-3.5' : 'gap-2.5'}`}>
          {standings.map((player, index) => {
            const isRanker = player.id === room?.rankerPlayerId;
            const tier = tierForRank(index);
            const gapToLeader = leaderScore - player.score;
            const scorePct = Math.max(8, Math.round((player.score / maxScore) * 100));

            return (
              <li
                key={player.id}
                className={`relative overflow-hidden rounded-2xl border ${tier.rowBorder} ${
                  hero ? 'px-4 py-4 sm:px-5 sm:py-[18px]' : 'px-3 py-3'
                } ${index === 0 ? 'scale-[1.01]' : ''}`}
                style={{
                  background:
                    index === 0
                      ? 'linear-gradient(90deg, rgba(216,179,106,0.08), rgba(28,26,32,0.92) 38%, rgba(28,26,32,0.96))'
                      : 'linear-gradient(90deg, rgba(111,163,196,0.05), rgba(28,26,32,0.94))',
                  boxShadow: tier.rowGlow,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
                  style={{ background: tier.bar }}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex shrink-0 items-center justify-center rounded-xl border border-white/10 font-display font-extrabold ${
                      hero ? 'h-12 w-12 text-lg sm:h-14 sm:w-14 sm:text-xl' : 'h-9 w-9 text-sm'
                    } ${tier.rankText}`}
                    style={{ background: tier.rankBg }}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`truncate font-display font-extrabold text-text-hi ${
                          hero ? 'text-xl sm:text-2xl' : 'text-base'
                        }`}
                      >
                        {player.name}
                      </p>

                      {index === 0 && leaderScore > 0 ? (
                        <span className="rounded-full border border-[#D8B36A]/40 bg-[#D8B36A]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#FFE08A]">
                          In the lead
                        </span>
                      ) : null}

                      {isRanker ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-pewter/40 bg-pewter/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-pewter">
                          <CrownIcon className="h-3 w-3" />
                          Ranker
                        </span>
                      ) : null}

                      {showTurnDelta && player.lastRoundPoints != null && player.lastRoundPoints > 0 ? (
                        <span className="rounded-full border border-good/35 bg-good/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-good">
                          +{player.lastRoundPoints}
                        </span>
                      ) : null}
                    </div>

                    <div className={`mt-2 ${hero ? 'max-w-md' : 'max-w-xs'}`}>
                      <div className="h-1.5 overflow-hidden rounded-full bg-deep/90">
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{
                            width: `${scorePct}%`,
                            background: tier.bar,
                            boxShadow: index === 0 ? '0 0 12px rgba(216,179,106,0.45)' : undefined,
                          }}
                        />
                      </div>
                    </div>

                    {index > 0 && gapToLeader > 0 ? (
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#C08A5C]">
                        {gapToLeader} pt{gapToLeader === 1 ? '' : 's'} behind
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`font-display font-extrabold leading-none ${
                        index === 0 ? 'text-[#FFE08A]' : 'text-text-hi'
                      } ${hero ? 'text-4xl sm:text-[44px]' : 'text-3xl'}`}
                      style={{
                        textShadow:
                          index === 0 ? '0 0 24px rgba(216,179,106,0.35)' : undefined,
                      }}
                    >
                      {player.score}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-text-low">
                      pts
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
