import React, { useState } from 'react';
import './RatingModal.css';

function RatingModal({ onSubmit, onCancel }) {
  const [ratings, setRatings] = useState({
    twistiness: 3,
    surface_condition: 3,
    fun_factor: 3,
    scenery: 3,
    visibility: 3,
  });

  const handleChange = (e) => {
    setRatings({ ...ratings, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ratings);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal-content">
        <h2>Rate this Road</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Twistiness: {ratings.twistiness}</label>
            <input type="range" name="twistiness" min="1" max="5" value={ratings.twistiness} onChange={handleChange} />
          </div>
          <div>
            <label>Surface Condition: {ratings.surface_condition}</label>
            <input type="range" name="surface_condition" min="1" max="5" value={ratings.surface_condition} onChange={handleChange} />
          </div>
          <div>
            <label>Fun Factor: {ratings.fun_factor}</label>
            <input type="range" name="fun_factor" min="1" max="5" value={ratings.fun_factor} onChange={handleChange} />
          </div>
          <div>
            <label>Scenery: {ratings.scenery}</label>
            <input type="range" name="scenery" min="1" max="5" value={ratings.scenery} onChange={handleChange} />
          </div>
          <div>
            <label>Visibility: {ratings.visibility}</label>
            <input type="range" name="visibility" min="1" max="5" value={ratings.visibility} onChange={handleChange} />
          </div>
          <button type="submit">Submit Rating</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </>
  );
}

export default RatingModal;
