export type ActionCategory =
  | "WORK"
  | "EXERCISE"
  | "STUDY"
  | "MEDITATE"
  | "SLEEP"
  | "DEBUFF"
  | "UNKNOWN";

export interface ActionResult {
  category: ActionCategory;
  minutes: number;
  expGained: number;
  hpDelta: number;
  focusDelta: number;
  strengthDelta: number;
  intelligenceDelta: number;
  comment: string;
}

export interface ActionLog {
  id: string;
  text: string;
  category: ActionCategory;
  expGained: number;
  comment: string;
  timestamp: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  targetMinutes: number;
  reward: number;
  completed: boolean;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  condition: (status: PlayerStatus) => boolean;
}

export interface PlayerStatus {
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  focus: number;
  strength: number;
  intelligence: number;
  streak: number;
  lastLoginDate: string;
  titles: string[];
  activeTitle: string;
  completedQuestIds: string[];
  todayQuestIds: string[];
  logs: ActionLog[];
}
