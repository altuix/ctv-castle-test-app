// src/core/hooks/useDetailPageData.js
import { useState, useEffect } from 'react';
import { mockData } from '../../data/mockData';

/**
 * Data management hook for detail page
 * @param {string} railId - Rail ID
 * @param {string} itemId - Content ID
 * @returns {Object} - Content data and state
 */
const useDetailPageData = (railId, itemId) => {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!railId || !itemId) {
      setError("railId or itemId not provided");
      setLoading(false);
      return;
    }

    try {
      // Find the correct item from railId and itemId
      const railIndex = parseInt(railId.split("-")[1]);
      const itemIndex = parseInt(itemId.split("-")[1]);
      
      // Determine which section data to use based on the current view
      let sectionData;
      let currentSection = localStorage.getItem('currentSection') || 'home';
      
      console.log(`[useDetailPageData] Getting data for section: ${currentSection}, railId: ${railId}, itemId: ${itemId}`);
      
      // Get the correct data set from mockData based on current section
      switch (currentSection) {
        case 'home':
          sectionData = mockData.homeRails;
          break;
        case 'movies':
          sectionData = mockData.moviesRails;
          break;
        case 'series':
          sectionData = mockData.seriesRails || [];
          break;
        default:
          sectionData = mockData.homeRails;
      }
      
      const rail = sectionData[railIndex];
      
      if (!rail) {
        console.error(`[useDetailPageData] Rail not found for section: ${currentSection}, railId: ${railId}`);
        setError(`Rail not found for railId: ${railId}`);
        setLoading(false);
        return;
      }
      
      const item = rail.items[itemIndex];

      if (!item) {
        setError(`Item not found for itemId: ${itemId}`);
        setLoading(false);
        return;
      }

      // Rail for play button
      const playButtonRail = {
        title: "Oynat",
        items: [{ 
          title: "Oynat", 
          thumbnail: "",
          ratio: "16:9",
          isButton: true
        }]
      };

      // Rail for similar content
      const similarContentRail = {
        title: "Similar Content",
        items: mockData.similarContent || []
      };

      // Lorem ipsum metni
      const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

      setItemData({
        item,
        playButtonRail,
        similarContentRail,
        loremIpsum
      });
      
      setLoading(false);
    } catch (err) {
      console.error("[useDetailPageData] Error occurred while fetching data:", err);
      setError("An error occurred while processing data");
      setLoading(false);
    }
  }, [railId, itemId]);

  return { itemData, loading, error };
};

export default useDetailPageData;
