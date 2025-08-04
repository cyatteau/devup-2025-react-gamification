import "./DemographicData.css";

const DemographicData = ({
  funFact,
  badges,
  handleBadgeClick,
  selectedBadge,
  setSelectedBadge,
  isTracking,
}) => {
  return (
    <div className="stats-badges-container">
      <div className="stats-section">
        <h2>Local Information</h2>
        <ul className="fun-fact">
          {funFact.map((fact, index) => (
            <li className="facts" key={index}>
              {fact}
            </li>
          ))}
        </ul>
      </div>
      {badges.length > 0 && (
        <div className="badges-section">
          <h3 className="badge-title">{isTracking ? "Badges Earned" : "Visit to Earn these Badges"}</h3>
          <div>
            {badges.map((badge) => (
              <div
                className="badge"
                style={{ backgroundColor: badge.color }}
                key={badge.text}
                onClick={() => handleBadgeClick(badge)}
              >
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedBadge && (
        <div className="badge-popup">
          <div className="badge-popup-content">
            <h4>{selectedBadge.text}</h4>
            <p>{selectedBadge.description}</p>
            <button onClick={() => setSelectedBadge(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemographicData;
