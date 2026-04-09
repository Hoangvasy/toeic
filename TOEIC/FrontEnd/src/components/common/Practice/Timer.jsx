import { useEffect, useState } from "react";

export default function Timer({ seconds }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60);
  const sec = time % 60;

  return (
    <div className="text-red-500 font-semibold">
      ⏱ {minutes}:{sec.toString().padStart(2, "0")}
    </div>
  );
}
