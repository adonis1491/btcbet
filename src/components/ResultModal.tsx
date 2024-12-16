import { motion, AnimatePresence } from 'framer-motion';
import { Flame, BatteryLow } from 'lucide-react';

interface ResultModalProps {
  result: 'WIN' | 'MISS' | null;
  winAmount: number;
  onClose: () => void;
  isOpen: boolean;
}

export function ResultModal({ result, winAmount, onClose, isOpen }: ResultModalProps) {
  if (!result || !isOpen) return null;

  const isWin = result === 'WIN';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { type: "spring", stiffness: 200, damping: 15 }
          }}
          exit={{ scale: 0, rotate: 10 }}
          className={`p-8 rounded-2xl ${
            isWin ? 'bg-green-500/20' : 'bg-red-500/20'
          } backdrop-blur-lg`}
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              transition: { repeat: Infinity, duration: 1.5 }
            }}
            className="flex flex-col items-center"
          >
            {isWin ? (
              <Flame className="w-24 h-24 text-yellow-400 mb-4" />
            ) : (
              <BatteryLow className="w-24 h-24 text-red-400 mb-4" />
            )}
            <motion.h2
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className={`text-5xl font-bold mb-4 ${
                isWin ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isWin ? '獲勝!' : '失敗'}
            </motion.h2>
            {isWin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-yellow-400"
              >
                獲得 {winAmount.toFixed(2)} 積分!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
