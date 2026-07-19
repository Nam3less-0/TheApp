import { isGameroomRoom } from './sync/roomApi';
import type { RankUpRoom } from './sync/types';

/** Big-screen host display is connected — it runs the session, not phones. */
export function sessionHostActive(hostDeviceConnected: boolean): boolean {
  return hostDeviceConnected;
}

export function sanitizeRoomForPlayers(
  room: RankUpRoom,
  hostDeviceConnected: boolean,
): RankUpRoom {
  if (
    hostDeviceConnected &&
    (room.phase === 'guessing' || room.phase === 'display') &&
    room.rankerOrder
  ) {
    return { ...room, rankerOrder: null };
  }
  return room;
}

export function canStartRoundOnPhone(params: {
  room: RankUpRoom | null;
  isHost: boolean;
  isFirstPlayer: boolean;
  hostDeviceConnected: boolean;
}): boolean {
  const { room, isHost, isFirstPlayer, hostDeviceConnected } = params;
  if (!room || hostDeviceConnected) return false;
  const gameroom = isGameroomRoom(room);
  return isHost || (gameroom && isFirstPlayer);
}

export function canRevealOnPhone(isRanker: boolean, hostDeviceConnected: boolean): boolean {
  return isRanker && !hostDeviceConnected;
}

export function canAdvanceOnPhone(isRanker: boolean, hostDeviceConnected: boolean): boolean {
  return isRanker && !hostDeviceConnected;
}

export function canSkipOnPhone(isHost: boolean, hostDeviceConnected: boolean): boolean {
  return isHost && !hostDeviceConnected;
}

export function canAbandonRoundOnPhone(params: {
  isHost: boolean;
  isRanker: boolean;
  hostDeviceConnected: boolean;
  isDrafting: boolean;
  roundInProgress: boolean;
}): boolean {
  if (params.hostDeviceConnected) return false;
  return (
    (params.isHost || params.isRanker) &&
    (params.isDrafting || params.roundInProgress)
  );
}

export function canAbandonGameOnPhone(isHost: boolean, hostDeviceConnected: boolean): boolean {
  return isHost && !hostDeviceConnected;
}
