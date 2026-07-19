/** Public app origin for share/QR links (VITE_APP_URL), else current page origin. */
export function getAppOrigin(): string {
  const configured = import.meta.env.VITE_APP_URL;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim().replace(/\/$/, '');
  }
  return window.location.origin;
}

export function rankUpPlayerJoinUrl(roomCode: string): string {
  return `${getAppOrigin()}/play/rank-up?join=${roomCode.toUpperCase()}`;
}
