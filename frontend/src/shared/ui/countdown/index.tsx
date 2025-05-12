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

const timerNumberClassName = 'flex items-center justify-center rounded m-0.5 text-white text-3xl font-mono grow bg-slate-500';

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
    <div className="bg-gray-800 inline-flex grow rounded-md h-[60px] p-1 w-56">
      <div className={timerNumberClassName}>{time.minutes[0]}</div>
      <div className={timerNumberClassName}>{time.minutes[1]}</div>
      <div className="text-2xl text-white flex items-center font-bold -translate-y-0.5 mx-1">:</div>
      <div className={timerNumberClassName}>{time.seconds[0]}</div>
      <div className={timerNumberClassName}>{time.seconds[1]}</div>
    </div>
  );
};
