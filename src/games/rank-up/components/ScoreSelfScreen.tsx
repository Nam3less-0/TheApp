import { useRankUp } from '../context';
import { labelForOption } from '../utils';
import RankUpPanel, { RankUpPageWrap, RankUpSectionHeading } from './Layout';

const SCORE_OPTIONS = [
  {
    points: 3 as const,
    label: 'Perfect match',
    description: 'My order was exactly the same',
    className: 'border-good/50 bg-good/10 hover:border-good',
    badge: '+3',
  },
  {
    points: 1 as const,
    label: 'Closest guess',
    description: 'I was closest, but not perfect',
    className: 'border-pewter/50 bg-pewter/10 hover:border-pewter',
    badge: '+1',
  },
  {
    points: 0 as const,
    label: 'Miss',
    description: "Wasn't closest",
    className: 'border-line bg-surface/80 hover:border-line-bright',
    badge: '+0',
  },
];

export default function ScoreSelfScreen() {
  const { local, room, selfScore } = useRankUp();

  const options = room?.options ?? [];

  return (
    <RankUpPageWrap>
      <header className="mb-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
          Score yourself
        </p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          How did you do?
        </h1>
      </header>

      <RankUpPanel compact className="mb-6">
        <RankUpSectionHeading title="Your guess" className="mb-3" />
        <ol className="flex flex-col gap-1.5">
          {local.lastGuessOrder.map((id, index) => (
            <li
              key={id}
              className="flex items-center gap-2 rounded-lg bg-deep/50 px-3 py-2 font-body text-[13px] text-text-hi"
            >
              <span className="w-4 font-mono text-[11px] text-text-low">{index + 1}</span>
              {labelForOption(options, id)}
            </li>
          ))}
        </ol>
      </RankUpPanel>

      <div className="flex flex-col gap-3">
        {SCORE_OPTIONS.map((option) => (
          <button
            key={option.points}
            type="button"
            onClick={() => selfScore(option.points)}
            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter ${option.className}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-void/40 font-mono text-sm font-bold text-text-hi">
              {option.badge}
            </span>
            <span>
              <span className="block font-body text-sm font-bold text-text-hi">{option.label}</span>
              <span className="block font-body text-[12px] text-text-mid">{option.description}</span>
            </span>
          </button>
        ))}
      </div>
    </RankUpPageWrap>
  );
}
