import { useMemo, useState } from 'react';
import { useRankUp } from '../context';
import {
  formatTeamMembers,
  isTeamFormationComplete,
  TEAM_ACCENTS,
  TEAMS_REQUIRED_PLAYERS,
} from '../teams';
import type { RankUpPlayer, RankUpTeam } from '../sync/types';
import RoomCodeDisplay from './RoomCodeDisplay';
import CastToScreenPanel from './CastToScreenPanel';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
} from './Layout';

function PlayerChip({
  player,
  selected,
  onSelect,
  draggable,
  onDragStart,
}: {
  player: RankUpPlayer;
  selected: boolean;
  onSelect: () => void;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onSelect}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
        selected
          ? 'border-pewter bg-surface shadow-[0_0_0_1px_#9B93A8_inset]'
          : 'border-line hover:border-line-bright'
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-deep/60 font-mono text-xs font-bold text-text-mid">
        {player.name.slice(0, 1).toUpperCase()}
      </span>
      <span className="truncate font-body text-sm font-semibold text-text-hi">{player.name}</span>
    </button>
  );
}

function TeamColumn({
  team,
  members,
  selectedPlayerId,
  isHost,
  onAssign,
  onSelectPlayer,
}: {
  team: RankUpTeam;
  members: RankUpPlayer[];
  selectedPlayerId: string | null;
  isHost: boolean;
  onAssign: (teamId: string, playerId?: string | null) => void;
  onSelectPlayer: (playerId: string) => void;
}) {
  const accent = TEAM_ACCENTS[team.accent];
  const openSlots = Math.max(0, 2 - members.length);

  return (
    <div
      className={`rounded-[18px] border p-4 sm:p-5 ${accent.border} ${accent.bg}`}
      style={{
        background: 'linear-gradient(165deg, #242228, #1C1A20 75%)',
      }}
      onDragOver={(event) => {
        if (isHost) event.preventDefault();
      }}
      onDrop={(event) => {
        if (!isHost) return;
        event.preventDefault();
        const playerId = event.dataTransfer.getData('text/player-id') || selectedPlayerId;
        if (playerId) onAssign(team.id, playerId);
      }}
    >
      <button
        type="button"
        onClick={() => onAssign(team.id)}
        className="mb-4 w-full text-left"
      >
        <p className={`font-mono text-[10px] uppercase tracking-[0.14em] ${accent.text}`}>
          {team.name}
        </p>
        <p className="mt-1 font-body text-[12px] text-text-mid">
          {selectedPlayerId ? 'Tap to place selected player here' : 'Select a player, then tap a team'}
        </p>
      </button>

      <div className="flex min-h-[180px] flex-col gap-2">
        {members.map((player) => (
          <PlayerChip
            key={player.id}
            player={player}
            selected={selectedPlayerId === player.id}
            onSelect={() => onSelectPlayer(player.id)}
            draggable={isHost}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/player-id', player.id);
              onSelectPlayer(player.id);
            }}
          />
        ))}
        {Array.from({ length: openSlots }).map((_, index) => (
          <div
            key={`slot-${index}`}
            className={`rounded-xl border border-dashed px-3 py-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-text-low ${accent.ring}`}
          >
            Open slot
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamFormationScreen() {
  const {
    room,
    players,
    teams,
    isHost,
    assignPlayerTeam,
    startNewRound,
    leaveGame,
  } = useRankUp();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const teamA = teams.find((team) => team.accent === 'a');
  const teamB = teams.find((team) => team.accent === 'b');

  const unassigned = useMemo(
    () => players.filter((player) => !player.teamId),
    [players],
  );

  if (!room || !teamA || !teamB) return null;

  const teamAMembers = players.filter((player) => player.teamId === teamA.id);
  const teamBMembers = players.filter((player) => player.teamId === teamB.id);
  const formationReady = isTeamFormationComplete(players, teams);
  const playerCountOk = players.length === TEAMS_REQUIRED_PLAYERS;

  async function assignToTeam(teamId: string, playerId: string | null = selectedPlayerId) {
    if (!playerId) return;
    await assignPlayerTeam(playerId, teamId);
    setSelectedPlayerId(null);
  }

  async function unassignSelected() {
    if (!selectedPlayerId) return;
    await assignPlayerTeam(selectedPlayerId, null);
    setSelectedPlayerId(null);
  }

  return (
    <RankUpPageWrap>
      <header className="mb-6">
        <RoomCodeDisplay code={room.code} />
      </header>

      <RankUpPanel compact className="mb-6 border-[#6FA3C4]/25">
        <p className="font-body text-sm font-bold text-text-hi">2v2 team formation</p>
        <p className="mt-1 font-body text-[13px] text-text-mid">
          Split into two teams of two. Tap a player, then tap a team column to assign them.
          {isHost ? ' As host, you can also drag players between columns.' : ''}
        </p>
        {!playerCountOk ? (
          <p className="mt-3 rounded-xl border border-bad/35 bg-bad/10 px-4 py-3 font-body text-sm text-bad">
            2v2 needs exactly 4 players ({players.length}/{TEAMS_REQUIRED_PLAYERS} in the room).
          </p>
        ) : null}
      </RankUpPanel>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <TeamColumn
          team={teamA}
          members={teamAMembers}
          selectedPlayerId={selectedPlayerId}
          isHost={isHost}
          onAssign={assignToTeam}
          onSelectPlayer={setSelectedPlayerId}
        />
        <TeamColumn
          team={teamB}
          members={teamBMembers}
          selectedPlayerId={selectedPlayerId}
          isHost={isHost}
          onAssign={assignToTeam}
          onSelectPlayer={setSelectedPlayerId}
        />
      </div>

      {unassigned.length > 0 ? (
        <RankUpPanel compact className="mb-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            Unassigned ({unassigned.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((player) => (
              <PlayerChip
                key={player.id}
                player={player}
                selected={selectedPlayerId === player.id}
                onSelect={() =>
                  setSelectedPlayerId((current) => (current === player.id ? null : player.id))
                }
                draggable={isHost}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/player-id', player.id);
                  setSelectedPlayerId(player.id);
                }}
              />
            ))}
          </div>
        </RankUpPanel>
      ) : null}

      {selectedPlayerId && players.find((player) => player.id === selectedPlayerId)?.teamId ? (
        <RankUpSecondaryButton onClick={() => void unassignSelected()} className="mb-4 w-full text-center">
          Remove selected player from team
        </RankUpSecondaryButton>
      ) : null}

      <div className="flex flex-col gap-3">
        {isHost ? (
          <RankUpPrimaryButton
            onClick={() => startNewRound()}
            disabled={!formationReady || !playerCountOk}
          >
            Start Round 1
          </RankUpPrimaryButton>
        ) : (
          <RankUpPanel compact>
            <p className="text-center font-body text-sm text-text-mid">
              {formationReady && playerCountOk
                ? 'Waiting for the host to start Round 1…'
                : 'Waiting for teams to be set…'}
            </p>
          </RankUpPanel>
        )}

        {formationReady ? (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-good">
            Teams locked — {formatTeamMembers(teamA, players)} vs {formatTeamMembers(teamB, players)}
          </p>
        ) : null}

        <CastToScreenPanel code={room.code} />

        <RankUpSecondaryButton onClick={leaveGame} className="w-full text-center">
          Leave room
        </RankUpSecondaryButton>
      </div>
    </RankUpPageWrap>
  );
}
