import { Home, BarChart2, Users, ClipboardList, Gift } from 'lucide-react';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="max-w-md mx-auto flex justify-between items-center px-6 py-3">
        <button className="flex flex-col items-center space-y-1">
          <Home size={20} className="text-white" />
          <span className="text-xs text-gray-400">賽車</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <BarChart2 size={20} className="text-gray-400" />
          <span className="text-xs text-gray-400">排行榜</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <Users size={20} className="text-gray-400" />
          <span className="text-xs text-gray-400">車隊</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <ClipboardList size={20} className="text-gray-400" />
          <span className="text-xs text-gray-400">任務</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <Gift size={20} className="text-gray-400" />
          <span className="text-xs text-gray-400">神秘獎勵</span>
        </button>
      </div>
    </div>
  );
}
