import "./AchievementComponent.css";

const AchievementComponent = ({ achievement, isSelected, onSelect }) => {
  return (
    <div className="achievement">
      <div className="achievement-info">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(achievement)}
        />
        <h4 className="achievement-share-name">{achievement.text}</h4>
      </div>
    </div>
  );
};

export default AchievementComponent;
