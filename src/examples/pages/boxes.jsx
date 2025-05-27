import React from "react";
import { useNavigation } from "../../core/navigation/NavigationContext";
import NavigableSection from "../../core/components/NavigableSection";

function Boxes() {
  return (
    <NavigableSection
      sectionId="home"
      rails={[
        {
          title: "Boxes",
          items: [
            {
              title: "box1",
            },
            { title: "box2" },
          ],
        },
      ]}
      orientation="horizontal"
    ></NavigableSection>
  );
}

export default Boxes;
