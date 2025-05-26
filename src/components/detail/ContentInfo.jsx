import React from "react";
import NavigableSection from "../../core/components/NavigableSection";

/**
 * Component that displays content information
 */
const ContentInfo = ({
  item,
  loremIpsum,
  playButtonRail,
  activeSection,
  handleSectionNavigation,
  handleSectionFocus,
  contentTranslateY,
}) => {
  const playButtonProps = {
    buttonClassName: "inline-flex items-center justify-center px-6 py-3 rounded-md transition-all duration-300 bg-[#0078D7] text-white hover:bg-[#0063B1]",
    style: {
      minWidth: "120px",
      height: "46px",
    }
  };
  
  return (
    <div
      className="flex flex-col md:flex-row gap-8 mb-12 transition-all duration-500 relative z-20"
      style={{ transform: `translateY(${contentTranslateY}px)` }}
    >
      <div className="flex-shrink-0 w-64 md:w-72">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full rounded-md shadow-md"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-medium mb-3 text-white">{item.title}</h1>
        <div className="flex gap-4 text-gray-400 mb-4 text-sm">
          <span>2023</span>
          <span>•</span>
          <span>120 min</span>
          <span>•</span>
          <span>8.5/10</span>
        </div>
        <p className="text-base text-gray-300 mb-4">{item.description || loremIpsum.substring(0, 150)}</p>
        <div className="text-sm text-gray-400 mb-6">
          <p>{loremIpsum.substring(0, 180)}...</p>
        </div>

        {/* Play button - with NavigableSection */}
        <div className="mt-4">
          <NavigableSection
            sectionId="play-button"
            rails={[playButtonRail]}
            orientation="horizontal"
            isMenu={false}
            onNavigate={handleSectionNavigation}
            isActive={activeSection === "play-button"}
            neighbors={{ down: "similar-content" }}
            onFocus={handleSectionFocus}
            itemProps={playButtonProps}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContentInfo);
