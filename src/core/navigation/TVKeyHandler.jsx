import React, { useEffect } from "react";

const TVKeyHandler = ({ onNavigate, children }) => {
  const keyMap = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    13: "enter",
    8: "back",
    77: "menu",
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const action = keyMap[event.keyCode];
      if (action) {
        onNavigate(action);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNavigate]);

  return <>{children}</>;
};

export default TVKeyHandler;
