import React from "react";
import "./QuestStatus.css";

const QuestStatus = ({ questStarted, foundLandmarks, totalLandmarks }) => {
  if (!questStarted) return null;
  const progressPercentage = Math.round((foundLandmarks / totalLandmarks) * 100);
  return (
    <div className="quest-status-container">
      <h3>Quest Started!</h3>
      <p>
        You have found {foundLandmarks} out of {totalLandmarks} landmarks.
      </p>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuestStatus;
