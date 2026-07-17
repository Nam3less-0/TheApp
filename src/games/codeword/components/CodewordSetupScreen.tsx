import { useState } from 'react';
import { useCodeword } from '../context';
import { drawTeamCard } from '../utils';
import CodewordCard from './CodewordCard';
import CodewordPanel, { CodewordPageWrap } from './CodewordPanel';

interface CodewordSetupScreenProps {
  synced?: boolean;
}

export default function CodewordSetupScreen({ synced = false }: CodewordSetupScreenProps) {
  const { lockCard } = useCodeword();
  const [card, setCard] = useState(() => drawTeamCard());

  return (
    <CodewordPageWrap>
      <h1 className="mb-1.5 font-display text-[22px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[26px]">
        Your codeword card
      </h1>
      <p className="mb-5 font-body text-sm text-text-mid">
        Only your team should see this. These four words map to digits{' '}
        <span className="text-text-hi">1–4</span> for the whole game.
      </p>

      <CodewordPanel>
        <CodewordCard card={card} />

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => void lockCard(card)}
            className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
            style={{
              background: 'linear-gradient(180deg, #E2C0A8, #C99A7A 55%, #A87C5E)',
            }}
          >
            Lock card &amp; start game
          </button>
          <button
            type="button"
            onClick={() => setCard(drawTeamCard())}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
          >
            ↻ Re-roll words
          </button>
        </div>
      </CodewordPanel>

      <p className="mt-3 text-center font-mono text-[11px] text-text-low">
        {synced
          ? 'Your card stays on this device — the other team never sees it.'
          : 'Pass the phone between teams when switching turns.'}
      </p>
    </CodewordPageWrap>
  );
}
