import CodewordPanel from './CodewordPanel';

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
    <CodewordPanel className="mb-6 border-bad/40">
      <p className="font-body text-sm leading-snug text-bad">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl border border-line px-4 py-2 font-body text-xs font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          {retryLabel}
        </button>
      ) : null}
    </CodewordPanel>
  );
}
