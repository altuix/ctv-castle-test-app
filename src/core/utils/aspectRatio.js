/**
 * Height calculation functions for different aspect ratios
 */

/**
 * Height calculation function based on ratio
 * @param {string} ratio - Aspect ratio (16:9, 9:16, 1:1, 4:3, 21:9)
 * @returns {string} - Calculated height value (px)
 */
export const getRatioHeight = (ratio) => {
  switch(ratio) {
    case "16:9": return "168px";
    case "9:16": return "320px";
    case "1:1": return "250px";
    case "4:3": return "225px";
    case "21:9": return "128px";
    default: return "168px"; // Default 16:9
  }
};

/**
 * Width calculation function based on ratio
 * @param {string} ratio - Aspect ratio (16:9, 9:16, 1:1, 4:3, 21:9)
 * @returns {string} - Calculated width value (px)
 */
export const getRatioWidth = (ratio) => {
  switch(ratio) {
    case "16:9": return "300px";
    case "9:16": return "180px";
    case "1:1": return "250px";
    case "4:3": return "300px";
    case "21:9": return "380px";
    default: return "300px"; // Default 16:9
  }
};
