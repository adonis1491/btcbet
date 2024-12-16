export type GamePhase = 'BETTING' | 'PLAYING' | 'RESULT';

export interface GameState {
  credits: number;
  jackpot: number;
  currentPrice: number;
  roundStartPrice: number;
  betPlacementPrice: number;
  roundEndTime: Date | null;
  bettingEndTime: Date | null;
  nextRoundStartTime: Date | null;
  gamePhase: GamePhase;
  bet: {
    amount: number;
    direction: 'up' | 'down' | null;
  };
  roundResult: 'WIN' | 'MISS' | null;
  winAmount: number;
}

export interface StoredState {
  credits: number;
  jackpot: number;
}
