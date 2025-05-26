import React from "react";
import NavigableSection from "../../core/components/NavigableSection";

/**
 * Component that displays similar content items
 */
const SimilarContent = ({
  similarContentRail,
  activeSection,
  handleSectionNavigation,
  handleSectionFocus,
  isDimmed,
}) => {
  const railItemProps = {
    className: "transition-all duration-300 hover:opacity-90",
    imageClassName: "rounded-md shadow-md",
    titleClassName: "text-sm text-gray-300 mt-2 truncate",
    style: {
      width: "12rem",
      marginRight: "1rem",
    },
    imageStyle: {
      height: "9rem",
    }
  };
  
  return (
    <div
      className={`mt-12 transition-all duration-500 relative z-30 ${
        isDimmed ? "bg-gray-900/50 p-6 rounded-lg backdrop-blur-sm" : ""
      }`}
      style={{ transform: `translateY(${isDimmed ? -50 : 0}px)` }}
    >
      <h2 className="text-xl font-medium text-gray-200 mb-4">Similar Content</h2>
      <NavigableSection
        sectionId="similar-content"
        rails={[similarContentRail]}
        orientation="horizontal"
        isMenu={false}
        onNavigate={handleSectionNavigation}
        isActive={activeSection === "similar-content"}
        neighbors={{ up: "play-button" }}
        onFocus={handleSectionFocus}
        railClassName="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
        itemProps={railItemProps}
      />
    </div>
  );
};

export default React.memo(SimilarContent);
