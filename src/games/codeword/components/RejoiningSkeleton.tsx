import CodewordPanel, { CodewordPageWrap } from './CodewordPanel';

export default function RejoiningSkeleton() {
  return (
    <CodewordPageWrap>
      <div className="animate-pulse">
        <div className="mb-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper">
            Rejoining room…
          </p>
          <div className="mx-auto mt-4 h-8 w-48 rounded-lg bg-surface/60" />
          <div className="mx-auto mt-3 h-4 w-64 max-w-full rounded bg-surface/40" />
        </div>

        <CodewordPanel className="mb-6">
          <div className="mb-3 h-3 w-24 rounded bg-surface/50" />
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-line px-4 py-3"
              >
                <div className="h-4 w-28 rounded bg-surface/50" />
                <div className="h-4 w-6 rounded bg-surface/40" />
              </div>
            ))}
          </div>
        </CodewordPanel>
      </div>
    </CodewordPageWrap>
  );
}
