import {
  FC, useEffect, useState
} from 'react';

type CountdownProps = {
  date: string
  onEnd: () => void
  seconds: number
};

const baseState = {
  minutes: '00',
  seconds: '00'
};

const timerNumberClassName = 'flex items-center justify-center rounded text-white text-sm font-mono grow';

export const Countdown: FC<CountdownProps> = ({
  date, onEnd, seconds
}) => {
  const [time, setTime] = useState(baseState);

  useEffect(() => {
    const dateMills = new Date(date).getTime();
    const endDateMills = dateMills + (seconds * 1000);
    let timout: NodeJS.Timeout | null = null;

    timout = setInterval(() => {
      const now = Date.now();
      const diff = (endDateMills - now) / 1000;

      if (diff < 0 && timout) {
        setTime(baseState);
        onEnd();
      } else {
        setTime({
          minutes: Math.floor(diff / 60).toString().padStart(2, '0'),
          seconds: Math.floor(diff % 60).toString().padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timout);
  }, []);

  return (
    <div className="bg-primary inline-flex grow rounded-full py-1 px-2 h-6">
      <div className={timerNumberClassName}>{time.minutes[0]}</div>
      <div className={timerNumberClassName}>{time.minutes[1]}</div>
      <div className="text-sm text-white flex items-center font-bold -translate-y-0.5 mx-0.5">:</div>
      <div className={timerNumberClassName}>{time.seconds[0]}</div>
      <div className={timerNumberClassName}>{time.seconds[1]}</div>
    </div>
  );
};
