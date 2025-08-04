import "./VisitedLocationPopup.css";

const VisitedLocationPopup = ({ location, onClose }) => {
  return (
    <div className="visited-location-popup">
      <div className="visited-location-popup-content">
        <h4>{location.address}</h4>
        <p>Date Visited: {new Date(location.dateVisited).toLocaleString()}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default VisitedLocationPopup;
