export function playTimerAlarm(): () => void {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return () => {};

  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.gain.value = 0.28;
  gain.connect(ctx.destination);

  let stopped = false;

  function scheduleBeeps() {
    const beepDuration = 0.18;
    const beepGap = 0.32;
    const beepCount = 10;

    for (let i = 0; i < beepCount; i++) {
      const start = ctx.currentTime + i * (beepDuration + beepGap);
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = i % 2 === 0 ? 880 : 988;
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + beepDuration);
    }
  }

  void ctx.resume().then(() => {
    if (!stopped) scheduleBeeps();
  });

  return () => {
    if (stopped) return;
    stopped = true;
    void ctx.close();
  };
}
