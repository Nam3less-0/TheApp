import RankUpPanel from './Layout';

interface BigScreenRevealCardProps {
  pointsLabel: string;
  className?: string;
}

export default function BigScreenRevealCard({ pointsLabel, className = '' }: BigScreenRevealCardProps) {
  return (
    <RankUpPanel compact className={`border-[#6FA3C4]/30 ${className}`.trim()}>
      <p className="text-center font-display text-xl font-extrabold text-[#6FA3C4]">{pointsLabel}</p>
      <p className="mt-2 text-center font-body text-sm text-text-mid">
        Check the big screen for the breakdown
      </p>
    </RankUpPanel>
  );
}
