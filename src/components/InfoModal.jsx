// src/components/InfoModal.jsx
import React from "react";
import "./InfoModal.css";

/**
 * InfoModal displays landmark details (name, address, description) and a close × button.
 */
export default function InfoModal({ landmark, onClose }) {
  if (!landmark) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{landmark.name}</h2>
        <p>
          <strong>Address:</strong> {landmark.address}
        </p>
        <p>{landmark.description}</p>
      </div>
    </div>
  );
}
