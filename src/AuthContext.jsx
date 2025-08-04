import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (username, password) => {
    if (username === "user" && password === "password") {
      const user = {
        username,
        achievements: [],
        visitedLocations: [],
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const earnBadge = (badge) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        achievements: [...prevUser.achievements, badge],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const saveVisitedLocation = (location) => {
    setUser((prevUser) => {
      const existingLocation = prevUser.visitedLocations.find(
        (loc) => loc.address === location.address
      );

      if (existingLocation) {
        return prevUser;
      }

      const updatedUser = {
        ...prevUser,
        visitedLocations: [...prevUser.visitedLocations, location],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, earnBadge, saveVisitedLocation }}>
      {children}
    </AuthContext.Provider>
  );
};
