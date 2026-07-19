import { useState } from 'react';
import { useRankUp } from '../context';
import { defaultRankOrder, perfectPoints } from '../utils';
import { GuesserScreenHeader } from './GuesserBadge';
import AbandonRoundButton from './AbandonRoundButton';
import ErrorPanel from './ErrorPanel';
import JointGuessScreen from './JointGuessScreen';
import RankEditor from './RankEditor';
import { CheckIcon } from './RankUpIcons';
import RankUpPanel, { RankUpPageWrap } from './Layout';

export default function GuessingScreen() {
  const { local, room, submitGuess, isTeamsGame, teamsGuessRole } = useRankUp();
  const [order, setOrder] = useState<string[]>(() =>
    room ? defaultRankOrder(room.options) : [],
  );
  const [submitting, setSubmitting] = useState(false);

  if (!room?.options.length) return null;

  if (isTeamsGame && teamsGuessRole === 'joint-opposing') {
    return <JointGuessScreen />;
  }

  if (isTeamsGame && teamsGuessRole !== 'solo-teammate') {
    return (
      <RankUpPageWrap>
        <RankUpPanel compact>
          <p className="text-center font-body text-sm text-text-mid">
            Waiting for the other guesses this turn…
          </p>
        </RankUpPanel>
      </RankUpPageWrap>
    );
  }

  const canSubmit = order.length === room.options.length;
  const perfect = perfectPoints(room.options.length);

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await submitGuess(order);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow={
          isTeamsGame ? 'Your team — solo read' : 'Round live — your turn'
        }
        title={isTeamsGame ? 'Read your partner\'s mind' : 'Rank your guess'}
        subtitle={room.prompt ?? undefined}
      />

      {local.syncError ? (
        <ErrorPanel message={local.syncError} className="mb-4" />
      ) : null}

      <RankEditor
        options={room.options}
        order={order}
        onOrderChange={setOrder}
        heading="Predicted ranking"
        description="Drag to reorder from best to worst."
        hintText={`🎯 Perfect match pays ${perfect} pts this round`}
        ctaLabel={isTeamsGame ? 'Submit Solo Guess' : 'Submit Guess'}
        ctaIcon={<CheckIcon className="h-4 w-4" />}
        ctaTint="guesser"
        onSubmit={handleSubmit}
        submitting={submitting}
        submitDisabled={!canSubmit}
        confirmationMessage="Guess locked in. Waiting on the others…"
      />

      <div className="mt-6">
        <AbandonRoundButton />
      </div>
    </RankUpPageWrap>
  );
}
