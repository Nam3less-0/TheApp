interface HostRoomCodeBadgeProps {
  code: string;
}

export default function HostRoomCodeBadge({ code }: HostRoomCodeBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-low">Room</span>
      <div className="flex gap-1">
        {code.split('').map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="flex h-8 w-7 items-center justify-center rounded-md border border-[#6FA3C4]/35 bg-surface/80 font-mono text-sm font-bold text-text-hi"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
