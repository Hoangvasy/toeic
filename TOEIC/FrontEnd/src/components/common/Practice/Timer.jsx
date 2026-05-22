import { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(15 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const min = Math.floor(time / 60);
  const sec = time % 60;

  return (
    <div className="font-bold text-orange-500">
      {min}:{sec.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
