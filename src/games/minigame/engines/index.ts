import type { RoundEngine } from '../types';
import { boxesEngine } from './boxes';
import { loadBearingEngine } from './loadBearing';
import { wiringEngine } from './wiring';
import { supplyRunEngine } from './supplyRun';
import { blueprintRelayEngine } from './blueprintRelay';
import { siteInspectionEngine } from './siteInspection';
import { foremansLedgerEngine } from './foremansLedger';
import { stressTestEngine } from './stressTest';
import { architectsVoteEngine } from './architectsVote';
import { finalBlueprintEngine } from './finalBlueprint';

export const ROUND_ENGINES: RoundEngine<unknown>[] = [
  boxesEngine,
  loadBearingEngine,
  wiringEngine,
  supplyRunEngine,
  blueprintRelayEngine,
  siteInspectionEngine,
  foremansLedgerEngine,
  stressTestEngine,
  architectsVoteEngine,
  finalBlueprintEngine,
] as unknown as RoundEngine<unknown>[];

export const TOTAL_ROUNDS = ROUND_ENGINES.length;
