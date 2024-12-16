import { motion } from 'framer-motion';

interface PriceDisplayProps {
  price: number;
  change?: number;
}

export function PriceDisplay({ price, change }: PriceDisplayProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-sm rounded-full p-6">
        <div className="text-center mb-2">
          <span className="text-gray-400">BTC 價格</span>
          <div className="text-2xl font-mono text-white">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 1 })}
          </div>
        </div>
        
        {change !== undefined && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center"
          >
            <div className="text-3xl font-bold font-mono tracking-wider">
              {Math.abs(change * 100).toFixed(2)}
              <span className="text-xl">%</span>
            </div>
            <div className="w-full bg-gray-700/50 h-2 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${
                  change >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: '100%' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
