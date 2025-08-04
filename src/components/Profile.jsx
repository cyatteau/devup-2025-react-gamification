// src/Profile.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import BadgePopup from "./BadgePopup";
import VisitedLocationPopup from "./VisitedLocationPopup";
import ProgressBar from "./ProgressBar";
import PlayerList from "./PlayerList";
import AchievementPopup from "./AchievementPopup";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { useAppContext } from "../AppContext";
import Avatar from "./Avatar";
import "./Profile.css";
import "./ProgressBar.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState("");

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [expandSections, setExpandSections] = useState({
    badges: false,
    visitedLocations: false,
    achievements: false,
    styleYourMap: false,
  });
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", score: 100 },
    { id: 2, name: "Player 2", score: 200 },
    { id: 3, name: "Player 3", score: 100 },
    { id: 4, name: "Player 4", score: 100 },
    { id: 5, name: "Player 5", score: 100 },
    { id: 6, name: "Player 6", score: 100 },
    { id: 7, name: "Player 7", score: 200 },
    { id: 8, name: "Player 8", score: 100 },
    { id: 9, name: "Player 9", score: 100 },
    { id: 10, name: "Player 10", score: 100 },
  ]);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [animateProgressBar, setAnimateProgressBar] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");
  const [shownAchievements, setShownAchievements] = useState([]);
  const [selectedBasemap, setSelectedBasemap] = useState(state.selectedBasemap);

  // Achievements logic
  const achievements = [
    {
      text: "Earned First Badge",
      description: "Awarded for earning your first badge",
      condition: (user) => user.achievements.length > 0,
      points: 10,
    },
    {
      text: "Tracked First Location",
      description: "Awarded for visiting your first location",
      condition: (user) => user.visitedLocations.length > 0,
      points: 10,
    },
    {
      text: "Tracked Five Locations",
      description: "Awarded for visiting five different locations",
      condition: (user) => user.visitedLocations.length > 4,
      points: 50,
    },
  ];

  const earnedAchievements = useMemo(
    () => achievements.filter((achievement) => achievement.condition(user)),
    [user]
  );

  useEffect(() => {
    earnedAchievements.forEach((achievement) => {
      if (!shownAchievements.includes(achievement.text)) {
        queueAchievementPopup(achievement.points, achievement.text);
        setShownAchievements((prev) => [...prev, achievement.text]);
      }
    });
  }, [earnedAchievements, shownAchievements]);

  const queueAchievementPopup = (points, text) => {
    setAchievementQueue((prevQueue) => [...prevQueue, { points, text }]);
  };

  useEffect(() => {
    if (achievementQueue.length > 0 && !showAchievementPopup) {
      const { points, text } = achievementQueue[0];
      showAchievementPopupMessage(points, text);
      setAchievementQueue((prevQueue) => prevQueue.slice(1));
    }
  }, [achievementQueue, showAchievementPopup]);

  const showAchievementPopupMessage = (points, text) => {
    setAchievementMessage(`Congrats! You've earned ${points} points for ${text}`);
    setShowAchievementPopup(true);
    setTimeout(() => {
      setShowAchievementPopup(false);
    }, 3000);
  };

  // Navigation handlers
  const handleHomeClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const closeBadgePopup = () => {
    setSelectedBadge(null);
  };

  const closeLocationPopup = () => {
    setSelectedLocation(null);
  };

  const toggleSection = (section) => {
    setExpandSections((prevState) => {
      const newState = { ...prevState, [section]: !prevState[section] };
      if (
        section === "achievements" &&
        !prevState.achievements &&
        !animateProgressBar
      ) {
        setAnimateProgressBar(true);
      }
      return newState;
    });
  };

  const handleSelectBadge = (badge) => {
    setSelectedBadges((prevState) => {
      if (prevState.includes(badge)) {
        return prevState.filter((b) => b !== badge);
      } else {
        return [...prevState, badge];
      }
    });
  };

  const handleLogout = () => {
    setShownAchievements([]);
    logout();
    navigate("/login");
  };

  const handleBasemapChange = (event) => {
    const newBasemapId = event.target.value;
    setSelectedBasemap(newBasemapId);
    dispatch({ type: "SET_SELECTED_BASEMAP", payload: newBasemapId });
    localStorage.setItem("selectedBasemap", newBasemapId);
  };

  useEffect(() => {
    const savedBasemap = localStorage.getItem("selectedBasemap");
    if (savedBasemap) {
      setSelectedBasemap(savedBasemap);
    }
  }, []);

  const shareUrl = window.location.href;
  const titles = selectedBadges.map((b) => b.text).join(", ");
  const description = selectedBadges.map((b) => b.description).join(", ");
  const isDisabled = selectedBadges.length === 0;

  const uniqueBadges = Array.from(
    new Set(user.achievements.map((badge) => badge.text))
  ).map((text) => user.achievements.find((badge) => badge.text === text));

  const totalPoints = useMemo(
    () =>
      earnedAchievements.reduce(
        (sum, achievement) => sum + achievement.points,
        0
      ),
    [earnedAchievements]
  );
  const maxPoints = 500;

  const toggleSimulation = () => {
    setSimulationStarted((prev) => !prev);
  };

  // Simulation for top players (updates players 2 and 7)
  useEffect(() => {
    let interval;
    if (simulationStarted) {
      interval = setInterval(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => {
            if (player.id === 2 || player.id === 7) {
              return {
                ...player,
                score: player.score + Math.floor(Math.random() * 10),
              };
            }
            return player;
          })
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [simulationStarted]);

  const basemapOptions = useMemo(
    () => [
      {
        id: "11b7300674584eb793129a808290d235",
        name: "Default Basemap",
        unlocked: true,
      },
      {
        id: "456d1df3810e482b8abcb2aa0440d6ac",
        name: "Valentine's Basemap",
        unlocked: earnedAchievements.length >= 1,
      },
      {
        id: "f030ad3c601c4c4f9404197ded54b8e6",
        name: "Chocolate Mint Basemap",
        unlocked: earnedAchievements.length >= 2,
      },
    ],
    [earnedAchievements]
  );

  const handleAvatarSelect = (url) => {
    setAvatarUrl(url);
  };

  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={handleProfileClick}>Profile</button>
          {user && (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </nav>
      <div className="profile-container">
        <h2>{user.username}'s Profile</h2>
        <div className="avatar-wrapper">
          <Avatar user={user} onAvatarSelect={handleAvatarSelect} />
        </div>
        <div className="section">
          <h3 onClick={() => toggleSection("badges")}>
            <span className="material-icons icon">emoji_events</span> Badges
          </h3>
          {expandSections.badges && (
            <div>
              {uniqueBadges.length > 0 ? (
                <>
                  <ul className="badges-list">
                    {uniqueBadges.map((badge, index) => (
                      <li
                        key={index}
                        className={`badge-item ${
                          selectedBadges.includes(badge) ? "selected" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBadges.includes(badge)}
                          onChange={() => handleSelectBadge(badge)}
                          className="badge-checkbox"
                        />
                        <div
                          className="badge"
                          style={{ backgroundColor: badge.color }}
                          onClick={() => handleBadgeClick(badge)}
                        >
                          {badge.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="share-selected">
                    <h4>Share Selected Badges:</h4>
                    <div className="social-sharing">
                      <FacebookShareButton
                        url={shareUrl}
                        quote={`I just achieved: ${titles}!`}
                        disabled={isDisabled}
                        style={{
                          pointerEvents: isDisabled ? "none" : "auto",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <LinkedinShareButton
                        url={shareUrl}
                        title={`I just achieved: ${titles}!`}
                        summary={description}
                        disabled={isDisabled}
                        style={{
                          pointerEvents: isDisabled ? "none" : "auto",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                      <WhatsappShareButton
                        url={shareUrl}
                        title={`I just achieved: ${titles}!`}
                        disabled={isDisabled}
                        style={{
                          pointerEvents: isDisabled ? "none" : "auto",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </>
              ) : (
                <p className="no-achievements">No badges earned yet.</p>
              )}
            </div>
          )}
        </div>
        <div className="section">
          <h3 onClick={() => toggleSection("achievements")}>
            <span className="material-icons icon">star</span> Achievements
          </h3>
          {expandSections.achievements && (
            <div>
              <div className="achievements-list">
                {earnedAchievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    <h4>{achievement.text}</h4>
                    <p>{achievement.description}</p>
                    <p>Points: {achievement.points}</p>
                  </div>
                ))}
              </div>
              <div className="total-points">
                <h4>Total Points Earned: {totalPoints}/500</h4>
              </div>
              {animateProgressBar && (
                <ProgressBar points={totalPoints} maxPoints={maxPoints} />
              )}
            </div>
          )}
        </div>
        {/* Visited Locations Section */}
        <div className="section">
          <h3 onClick={() => toggleSection("visitedLocations")}>
            <span className="material-icons icon">location_on</span> Visited
            Locations
          </h3>
          {expandSections.visitedLocations && (
            <div>
              {user.visitedLocations.length > 0 ? (
                <ul className="visited-locations-list">
                  {user.visitedLocations.map((location, index) => (
                    <li
                      key={index}
                      className="visited-location"
                      onClick={() => handleLocationClick(location)}
                    >
                      {location.address}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-visited-locations">
                  No locations visited yet.
                </p>
              )}
            </div>
          )}
        </div>
        {/* Map Style Section */}
        <div className="section">
          <h3 onClick={() => toggleSection("styleYourMap")}>
            <span className="material-icons icon">map</span> Style Your Map
          </h3>
          {expandSections.styleYourMap && (
            <div>
              <select
                value={selectedBasemap}
                onChange={handleBasemapChange}
                className="basemap-select"
              >
                {basemapOptions.map((option) =>
                  option.unlocked ? (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ) : (
                    <option key={option.id} value={option.id} disabled>
                      {option.name} - Locked (
                      {option.id === "456d1df3810e482b8abcb2aa0440d6ac"
                        ? `Earn 1 achievement to unlock`
                        : `Earn 2 achievements to unlock`}
                      )
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>
      </div>
      {selectedBadge && (
        <BadgePopup badge={selectedBadge} onClose={closeBadgePopup} />
      )}
      {selectedLocation && (
        <VisitedLocationPopup
          location={selectedLocation}
          onClose={closeLocationPopup}
        />
      )}
      <button onClick={toggleSimulation}>
        {simulationStarted ? "Hide Top Players List" : "Show Top Players List"}
      </button>
      {simulationStarted && <PlayerList players={players} />}
      {showAchievementPopup && (
        <AchievementPopup message={achievementMessage} />
      )}
    </div>
  );
};

export default Profile;
