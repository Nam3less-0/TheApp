import type { ComponentType, SVGProps } from 'react';

export type GameStatus = 'playable' | 'in-progress';
export type MetalAccent =
  | 'steel-blue'
  | 'pewter'
  | 'silver'
  | 'copper'
  | 'ember'
  | 'gold'
  | 'toxic'
  | 'crimson';

export interface GameEntry {
  id: string;
  title: string;
  description: string;
  metal: MetalAccent;
  status: GameStatus;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}
