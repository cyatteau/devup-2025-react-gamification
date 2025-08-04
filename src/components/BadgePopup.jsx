const BadgePopup = ({ badge, onClose }) => {
  return (
    <div className="badge-popup">
      <div className="badge-popup-content">
        <h4>{badge.text}</h4>
        <p>{badge.description}</p>
        <div className="close-button-container">
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgePopup;
