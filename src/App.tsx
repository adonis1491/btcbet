import { useEffect, useState } from 'react';
import { useInterval } from './hooks/useInterval';
import axios from 'axios';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { GameTimer } from './components/GameTimer';
import { PriceDisplay } from './components/PriceDisplay';
import { BetControls } from './components/BetControls';
import { BottomNav } from './components/BottomNav';
import { ResultModal } from './components/ResultModal';
import { BetStatus } from './components/BetStatus';
import { GameState, StoredState, GamePhase } from './types';
import './index.css';

const ROUND_DURATION = 3 * 60 * 1000; // 3 minutes
const BETTING_DURATION = 30 * 1000; // 30 seconds
const INITIAL_CREDITS = 1000;
const INITIAL_JACKPOT = 10000;

function App() {
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem('gameState');
    const storedState: StoredState | null = stored ? JSON.parse(stored) : null;
    
    return {
      credits: storedState?.credits ?? INITIAL_CREDITS,
      jackpot: storedState?.jackpot ?? INITIAL_JACKPOT,
      currentPrice: 0,
      roundStartPrice: 0,
      betPlacementPrice: 0,
      roundEndTime: null,
      bettingEndTime: null,
      nextRoundStartTime: null,
      gamePhase: 'BETTING',
      bet: {
        amount: 0,
        direction: null
      },
      roundResult: null,
      winAmount: 0
    };
  });

  const [showResult, setShowResult] = useState(false);

  const fetchPrice = async () => {
    try {
      // First try CoinGecko
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        const price = response.data.bitcoin.usd;
        setGameState(state => ({ ...state, currentPrice: price }));
        setError(null);
        return price;
      } catch (coingeckoError) {
        console.warn('CoinGecko API failed, trying Binance:', coingeckoError);
        
        // Fallback to Binance
        const response = await axios.get(
          'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
        );
        const price = parseFloat(response.data.price);
        setGameState(state => ({ ...state, currentPrice: price }));
        setError(null);
        return price;
      }
    } catch (error) {
      console.error('All price fetching attempts failed:', error);
      setError('Unable to fetch Bitcoin price');
      return null;
    }
  };

  const startNewRound = async () => {
    const price = await fetchPrice();
    if (!price) return;

    const now = new Date();
    const roundEndTime = new Date(now.getTime() + ROUND_DURATION);
    const bettingEndTime = new Date(now.getTime() + BETTING_DURATION);

    setGameState(state => ({
      ...state,
      roundStartPrice: price,
      currentPrice: price,
      roundEndTime,
      bettingEndTime,
      gamePhase: 'BETTING',
      bet: { amount: 0, direction: null },
      roundResult: null,
      winAmount: 0
    }));
  };

  const placeBet = (direction: 'up' | 'down', amount: number) => {
    if (gameState.gamePhase !== 'BETTING' || gameState.credits < amount) return;

    setGameState(state => ({
      ...state,
      credits: state.credits - amount,
      bet: { direction, amount },
      betPlacementPrice: state.currentPrice
    }));
  };

  const evaluateRound = () => {
    if (!gameState.bet.direction || !gameState.bet.amount) return;

    const priceChange = (gameState.currentPrice - gameState.betPlacementPrice) / gameState.betPlacementPrice;
    const isUp = priceChange > 0;
    const isWin = (isUp && gameState.bet.direction === 'up') || (!isUp && gameState.bet.direction === 'down');

    const winAmount = isWin ? gameState.bet.amount * 1.95 : 0;

    setGameState(state => ({
      ...state,
      credits: state.credits + winAmount,
      roundResult: isWin ? 'WIN' : 'MISS',
      winAmount,
      gamePhase: 'RESULT'
    }));

    setShowResult(true);
  };

  // Price update interval
  useInterval(() => {
    if (gameState.gamePhase === 'PLAYING' || gameState.gamePhase === 'BETTING') {
      fetchPrice();
    }
  }, 5000);

  // Game phase management
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      if (gameState.bettingEndTime && now >= gameState.bettingEndTime && gameState.gamePhase === 'BETTING') {
        setGameState(state => ({ ...state, gamePhase: 'PLAYING' }));
      }

      if (gameState.roundEndTime && now >= gameState.roundEndTime && gameState.gamePhase === 'PLAYING') {
        evaluateRound();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Persist state
  useEffect(() => {
    const storedState: StoredState = {
      credits: gameState.credits,
      jackpot: gameState.jackpot
    };
    localStorage.setItem('gameState', JSON.stringify(storedState));
  }, [gameState.credits, gameState.jackpot]);

  // Start first round
  useEffect(() => {
    startNewRound();
  }, []);

  const handleCloseResult = () => {
    setShowResult(false);
    startNewRound();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="text-yellow-400" />
          <span className="font-bold">{gameState.credits.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-400">
          Jackpot: {gameState.jackpot.toLocaleString()}
        </div>
      </header>

      <main className="space-y-6">
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <GameTimer 
          endTime={gameState.gamePhase === 'BETTING' ? gameState.bettingEndTime : gameState.roundEndTime} 
        />

        <PriceDisplay 
          price={gameState.currentPrice}
          change={gameState.betPlacementPrice ? 
            (gameState.currentPrice - gameState.betPlacementPrice) / gameState.betPlacementPrice : 
            undefined
          }
        />

        {gameState.bet.direction && gameState.bet.amount > 0 && (
          <BetStatus 
            direction={gameState.bet.direction} 
            amount={gameState.bet.amount} 
          />
        )}

        {gameState.gamePhase === 'BETTING' && (
          <BetControls
            onBet={placeBet}
            credits={gameState.credits}
            disabled={!!gameState.bet.direction}
          />
        )}

        <ResultModal
          result={gameState.roundResult}
          winAmount={gameState.winAmount}
          onClose={handleCloseResult}
          isOpen={showResult}
        />
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
