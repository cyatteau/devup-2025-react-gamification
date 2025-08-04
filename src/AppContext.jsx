import { createContext, useReducer, useContext } from "react";

const AppContext = createContext();

const initialState = {
  location: null,
  locationInput: "",
  submitted: false,
  selectedBadge: null,
  badges: [],
  selectedBasemap: "11b7300674584eb793129a808290d235",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_LOCATION_INPUT":
      return { ...state, locationInput: action.payload };
    case "SET_SUBMITTED":
      return { ...state, submitted: action.payload };
    case "RESET":
      return initialState;
    case "SET_SELECTED_BADGE":
      return { ...state, selectedBadge: action.payload };
    case "SET_SELECTED_BASEMAP":
      return { ...state, selectedBasemap: action.payload };
    case "EARN_BADGE":
      return {
        ...state,
        badges: [...state.badges, action.payload],
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

