import React, { createContext, useContext, useState, useEffect } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [activeFocus, setActiveFocus] = useState(null);
  const [focusMemory, setFocusMemory] = useState({});
  const [lastSectionFocus, setLastSectionFocus] = useState({});

  const setFocus = (sectionId, railId, itemId) => {
    console.log("[NavigationContext] Setting focus to:", {
      sectionId,
      railId,
      itemId,
    });
    setActiveFocus({ sectionId, railId, itemId });

    setFocusMemory((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [railId]: { railId, itemId },
      },
    }));

    setLastSectionFocus((prev) => ({
      ...prev,
      [sectionId]: { railId, itemId },
    }));
  };

  const getLastFocus = (sectionId, railId) => {
    const sectionMemory = focusMemory[sectionId] || {};
    const railMemory = sectionMemory[railId] || {
      railId: "rail-0",
      itemId: "item-0",
    };
    return railMemory;
  };

  const getLastSectionFocus = (sectionId) => {
    return (
      lastSectionFocus[sectionId] || { railId: "rail-0", itemId: "item-0" }
    );
  };

  useEffect(() => {
    if (!activeFocus) {
      setFocus("home", "rail-0", "item-0");
      console.log("[NavigationContext] Initial focus set to:", {
        sectionId: "home",
        railId: "rail-0",
        itemId: "item-0",
      });
    }
  }, [activeFocus]);

  return (
    <NavigationContext.Provider
      value={{ activeFocus, setFocus, getLastFocus, getLastSectionFocus }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
