import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabase } from '../../../lib/supabase';
import { persistTeamDraftOrder } from './roomApi';
import type { TeamDraftOrder } from './types';

export const teamDraftChannelName = (roomCode: string) =>
  `rank-up-${roomCode.toUpperCase()}-team-draft`;

export interface TeamDraftBroadcastPayload {
  order: string[];
  movedBy: string;
}

interface UseTeamDraftSyncOptions {
  roomCode: string;
  playerId: string;
  enabled: boolean;
  seedDraft: TeamDraftOrder | null;
  defaultOrder: string[];
}

export function useTeamDraftSync({
  roomCode,
  playerId,
  enabled,
  seedDraft,
  defaultOrder,
}: UseTeamDraftSyncOptions) {
  const [order, setOrder] = useState<string[]>(() => seedDraft?.order ?? defaultOrder);
  const [partnerDragging, setPartnerDragging] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastBroadcastAt = useRef(0);
  const dragBadgeTimer = useRef<number | null>(null);
  const persistTimer = useRef<number | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    setOrder(seedDraft?.order ?? defaultOrder);
    seededRef.current = Boolean(seedDraft?.order?.length);
  }, [enabled, seedDraft?.order, defaultOrder]);

  const schedulePersist = useCallback(
    (nextOrder: string[], movedBy: string) => {
      if (persistTimer.current) window.clearTimeout(persistTimer.current);
      persistTimer.current = window.setTimeout(() => {
        void persistTeamDraftOrder(roomCode, {
          order: nextOrder,
          movedBy,
          updatedAt: Date.now(),
        });
      }, 2000);
    },
    [roomCode],
  );

  const broadcastDraft = useCallback(
    (nextOrder: string[], movedBy: string) => {
      const channel = channelRef.current;
      if (!channel) return;

      const now = Date.now();
      if (now - lastBroadcastAt.current < 100) return;
      lastBroadcastAt.current = now;

      void channel.send({
        type: 'broadcast',
        event: 'draft-move',
        payload: { order: nextOrder, movedBy } satisfies TeamDraftBroadcastPayload,
      });

      schedulePersist(nextOrder, movedBy);
    },
    [schedulePersist],
  );

  const applyRemoteDraft = useCallback((payload: TeamDraftBroadcastPayload) => {
    if (payload.movedBy === playerId) return;

    setOrder(payload.order);

    const partner = payload.movedBy;
    setPartnerDragging(partner);
    if (dragBadgeTimer.current) window.clearTimeout(dragBadgeTimer.current);
    dragBadgeTimer.current = window.setTimeout(() => {
      setPartnerDragging(null);
    }, 1500);
  }, [playerId]);

  useEffect(() => {
    if (!enabled || !roomCode) return;

    const supabase = getSupabase();
    const channel = supabase.channel(teamDraftChannelName(roomCode));
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'draft-move' }, ({ payload }) => {
        const data = payload as TeamDraftBroadcastPayload | undefined;
        if (!data?.order?.length || !data.movedBy) return;
        applyRemoteDraft(data);
      })
      .subscribe();

    return () => {
      if (persistTimer.current) window.clearTimeout(persistTimer.current);
      if (dragBadgeTimer.current) window.clearTimeout(dragBadgeTimer.current);
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [enabled, roomCode, applyRemoteDraft]);

  const handleOrderChange = useCallback(
    (nextOrder: string[]) => {
      setOrder(nextOrder);
      broadcastDraft(nextOrder, playerId);
    },
    [broadcastDraft, playerId],
  );

  return {
    order,
    handleOrderChange,
    partnerDragging,
  };
}
