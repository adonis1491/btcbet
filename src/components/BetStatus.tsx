import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface BetStatusProps {
  direction: 'up' | 'down';
  amount: number;
}

export function BetStatus({ direction, amount }: BetStatusProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center">
          {direction === 'up' ? (
            <ArrowUpCircle className="w-6 h-6 text-green-400 mr-2" />
          ) : (
            <ArrowDownCircle className="w-6 h-6 text-red-400 mr-2" />
          )}
          <span className="text-lg">
            投注方向：{direction === 'up' ? '上漲' : '下跌'}
          </span>
        </div>
        <span className="text-gray-400">|</span>
        <div className="text-lg">
          投注金額：<span className="text-yellow-400 font-bold">{amount}</span>
        </div>
      </div>
    </div>
  );
}
