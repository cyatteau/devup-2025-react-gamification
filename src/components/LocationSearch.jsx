import { useState, useEffect } from "react";
import { suggest } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import useDebounce from "../hooks/useDebounce";

const LocationSearch = ({ onSelectLocation, locationInput, setLocationInput, apiKey }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(locationInput, 500);

  const handleInputChange = (event) => {
    setLocationInput(event.target.value);
  };

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    suggest(debouncedInput, {
      authentication: ApiKeyManager.fromKey(apiKey),
    }).then((response) => {
      setSuggestions(response.suggestions);
      setLoading(false);
    });
  }, [debouncedInput, apiKey]);

  const handleSuggestionClick = (suggestion) => {
    onSelectLocation(suggestion);
    setLocationInput(suggestion.text);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleInputChange}
        value={locationInput || ""}
        placeholder="🔎  Search a location"
        className="location-input"
      />
      {loading && <div className="spinner"></div>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.magicKey}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
