import React, { useState } from "react";
import { NavigationProvider } from "../core/navigation/NavigationContext";
import Boxes from "./pages/boxes";
function SimpleExamples() {
  const [currentPage, setCurrentPage] = useState("boxes");

  return (
    <NavigationProvider>
      <div>
        <button onClick={() => setCurrentPage("boxes")}>Boxes</button>
        <button onClick={() => setCurrentPage("detail")}>Detail</button>
        <button onClick={() => setCurrentPage("menuContent")}>
          Menu & Content
        </button>
      </div>

      {currentPage === "boxes" && <Boxes />}
    </NavigationProvider>
  );
}

export default SimpleExamples;
