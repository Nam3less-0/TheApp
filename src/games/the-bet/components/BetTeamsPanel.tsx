import { useRef, useState } from 'react';
import { useBet } from '../context';
import { BetPanel } from './BetLayout';

const MAX_PER_TEAM = 6;
const TEAM_ACCENTS = ['#C9A44A', '#6FA8DC'] as const;

interface DragState {
  team: 0 | 1;
  index: number;
  name: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  drop: { team: 0 | 1; index: number } | null;
}

export default function BetTeamsPanel() {
  const { state, dispatch } = useBet();
  const [open, setOpen] = useState(() => state.rounds.length === 0);
  const [shuffleNonce, setShuffleNonce] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const columnRefs = useRef<(HTMLUListElement | null)[]>([null, null]);

  const rosters: [string[], string[]] = [
    [...state.teams[0].players],
    [...state.teams[1].players],
  ];

  function commit(next: [string[], string[]]) {
    dispatch({ type: 'SET_ROSTER', teams: next });
  }

  function setName(teamIndex: 0 | 1, playerIndex: number, name: string) {
    const next: [string[], string[]] = [[...rosters[0]], [...rosters[1]]];
    next[teamIndex][playerIndex] = name;
    commit(next);
  }

  function addPlayer(teamIndex: 0 | 1) {
    if (rosters[teamIndex].length >= MAX_PER_TEAM) return;
    const total = rosters[0].length + rosters[1].length;
    const next: [string[], string[]] = [[...rosters[0]], [...rosters[1]]];
    next[teamIndex].push(`Player ${total + 1}`);
    commit(next);
  }

  function removePlayer(teamIndex: 0 | 1, playerIndex: number) {
    if (rosters[teamIndex].length <= 1) return;
    const next: [string[], string[]] = [[...rosters[0]], [...rosters[1]]];
    next[teamIndex].splice(playerIndex, 1);
    commit(next);
  }

  function shuffle() {
    dispatch({ type: 'RANDOMIZE_TEAMS' });
    setShuffleNonce((n) => n + 1);
  }

  function findDropTarget(
    x: number,
    y: number,
    source: { team: 0 | 1; index: number },
  ): { team: 0 | 1; index: number } | null {
    for (const t of [0, 1] as const) {
      const col = columnRefs.current[t];
      if (!col) continue;
      const rect = col.getBoundingClientRect();
      // Generous vertical slack so drops just above/below the list still land.
      if (
        x < rect.left - 8 ||
        x > rect.right + 8 ||
        y < rect.top - 24 ||
        y > rect.bottom + 48
      ) {
        continue;
      }

      if (t !== source.team) {
        if (rosters[t].length >= MAX_PER_TEAM) return null;
        if (rosters[source.team].length <= 1) return null;
      }

      const rows = Array.from(
        col.querySelectorAll<HTMLElement>('[data-player-row]'),
      );
      let index = rows.length;
      for (let i = 0; i < rows.length; i += 1) {
        const r = rows[i].getBoundingClientRect();
        if (y < r.top + r.height / 2) {
          index = i;
          break;
        }
      }
      return { team: t, index };
    }
    return null;
  }

  function handleDragStart(
    e: React.PointerEvent<HTMLButtonElement>,
    team: 0 | 1,
    index: number,
  ) {
    e.preventDefault();
    const row = e.currentTarget.closest('li');
    if (!row) return;
    const rect = row.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({
      team,
      index,
      name: rosters[team][index],
      x: e.clientX,
      y: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      drop: null,
    });
  }

  function handleDragMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    const drop = findDropTarget(e.clientX, e.clientY, drag);
    setDrag({ ...drag, x: e.clientX, y: e.clientY, drop });
  }

  function handleDragEnd() {
    if (!drag) return;
    const { team: sourceTeam, index: sourceIndex, drop, name } = drag;
    setDrag(null);
    if (!drop) return;

    const next: [string[], string[]] = [[...rosters[0]], [...rosters[1]]];
    if (drop.team === sourceTeam) {
      let insertAt = drop.index;
      next[sourceTeam].splice(sourceIndex, 1);
      if (insertAt > sourceIndex) insertAt -= 1;
      next[sourceTeam].splice(insertAt, 0, name);
    } else {
      if (next[drop.team].length >= MAX_PER_TEAM) return;
      if (next[sourceTeam].length <= 1) return;
      next[sourceTeam].splice(sourceIndex, 1);
      next[drop.team].splice(drop.index, 0, name);
    }
    commit(next);
  }

  function dropIndicator(team: 0 | 1, index: number) {
    const show = drag?.drop && drag.drop.team === team && drag.drop.index === index;
    return (
      <div
        aria-hidden="true"
        className={`rounded-full transition-all ${show ? 'my-0.5 h-1 bg-gold' : 'h-0'}`}
      />
    );
  }

  return (
    <BetPanel className="mb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-low">
            Teammates
          </p>
          <div className="flex flex-col gap-0.5">
            {state.teams.map((team, i) => (
              <p key={i} className="truncate font-body text-[13px] text-text-mid">
                <span
                  className="font-semibold"
                  style={{ color: TEAM_ACCENTS[i] }}
                >
                  {team.name}:
                </span>{' '}
                <span className="text-text-hi">
                  {team.players.join(' & ') || '—'}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={shuffle}
            className="inline-flex items-center gap-1.5 rounded-lg border-none px-3 py-2 font-body text-[13px] font-bold text-void transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-safe:active:scale-95"
            style={{ background: 'linear-gradient(180deg, #EAC870, #C9A44A 55%, #7A6228)' }}
          >
            <span
              key={shuffleNonce}
              className="text-base leading-none motion-safe:animate-[betGoFlash_0.5s_ease]"
              aria-hidden="true"
            >
              🎲
            </span>
            Shuffle
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Hide roster editor' : 'Edit roster'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
          {state.teams.map((team, ti) => {
            const teamIndex = ti as 0 | 1;
            const isDropTeam = drag?.drop?.team === teamIndex;
            return (
              <div key={ti}>
                <p
                  className="mb-2 font-display text-[13px] font-bold"
                  style={{ color: TEAM_ACCENTS[ti] }}
                >
                  {team.name}
                </p>
                <ul
                  ref={(el) => {
                    columnRefs.current[teamIndex] = el;
                  }}
                  className={`flex flex-col gap-2 rounded-lg transition-colors ${
                    drag && isDropTeam ? 'bg-gold/5' : ''
                  }`}
                >
                  {team.players.map((player, pi) => {
                    const isDragSource =
                      drag?.team === teamIndex && drag.index === pi;
                    return (
                      <li
                        key={pi}
                        className={`transition-opacity ${isDragSource ? 'opacity-30' : ''}`}
                      >
                        {dropIndicator(teamIndex, pi)}
                        <div data-player-row className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`Drag ${player} to reorder or switch teams`}
                            onPointerDown={(e) => handleDragStart(e, teamIndex, pi)}
                            onPointerMove={handleDragMove}
                            onPointerUp={handleDragEnd}
                            onPointerCancel={() => setDrag(null)}
                            className="flex h-8 w-6 shrink-0 cursor-grab touch-none select-none items-center justify-center rounded-md text-text-low transition-colors hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing"
                          >
                            <span aria-hidden="true" className="text-sm leading-none">
                              ⠿
                            </span>
                          </button>
                          <input
                            type="text"
                            value={player}
                            onChange={(e) => setName(teamIndex, pi, e.target.value)}
                            placeholder={`Player ${pi + 1}`}
                            maxLength={20}
                            className="min-h-8 min-w-0 flex-1 rounded-lg border border-line bg-deep px-2.5 font-body text-[13px] font-semibold text-text-hi outline-none placeholder:text-text-low focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold"
                          />
                          <button
                            type="button"
                            onClick={() => removePlayer(teamIndex, pi)}
                            disabled={team.players.length <= 1}
                            aria-label={`Remove ${player}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line text-text-low transition-colors hover:text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  {dropIndicator(teamIndex, team.players.length)}
                </ul>
                <button
                  type="button"
                  onClick={() => addPlayer(teamIndex)}
                  disabled={team.players.length >= MAX_PER_TEAM}
                  className="mt-2 w-full rounded-lg border border-dashed border-line-bright px-2 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-gold/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Add
                </button>
              </div>
            );
          })}
        </div>
      )}

      {drag && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 flex items-center gap-2 rounded-lg border border-gold/60 bg-deep px-2.5 py-1.5 font-body text-[13px] font-semibold text-text-hi shadow-lg shadow-black/40"
          style={{
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
            width: drag.width,
          }}
        >
          <span className="text-text-low" aria-hidden="true">
            ⠿
          </span>
          <span className="truncate">{drag.name || 'Player'}</span>
        </div>
      )}
    </BetPanel>
  );
}
