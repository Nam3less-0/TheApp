import { useState } from 'react';
import RoomCodeDisplay from './RoomCodeDisplay';
import RankUpPanel, { RankUpSecondaryButton } from './Layout';

interface CastToScreenPanelProps {
  code: string;
}

export default function CastToScreenPanel({ code }: CastToScreenPanelProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <RankUpSecondaryButton onClick={() => setOpen(true)} className="w-full text-center">
        Cast to a screen
      </RankUpSecondaryButton>
    );
  }

  return (
    <RankUpPanel compact className="border-[#6FA3C4]/25">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-sm font-bold text-text-hi">Cast to a screen</p>
          <p className="mt-1 font-body text-[13px] leading-snug text-text-mid">
            Open this app on a laptop or TV and go to{' '}
            <span className="font-mono text-[12px] text-pewter">/play/rank-up/host</span>, then enter
            this code.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 font-mono text-[11px] text-text-low underline-offset-2 hover:underline"
        >
          Close
        </button>
      </div>
      <RoomCodeDisplay code={code} />
    </RankUpPanel>
  );
}
