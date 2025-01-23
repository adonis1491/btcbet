import { motion } from 'framer-motion';

interface BetControlsProps {
  onBet: (direction: 'up' | 'down', amount: number) => void;
  disabled?: boolean;
  credits: number;
}

export function BetControls({ onBet, disabled, credits }: BetControlsProps) {
  const betAmount = Math.min(100, credits);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onBet('up', betAmount)}
          disabled={disabled || credits < betAmount}
          className="py-4 px-6 rounded-xl bg-green-600/90 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold text-white text-center"
        >
          上漲 ↑
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onBet('down', betAmount)}
          disabled={disabled || credits < betAmount}
          className="py-4 px-6 rounded-xl bg-red-600/90 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold text-white text-center"
        >
          下跌 ↓
        </motion.button>
      </div>
    </div>
  );
}
