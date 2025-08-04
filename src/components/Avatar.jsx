import React, { useState, useEffect } from "react";
import "./Avatar.css";

const defaultOptions = {
  hair: "long01",
  eyes: "variant01",
  flip: "false",
  backgroundColor: "b6e3f4",
};

const generateAvatarUrl = (options, seed) => {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    params.append(key, value);
  });
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&${params.toString()}`;
};

const Avatar = ({ user, onAvatarSelect }) => {
  const storedOptions = localStorage.getItem("avatarOptions");
  const initialOptions = storedOptions
    ? JSON.parse(storedOptions)
    : defaultOptions;

  const [avatarOptions, setAvatarOptions] = useState(initialOptions);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    const url = generateAvatarUrl(avatarOptions, user.username);
    setAvatarUrl(url);
    if (onAvatarSelect) {
      onAvatarSelect(url);
    }
    localStorage.setItem("avatarOptions", JSON.stringify(avatarOptions));
  }, [avatarOptions, user.username, onAvatarSelect]);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setAvatarOptions((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="avatar-container">
      <img src={avatarUrl} alt="User Avatar" className="avatar-image" />
      <button
        className="toggle-customizer"
        onClick={() => setShowCustomizer((prev) => !prev)}
      >
        {showCustomizer ? "Hide Customizer" : "Customize Avatar"}
      </button>
      {showCustomizer && (
        <div className="avatar-customizer">
          <div className="avatar-options-row">
            <label>
              Hair:
              <select
                name="hair"
                value={avatarOptions.hair}
                onChange={handleOptionChange}
              >
                <option value="short01">Short Hair</option>
                <option value="long15">Pig Tails</option>
                <option value="long16">Braid</option>
                <option value="long01">Long Hair</option>
              </select>
            </label>
            <label>
              Eyes:
              <select
                name="eyes"
                value={avatarOptions.eyes}
                onChange={handleOptionChange}
              >
                <option value="variant01">Default</option>
                <option value="variant22">Wink</option>
                <option value="variant14">Squint</option>
              </select>
            </label>
            <label>
              Flip:
              <select
                name="flip"
                value={avatarOptions.flip}
                onChange={handleOptionChange}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
          </div>
          <div className="avatar-options-row">
            <label>
              Background:
              <select
                name="backgroundColor"
                value={avatarOptions.backgroundColor}
                onChange={handleOptionChange}
              >
                <option value="b6e3f4">Blue Gray</option>
                <option value="d1d4f9">Periwinkle</option>
                <option value="ffd5dc">Pink</option>
                <option value="ffdfbf">Peach</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
