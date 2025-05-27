import React, { useEffect, useState } from "react";
import NavigableSection from "../../core/components/NavigableSection";
import { useNavigation } from "../../core/navigation/NavigationContext";

function DetailSample() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { setFocus } = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setFocus("list", "rail-0", "item-0");
    }, 50);
  }, []);

  const movies = [
    { id: "movie-0", title: "The Matrix", year: 1999, color: "#3498db" },
    { id: "movie-1", title: "Inception", year: 2010, color: "#2ecc71" },
    { id: "movie-2", title: "Interstellar", year: 2014, color: "#e74c3c" },
  ];

  const handleNavigation = (
    action,
    fromSectionId,
    toSectionId,
    railId,
    itemId
  ) => {
    if (action === "select") {
      console.log(
        `Navigating from ${fromSectionId} to ${toSectionId} with rail ${railId} and item ${itemId}`
      );
    }
  };

  return (
    <div>
      <h1>Movies</h1>

      <NavigableSection
        sectionId="list"
        isActive={true}
        rails={[
          {
            title: "movies",
            items: movies.map((movie, index) => ({
              id: "movie-" + index,
              title: movie.title,
            })),
          },
        ]}
        orientation="horizontal"
        onNavigate={handleNavigation}
      ></NavigableSection>
    </div>
  );
}

export default DetailSample;
