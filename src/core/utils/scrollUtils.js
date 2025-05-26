/**
 * Helper functions for scrolling operations
 */

/**
 * Horizontal scrolling function (optimized with transform)
 * @param {HTMLElement} element - Element to scroll
 * @param {number} targetIndex - Target item index
 * @param {number} railIndex - Rail index
 * @param {string} axis - Scrolling axis (left or top)
 * @param {Object} options - Additional options
 * @returns {number} - Calculated translateX value
 */
export const calculateHorizontalScroll = (element, targetIndex, railIndex, axis = "left", options = {}) => {
  if (!element) return 0;

  const {
    menuWidthValue = 70,
    containerPadding = 40,
    safetyMargin = 100,
    extraPadding = 50,
    scrollStyle = "default",
    railsCount = 1
  } = options;
  
  // Visible area calculation - add safety margin and extra padding
  const visibleSize = window.innerWidth - menuWidthValue - containerPadding - safetyMargin - extraPadding;
  
  // Use Array instead of NodeList (for more reliable operations)
  const items = Array.from(element.querySelectorAll(".rail-item"));
  const itemsCount = items.length;

  if (itemsCount === 0) return 0;

  const lastItem = items[itemsCount - 1];
  const firstItem = items[0];

  if (!firstItem || !lastItem) return 0;

  // Item dimensions calculation
  const itemStyle = getComputedStyle(firstItem);
  const itemWidth = parseFloat(itemStyle.width);
  const itemGap = parseFloat(itemStyle.marginRight) || 0; // Gap value
  const itemTotalWidth = itemWidth + itemGap; // Total width of an item (width + gap)

  // Number of visible items and scroll start index
  const visibleItemsCount = Math.floor(visibleSize / itemTotalWidth); // Dynamic number of visible items
  const scrollStartIndex = 2; // Scrolling starts at the 3rd item (index 2)

  // Total content width (no gap for the last item)
  const totalContentWidth = (itemsCount - 1) * itemTotalWidth + itemWidth;
  
  // Maximum scroll limit (for the last item to be fully visible)
  // If content is smaller than visible area, no need to scroll
  const maxTranslate = totalContentWidth <= visibleSize ? 0 : -(totalContentWidth - visibleSize);

  let translateX = 0;

  // When reaching the last item
  if (targetIndex === itemsCount - 1) {
    // Ensure the last item is fully visible
    // Leave extra space (to have space on the right side of the last item)
    translateX = maxTranslate - 20; // Scroll 20px more
    
    // If it's the last rail, leave more space (for the last grid)
    if (railIndex === railsCount - 1) {
      translateX = maxTranslate - 50; // More space for the last grid
    }
  }
  // Stay fixed at the first item
  else if (targetIndex === 0) {
    translateX = 0;
  }
  // For intermediate items
  else if (scrollStyle === "early") {
    // Early mode: 1 item scroll for each step after the 3rd item
    if (targetIndex > scrollStartIndex) {
      const itemsToScroll = targetIndex - scrollStartIndex;
      translateX = -(itemsToScroll * itemTotalWidth);

      // Son birkaç item'a yaklaşırken, son item'ın görünmesini sağla
      if (targetIndex >= itemsCount - visibleItemsCount) {
        // Son item'ın görünür olması için gereken minimum kaydırma değerini hesapla
        translateX = maxTranslate;
      }
    }
  } else {
    // Default mode: Scroll when items go off-screen
    if (targetIndex >= visibleItemsCount - 1) { // -1 added to start scrolling earlier
      const itemsToScroll = targetIndex - (visibleItemsCount - 2); // -2 to scroll from the previous item
      translateX = -(itemsToScroll * itemTotalWidth);

      // Son birkaç item'a yaklaşırken, son item'ın görünmesini sağla
      if (targetIndex >= itemsCount - visibleItemsCount) {
        // Son item'ın görünür olması için gereken minimum kaydırma değerini hesapla
        translateX = maxTranslate;
      }
    }
  }

  // Check boundaries - no need to scroll if content is smaller than visible area
  if (totalContentWidth <= visibleSize) {
    translateX = 0;
  } else {
    // Leave extra space when reaching the last item
    if (targetIndex === itemsCount - 1) {
      // Ensure it doesn't exceed the minimum limit
      translateX = Math.min(0, translateX);
    } else {
      // Apply normal boundaries
      translateX = Math.min(0, Math.max(translateX, maxTranslate));
    }
  }

  return translateX;
};

/**
 * Vertical scrolling calculation function
 * @param {HTMLElement} railContainer - Rail container element
 * @param {number} railIndex - Active rail index
 * @returns {number} - Calculated translateY value
 */
export const calculateVerticalScroll = (railContainer, railIndex) => {
  if (!railContainer) return 0;

  // Find rail containers
  const railElements = Array.from(railContainer.querySelectorAll('.rail-container'));
  
  if (railElements.length === 0) return 0;
  
  // Calculate the exact height and margins of each rail
  const railMeasurements = railElements.map(el => {
    const style = window.getComputedStyle(el);
    const height = el.offsetHeight;
    const marginTop = parseInt(style.marginTop) || 0;
    const marginBottom = parseInt(style.marginBottom) || 0;
    return { height, marginTop, marginBottom, totalHeight: height + marginTop + marginBottom };
  });
  
  // Standard rail height (including margins)
  const standardRailHeight = railMeasurements[0].totalHeight;
  
  // Viewport height (exact calculation)
  const viewportHeight = window.innerHeight - 40; // Window height - padding
  
  // Total content height (including margins)
  const totalContentHeight = railMeasurements.reduce((sum, m) => sum + m.totalHeight, 0);
  
  // Calculate the top position of each rail (including margins)
  const railPositions = [];
  let currentPosition = 0;
  
  for (const measurement of railMeasurements) {
    railPositions.push(currentPosition);
    currentPosition += measurement.totalHeight;
  }
  
  // Calculate the scroll amount
  let translateY = 0;
  
  // No scrolling for the first rail
  if (railIndex === 0) {
    translateY = 0;
  }
  // For the last rail, ensure the last rail is fully visible
  else if (railIndex === railElements.length - 1) {
    // Minimum scrolling required for the last rail to be fully visible
    translateY = -(totalContentHeight - viewportHeight);
  }
  // For other rails, scroll according to the position of the selected rail
  else {
    // Position of the selected rail
    const railPosition = railPositions[railIndex];
    const railHeight = railMeasurements[railIndex].totalHeight;
    
    // Center the selected rail in the viewport
    translateY = -(railPosition - (viewportHeight / 2 - railHeight / 2));
    
    // Deviation correction: Exact position for each grid
    const correctionFactor = railIndex * 2; // Increase deviation amount based on index
    translateY -= correctionFactor;
    
    // When approaching the last rail, ensure the last rail is fully visible
    if (railIndex >= railElements.length - 3) {
      // Target scroll value for the last rail
      const lastRailTranslateY = -(totalContentHeight - viewportHeight);
      
      // Gradually transition to the position of the last rail as approaching the last 3 rails
      const transitionRatio = (railIndex - (railElements.length - 4)) / 3;
      translateY = translateY * (1 - transitionRatio) + lastRailTranslateY * transitionRatio;
    }
  }
  
  // Minimum and maximum limits
  const maxTranslate = -(totalContentHeight - viewportHeight);
  translateY = Math.min(0, Math.max(translateY, maxTranslate));
  
  return translateY;
};
