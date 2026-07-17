import { AlertIcon } from './RankUpIcons';
import RankUpPanel, { RankUpSecondaryButton } from './Layout';

interface ErrorPanelProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorPanel({
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorPanelProps) {
  return (
    <RankUpPanel compact className="mb-6 border-bad/40">
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bad/15 text-bad">
          <AlertIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body text-sm leading-snug text-bad">{message}</p>
          {onRetry ? (
            <RankUpSecondaryButton onClick={onRetry} className="mt-3 !px-4 !py-2 text-xs">
              {retryLabel}
            </RankUpSecondaryButton>
          ) : null}
        </div>
      </div>
    </RankUpPanel>
  );
}
