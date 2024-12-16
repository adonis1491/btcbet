import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';

interface GameTimerProps {
  endTime: Date | null;
}

export function GameTimer({ endTime }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState('00:00');

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const diff = differenceInSeconds(endTime, new Date());
      if (diff <= 0) {
        setTimeLeft('00:00');
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="w-full flex justify-center">
      <div className="text-[64px] font-mono tracking-wider text-white bg-black/50 px-4 py-2 rounded-lg">
        {timeLeft.split('').map((char, index) => (
          <span key={index} className={`inline-block w-[40px] text-center ${
            timeLeft === '00:00' ? 'text-red-500' : ''
          }`}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
