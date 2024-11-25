import React, { useState, useEffect } from "react";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h4>
        {formattedDate} {currentTime.toLocaleTimeString()}
      </h4>
    </div>
  );
};

export default RealTimeClock;
