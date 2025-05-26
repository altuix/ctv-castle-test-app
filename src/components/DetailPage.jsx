import React, { useMemo, useEffect } from "react";
import useDetailPageData from "../core/hooks/useDetailPageData";
import useDetailPageNavigation from "../core/hooks/useDetailPageNavigation";
import ContentInfo from "./detail/ContentInfo";
import SimilarContent from "./detail/SimilarContent";

/**
 * Detail page component
 */
const DetailPage = ({ itemId, railId, onBack }) => {
  const validParams = Boolean(itemId && railId);

  const { itemData, loading, error } = useDetailPageData(
    validParams ? railId : "",
    validParams ? itemId : ""
  );

  const {
    activeSection,
    uiState,
    handleSectionFocus,
    handleSectionNavigation,
  } = useDetailPageNavigation(onBack);

  useEffect(() => {
    if (!validParams) {
      console.error("[DetailPage] itemId or railId is not provided", {
        itemId,
        railId,
      });
    }
  }, [validParams, itemId, railId]);

  const DimLayer = useMemo(() => {
    if (!uiState || !uiState.isDimmed) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-500 z-10" />
    );
  }, [uiState?.isDimmed]);
  if (!validParams) {
    return <div className="text-red-500 p-4">Item not found</div>;
  }

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (error) {
    console.error("[DetailPage] Error:", error);
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!itemData || !itemData.item) {
    console.error("[DetailPage] Item data not found");
    return <div className="text-red-500 p-4">Item not found</div>;
  }

  // Hook olmayan değişken tanımları
  const { item, playButtonRail, similarContentRail, loremIpsum } = itemData;

  return (
    <div
      className="bg-[#0f172a] text-white min-h-screen transition-all duration-500"
      tabIndex="0"
    >
      {/* Arkaplan gradyanı */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/40 to-transparent z-0"></div>
      
      {/* Ana içerik */}
      <div className="relative z-10 px-8 py-10 max-w-7xl mx-auto">
        {/* Karartma katmanı */}
        {DimLayer}

        {/* İçerik bilgileri */}
        <ContentInfo
          item={item}
          loremIpsum={loremIpsum}
          playButtonRail={playButtonRail}
          activeSection={activeSection}
          handleSectionNavigation={handleSectionNavigation}
          handleSectionFocus={handleSectionFocus}
          contentTranslateY={uiState.contentTranslateY}
        />

        {/* Benzer içerikler */}
        <SimilarContent
          similarContentRail={similarContentRail}
          activeSection={activeSection}
          handleSectionNavigation={handleSectionNavigation}
          handleSectionFocus={handleSectionFocus}
          isDimmed={uiState.isDimmed}
        />
      </div>
    </div>
  );
};

export default DetailPage;
