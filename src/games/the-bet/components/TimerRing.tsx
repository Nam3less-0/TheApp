interface TimerRingProps {
  diameter: number;
  strokeWidth: number;
  progress: number;
  children?: React.ReactNode;
  strokeClassName?: string;
  danger?: boolean;
  className?: string;
}

export default function TimerRing({
  diameter,
  strokeWidth,
  progress,
  children,
  strokeClassName = 'text-gold',
  danger = false,
  className = '',
}: TimerRingProps) {
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = circumference * (1 - clamped);
  const center = diameter / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: diameter, height: diameter }}
    >
      <svg
        width={diameter}
        height={diameter}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-line"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`motion-safe:transition-[stroke-dashoffset] motion-safe:duration-1000 motion-safe:ease-linear ${
            danger ? 'text-bad' : strokeClassName
          }`}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      ) : null}
    </div>
  );
}
