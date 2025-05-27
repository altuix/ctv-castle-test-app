import React, { useState } from "react";
import { NavigationProvider } from "../core/navigation/NavigationContext";
import Boxes from "./pages/boxes";
import DetailSample from "./pages/detailSample";
function SimpleExamples() {
  const [currentPage, setCurrentPage] = useState("boxes");

  return (
    <NavigationProvider>
      <div className="flex gap-10 p-10">
        <button onClick={() => setCurrentPage("boxes")}>Boxes</button>

        <button onClick={() => setCurrentPage("detail")}>Detail</button>

        <button onClick={() => setCurrentPage("menuContent")}>
          Menu & Content
        </button>
      </div>

      {currentPage === "boxes" && <Boxes />}
      {currentPage === "detail" && <DetailSample />}
    </NavigationProvider>
  );
}

export default SimpleExamples;
