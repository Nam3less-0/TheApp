import { useMemo, useState } from 'react';
import { useRankUp } from '../context';
import { useTeamDraftSync } from '../sync/teamDraftChannel';
import { defaultRankOrder, perfectPoints } from '../utils';
import { formatTeamMembers, getOpposingTeam } from '../teams';
import { GuesserScreenHeader } from './GuesserBadge';
import AbandonRoundButton from './AbandonRoundButton';
import ErrorPanel from './ErrorPanel';
import RankEditor from './RankEditor';
import { CheckIcon } from './RankUpIcons';
import RankUpPanel, { RankUpPageWrap } from './Layout';

export default function JointGuessScreen() {
  const { local, room, players, teams, submitTeamGuess } = useRankUp();
  const [submitting, setSubmitting] = useState(false);

  const me = players.find((player) => player.id === local.playerId);
  const ranker = players.find((player) => player.id === room?.rankerPlayerId);
  const opposingTeam = getOpposingTeam(teams, ranker?.teamId ?? null);
  const opposingMembers = useMemo(
    () =>
      opposingTeam
        ? players.filter((player) => player.teamId === opposingTeam.id)
        : [],
    [opposingTeam, players],
  );
  const partner = opposingMembers.find((player) => player.id !== local.playerId) ?? null;

  const defaultOrder = room ? defaultRankOrder(room.options) : [];
  const { order, handleOrderChange, partnerDragging } = useTeamDraftSync({
    roomCode: local.roomCode ?? '',
    playerId: local.playerId,
    enabled: Boolean(room && opposingTeam && local.roomCode),
    seedDraft: room?.teamDraftOrder ?? null,
    defaultOrder,
  });

  if (!room?.options.length || !opposingTeam || !me) return null;

  const canSubmit = order.length === room.options.length;
  const perfect = perfectPoints(room.options.length);
  const partnerName =
    partnerDragging != null
      ? (players.find((player) => player.id === partnerDragging)?.name ?? 'Teammate')
      : null;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await submitTeamGuess(
        order,
        opposingMembers.map((player) => player.id),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow="Opposing team — joint guess"
        title="Agree on one ranking"
        subtitle={room.prompt ?? undefined}
      />

      <RankUpPanel compact className="mb-4 border-copper/30">
        <p className="font-body text-sm text-text-mid">
          You and{' '}
          <span className="font-semibold text-text-hi">{partner?.name ?? 'your partner'}</span> must
          submit the same order. Drag together — either of you can lock it in.
        </p>
      </RankUpPanel>

      {partnerName ? (
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-copper">
          {partnerName} is dragging…
        </p>
      ) : null}

      {local.syncError ? <ErrorPanel message={local.syncError} className="mb-4" /> : null}

      <RankEditor
        options={room.options}
        order={order}
        onOrderChange={handleOrderChange}
        heading={`${formatTeamMembers(opposingTeam, players)} — team guess`}
        description="Drag to reorder from best to worst."
        hintText={`🎯 Perfect match pays ${perfect} pts to your team`}
        ctaLabel="Submit Team Guess"
        ctaIcon={<CheckIcon className="h-4 w-4" />}
        ctaTint="guesser"
        onSubmit={handleSubmit}
        submitting={submitting}
        submitDisabled={!canSubmit}
        confirmationMessage="Team guess locked in. Waiting on the other side…"
      />

      <div className="mt-6">
        <AbandonRoundButton />
      </div>
    </RankUpPageWrap>
  );
}
