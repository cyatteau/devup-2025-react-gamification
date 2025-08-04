import { useEffect, useState } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ points, maxPoints }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const animateProgress = () => {
      setProgress((prev) => {
        const nextProgress = Math.min(prev + 1, (points / maxPoints) * 100);
        if (nextProgress < (points / maxPoints) * 100) {
          animationFrameId = requestAnimationFrame(animateProgress);
        }
        return nextProgress;
      });
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [points, maxPoints]);

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="progress-bar-text">
        {points} / {maxPoints} Points
      </span>
    </div>
  );
};

export default ProgressBar;
