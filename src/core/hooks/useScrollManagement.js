import { useState, useEffect } from 'react';
import { calculateHorizontalScroll, calculateVerticalScroll } from '../utils/scrollUtils';

/**
 * Custom hook for managing scrolling operations
 * 
 * @param {Object} params - Hook parametreleri
 * @param {Object} params.activeFocus - Aktif odak bilgisi
 * @param {string} params.sectionId - Section ID
 * @param {string} params.orientation - Orientation (horizontal or vertical)
 * @param {Array} params.railRefs - Rail references
 * @param {HTMLElement} params.railContainerRef - Rail container reference
 * @param {string} params.scrollStyle - Scroll style (early or default)
 * @returns {Object} - Scroll state {transforms, verticalTransform}
 */
const useScrollManagement = ({
  activeFocus,
  sectionId,
  orientation,
  railRefs,
  railContainerRef,
  scrollStyle = "default"
}) => {
  const [transforms, setTransforms] = useState({});
  const [verticalTransform, setVerticalTransform] = useState(0);

  // Horizontal scrolling logic
  useEffect(() => {
    if (activeFocus && activeFocus.sectionId === sectionId) {
      const { railId, itemId } = activeFocus;
      const railIndex = parseInt(railId.split("-")[1]);
      const itemIndex = parseInt(itemId.split("-")[1]);
      const railElement = railRefs[railIndex];

      if (railElement) {
        if (orientation === "horizontal") {
          const translateX = calculateHorizontalScroll(
            railElement, 
            itemIndex, 
            railIndex, 
            "left", 
            {
              scrollStyle,
              railsCount: railRefs.length
            }
          );
          
          setTransforms((prev) => ({
            ...prev,
            [railIndex]: translateX,
          }));
        }
      }
    }
  }, [activeFocus, sectionId, orientation, railRefs, scrollStyle]);

  // Vertical scrolling logic
  useEffect(() => {
    if (
      activeFocus &&
      activeFocus.sectionId === sectionId &&
      orientation === "horizontal" &&
      railContainerRef
    ) {
      const { railId } = activeFocus;
      const railIndex = parseInt(railId.split("-")[1]);
      
      const translateY = calculateVerticalScroll(railContainerRef, railIndex);
      setVerticalTransform(translateY);
    }
  }, [activeFocus, sectionId, orientation, railContainerRef]);

  return { transforms, verticalTransform };
};

export default useScrollManagement;
