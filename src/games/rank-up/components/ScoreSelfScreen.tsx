import { useRankUp } from '../context';
import { GuesserScreenHeader } from './GuesserBadge';
import OrderList from './OrderList';
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
  const rankerOrder = room?.rankerOrder ?? [];

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow="Score yourself"
        title="How did you do?"
        subtitle="Compare your guess to the ranker's order, then tap your score."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RankUpPanel compact>
          <RankUpSectionHeading title="Your guess" className="mb-3" />
          <OrderList
            order={local.lastGuessOrder}
            options={options}
            variant="compact"
            showRail
            bestLabel="Best"
            worstLabel="Worst"
          />
        </RankUpPanel>

        <RankUpPanel compact className="border-pewter/30">
          <RankUpSectionHeading title="Ranker's order" className="mb-3" />
          <OrderList
            order={rankerOrder}
            options={options}
            variant="compact"
            showRail
            bestLabel="Best"
            worstLabel="Worst"
          />
        </RankUpPanel>
      </div>

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
