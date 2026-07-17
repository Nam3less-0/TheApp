import { useState } from 'react';

interface RoomCodeDisplayProps {
  code: string;
}

export default function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const letters = code.split('');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  async function shareCode() {
    const shareData = {
      title: 'Join my Codeword game',
      text: `Join my Codeword room with code: ${code}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed
      }
    }

    await copyCode();
  }

  return (
    <div className="text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">Room code</p>
      <div className="mt-3 flex justify-center gap-2 sm:gap-2.5">
        {letters.map((letter, index) => (
          <div
            key={`${letter}-${index}`}
            className="flex h-14 w-11 items-center justify-center rounded-xl border border-copper/40 bg-surface font-mono text-2xl font-bold text-text-hi shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] sm:h-16 sm:w-12 sm:text-[28px]"
          >
            {letter}
          </div>
        ))}
      </div>
      <p className="mt-3 font-body text-sm text-text-mid">
        Share this code with the other team so they can join on their device.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={copyCode}
          className="rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          {copied ? 'Copied!' : 'Copy code'}
        </button>
        <button
          type="button"
          onClick={shareCode}
          className="rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          Share
        </button>
      </div>
    </div>
  );
}
