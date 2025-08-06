// src/App.jsx
import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { AppProvider, useAppContext } from "./AppContext";
import LocationSearch from "./components/LocationSearch";
import { geocode, reverseGeocode } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import useDemographicData from "./hooks/useDemographicData";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Root from "./components/Root";
import QuestStatus from "./components/QuestStatus";
import { loadLandmarks } from "./utils";
import InfoModal from "./components/InfoModal"; // make sure this import exists

// Lazy–loaded components
const MapViewComponent = lazy(() => import("./components/MapViewComponent"));
const SimpleMapComponent = lazy(() =>
  import("./components/SimpleMapComponent")
);
const DemographicData = lazy(() => import("./components/DemographicData"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));

const apiKey =
  "AAPKc0a534840fb6404cb4e7350c842f2f137WNlQPzeGdDeqztxzZ_1U4PM9qnN5JKH1H9HF64M3KLjYCNgZ1p3szK3qlcCXJvX";

function AppContent() {
  const { state, dispatch } = useAppContext();
  const { demographicData, loading, error, fetchData } = useDemographicData();
  const { user, earnBadge, saveVisitedLocation, logout } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [questEnabled, setQuestEnabled] = useState(false);
  const [questStarted, setQuestStarted] = useState(false);
  const [foundLandmarks, setFoundLandmarks] = useState([]);
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);
  const [nearbyLandmarks, setNearbyLandmarks] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [landmarks, setLandmarks] = useState([]);
  const [selectedBasemap, setSelectedBasemap] = useState(
    localStorage.getItem("selectedBasemap") ||
      "273bf8d5c8ac400183fc24e109d20bcf"
  );
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  useEffect(() => {
    const loadedLandmarks = loadLandmarks();
    setLandmarks(loadedLandmarks);
  }, []);

  useEffect(() => {
    const savedBasemap = localStorage.getItem("selectedBasemap");
    if (savedBasemap) {
      setSelectedBasemap(savedBasemap);
      dispatch({ type: "SET_SELECTED_BASEMAP", payload: savedBasemap });
    }
  }, [dispatch]);

  const handleBasemapChange = (newBasemapId) => {
    setSelectedBasemap(newBasemapId);
    localStorage.setItem("selectedBasemap", newBasemapId);
    dispatch({ type: "SET_SELECTED_BASEMAP", payload: newBasemapId });
  };

  useEffect(() => {
    if (location.pathname === "/") {
      dispatch({ type: "RESET" });
      setCurrentLocation(null);
      setTracking(false);
      setQuestEnabled(false);
      setNearbyLandmarks([]);
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (questStarted) {
      const found = JSON.parse(localStorage.getItem("foundLandmarks")) || [];
      setFoundLandmarks(found);
    }
  }, [questStarted]);

  // Set API key
  ApiKeyManager.fromKey(apiKey);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSelectLocation = (suggestion) => {
    const { magicKey } = suggestion;
    geocode({ magicKey, authentication: ApiKeyManager.fromKey(apiKey) })
      .then((result) => {
        if (result.candidates && result.candidates.length > 0) {
          const { location } = result.candidates[0];
          dispatch({
            type: "SET_LOCATION",
            payload: { latitude: location.y, longitude: location.x },
          });
          dispatch({
            type: "SET_LOCATION_INPUT",
            payload: result.candidates[0].attributes.LongLabel,
          });
          dispatch({ type: "SET_SUBMITTED", payload: true });
          fetchData(location.y, location.x);
          setTracking(false);
        } else {
          console.log("No location found for the given magicKey.");
        }
      })
      .catch((err) => console.error("Geocoding failed:", err));
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    setCurrentLocation(null);
    setTracking(false);
    setQuestEnabled(false);
    setQuestStarted(false);
    setFoundLandmarks([]);
    setNearbyLandmarks([]);
    localStorage.removeItem("questStarted");
    localStorage.removeItem("foundLandmarks");
    setCurrentLandmarkIndex(0);
    setShowAnimation(false);
    setShowCongrats(false);
    navigate("/");
  };

  const handleHome = () => {
    dispatch({ type: "RESET" });
    setCurrentLocation(null);
    setTracking(false);
    setQuestEnabled(false);
    setQuestStarted(false);
    setFoundLandmarks([]);
    setNearbyLandmarks([]);
    localStorage.removeItem("questStarted");
    localStorage.removeItem("foundLandmarks");
    setCurrentLandmarkIndex(0);
    setShowAnimation(false);
    setShowCongrats(false);
    navigate("/");
  };

  const handleBadgeClick = (badge) => {
    dispatch({ type: "SET_SELECTED_BADGE", payload: badge });
  };

  const handleTrackLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const dateVisited = new Date().toISOString();
        setCurrentLocation({ latitude, longitude });
        setSelectedLandmark(null);
        dispatch({
          type: "SET_LOCATION",
          payload: {
            latitude: latitude,
            longitude: longitude,
          },
        });
        dispatch({ type: "SET_LOCATION", payload: { latitude, longitude } });
        dispatch({ type: "SET_SUBMITTED", payload: true });
        setTracking(true);
        try {
          const data = await fetchData(latitude, longitude);
          if (data) {
            data.badges.forEach((badge) => {
              earnBadge(badge);
            });
          }
          const response = await reverseGeocode([longitude, latitude], {
            authentication: ApiKeyManager.fromKey(apiKey),
          });
          const address = response.address.LongLabel;
          saveVisitedLocation({ latitude, longitude, address, dateVisited });
          const filteredLandmarks = landmarks.filter((landmark) => {
            const distance = calculateDistance(
              latitude,
              longitude,
              landmark.coordinates.latitude,
              landmark.coordinates.longitude
            );
            return distance <= 100000;
          });
          setNearbyLandmarks(filteredLandmarks);
          setNearbyLandmarks(filteredLandmarks);
          setSelectedLandmark(null);
          setQuestEnabled(filteredLandmarks.length > 0);
          setQuestEnabled(filteredLandmarks.length > 0);
        } catch (error) {
          console.error("Failed to fetch demographic data or address:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, [fetchData, earnBadge, saveVisitedLocation, landmarks, dispatch]);

  const handleTrackNewLocation = useCallback(async () => {
    const landmark = nearbyLandmarks[currentLandmarkIndex];
    if (!landmark) return;

    // 1) Immediately open the modal for this landmark
    const { latitude, longitude } = landmark.coordinates;
    const key = `${latitude}_${longitude}`;
    setSelectedLandmark({
      id: key,
      name: landmark.name,
      address: landmark.address,
      description: landmark.description,
    });

    // 2) Then move the map & trigger your existing geocode/badge logic
    setCurrentLocation({ latitude, longitude });
    dispatch({
      type: "SET_LOCATION",
      payload: { latitude, longitude },
    });
    setTracking(true);

    try {
      const data = await fetchData(latitude, longitude);
      data?.badges.forEach((badge) => earnBadge(badge));
      const response = await reverseGeocode([longitude, latitude], {
        authentication: ApiKeyManager.fromKey(apiKey),
      });
      const address = response.address.LongLabel;
      saveVisitedLocation({
        latitude,
        longitude,
        address,
        dateVisited: new Date().toISOString(),
      });

      // mark this landmark found
      setFoundLandmarks((prev) => {
        if (prev.find((l) => l === landmark)) return prev;
        return [...prev, landmark];
      });
      localStorage.setItem(
        "foundLandmarks",
        JSON.stringify([...foundLandmarks, landmark])
      );
      if (foundLandmarks.length + 1 === nearbyLandmarks.length) {
      }
    } catch (err) {
      console.error(err);
    }

    setCurrentLandmarkIndex((i) => Math.min(i + 1, nearbyLandmarks.length - 1));
  }, [
    currentLandmarkIndex,
    nearbyLandmarks,
    fetchData,
    earnBadge,
    saveVisitedLocation,
    foundLandmarks,
    dispatch,
  ]);

  const handleStartQuest = () => {
    if (questEnabled) {
      setQuestStarted(true);
      localStorage.setItem("questStarted", true);
      console.log("Quest started!");
    } else {
      console.log(
        "You need to be near at least one landmark to start the quest."
      );
    }
  };

  const handleEndQuest = () => {
    setSelectedLandmark(null);
    setQuestStarted(false);
    setFoundLandmarks([]);
    setNearbyLandmarks([]);
    localStorage.removeItem("questStarted");
    localStorage.removeItem("foundLandmarks");
    setCurrentLandmarkIndex(0);
    setShowAnimation(false);
    setShowCongrats(false);
    setQuestEnabled(false);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`App ${questStarted ? "quest-in-progress" : ""}`}>
      {/* ── Top Nav / Banner ── */}
      {questStarted ? (
        <div className="quest-banner">
          <h1>Quest In Progress</h1>
          <p>
            Stay focused on your mission. End your quest anytime with the button
            below.
          </p>
        </div>
      ) : (
        <nav className="navbar">
          <div className="nav-links">
            <button onClick={handleHome}>Home</button>
            {user ? (
              <>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/login")}>Login</button>
            )}
          </div>
        </nav>
      )}

      {/* ── Main Layout ── */}
      <div
        className={`layout-container ${state.submitted ? "split-layout" : ""} ${
          questStarted ? "dimmed-content" : ""
        }`}
      >
        {/* Side panel (forms / facts / badges) */}
        <div className="stats-badges-container">
          <div className="form-container">
            {user && !state.submitted && (
              <button onClick={handleTrackLocation} className="track-button">
                📍 Track Current Location
              </button>
            )}

            {!state.submitted ? (
              <LocationSearch
                onSelectLocation={handleSelectLocation}
                apiKey={apiKey}
                locationInput={state.locationInput}
                setLocationInput={(input) =>
                  dispatch({ type: "SET_LOCATION_INPUT", payload: input })
                }
              />
            ) : (
              <>
                {!questStarted && (
                  <button onClick={handleReset} className="reset-button">
                    {tracking
                      ? "📍 Track a New Location"
                      : "🔎 Search a New Location"}
                  </button>
                )}

                <div>
                  {loading && <p>Loading...</p>}
                  {error && <p>{error.message}</p>}
                  {demographicData && (
                    <Suspense fallback={<div>Loading…</div>}>
                      <DemographicData
                        funFact={demographicData.funFact}
                        badges={demographicData.badges}
                        handleBadgeClick={handleBadgeClick}
                        selectedBadge={state.selectedBadge}
                        setSelectedBadge={(badge) =>
                          dispatch({
                            type: "SET_SELECTED_BADGE",
                            payload: badge,
                          })
                        }
                        isTracking={tracking}
                        user={user}
                      />
                    </Suspense>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Map / Modal */}
        <div className="map-container">
          <Suspense fallback={<div>Loading Map…</div>}>
            {state.location ? (
              <MapViewComponent
                location={state.location}
                landmarks={nearbyLandmarks}
                selectedBasemap={selectedBasemap}
                questStarted={questStarted}
                currentLandmarkIndex={currentLandmarkIndex}
                onLandmarkSelect={setSelectedLandmark}
              />
            ) : (
              <SimpleMapComponent selectedBasemap={selectedBasemap} />
            )}

            {selectedLandmark && (
              <InfoModal
                landmark={selectedLandmark}
                onClose={() => setSelectedLandmark(null)}
              />
            )}
          </Suspense>
        </div>
      </div>

      {/* ── Quest Status & Controls ── */}
      <QuestStatus
        questStarted={questStarted}
        foundLandmarks={foundLandmarks.length}
        totalLandmarks={nearbyLandmarks.length}
      />

      {questStarted && (
        <div className="quest-buttons">
          <button onClick={handleTrackNewLocation} className="track-button">
            Track New Location
          </button>
          <button onClick={handleEndQuest} className="end-quest-button">
            End Quest
          </button>
        </div>
      )}

      {/* ── Celebrations & Prompts ── */}
      {showAnimation && <CompletionAnimation />}

      {showCongrats && (
        <div className="popup-container">
          <div className="congrats-popup">
            <p>
              Congratulations! You visited all places and finished the quest!
            </p>
          </div>
        </div>
      )}

      {questEnabled && !questStarted && (
        <div className="quest-start-container">
          <button onClick={handleStartQuest} className="start-quest-button">
            Start Quest
          </button>
        </div>
      )}
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      errorElement={<div>Something went wrong!</div>}
    >
      <Route index element={<AppContent />} />
      <Route
        path="login"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
