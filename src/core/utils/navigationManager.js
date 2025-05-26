/**
 * Helper functions centralizing navigation logic
 * This module manages all navigation-related operations such as
 * transitions between sections and navigation history management from a single place.
 */

/**
 * Function managing the logic of transitions between sections
 * 
 * @param {Object} params - Transition parameters
 * @param {string} params.currentSection - Current section ID
 * @param {string} params.targetSection - Target section ID
 * @param {Function} params.resetHistory - Function to reset history
 * @param {Function} params.pushToHistory - Function to add to history
 * @param {Function} params.setLastContentSection - Function to update the last content section
 * @returns {void}
 */
export const handleSectionTransition = ({
  currentSection,
  targetSection,
  resetHistory,
  pushToHistory,
  setLastContentSection
}) => {
  // Son içerik bölümünü güncelle
  setLastContentSection(targetSection);
  
  // 1. Menüden bir içerik bölümüne geçiş
  if (currentSection === "menu") {
    console.log(`[NavigationManager] Menu to content: ${targetSection}`);
    
    // Eğer hedef bölüm Home ise, geçmişi sadece Home ile başlat
    if (targetSection === "home") {
      console.log(`[NavigationManager] Setting history to Home only`);
      resetHistory({ view: "section", sectionId: "home", itemId: null, railId: null });
    }
    // Eğer hedef bölüm Movies veya Settings ise
    else {
      // Geçmişi sıfırla ve Home -> targetSection şeklinde ayarla
      console.log(`[NavigationManager] Setting history to Home -> ${targetSection}`);
      resetHistory({ view: "section", sectionId: "home", itemId: null, railId: null });
      pushToHistory("section", targetSection, null, null);
    }
  }
  // 2. İçerik bölümünden menüye, oradan başka bir içerik bölümüne geçiş
  else if (currentSection !== "menu") {
    // Örneğin: Movies -> Menu -> Settings
    console.log(`[NavigationManager] Content to menu to content: ${currentSection} -> menu -> ${targetSection}`);
    
    // Önceki ve hedef bölüm farklıysa
    if (currentSection !== targetSection) {
      // Önceki bölüm Home değilse
      if (currentSection !== "home") {
        // Geçmişi sıfırla ve Home -> önceki bölüm -> hedef bölüm şeklinde ayarla
        console.log(`[NavigationManager] Setting history to Home -> ${currentSection} -> ${targetSection}`);
        
        // Önce geçmişi tamamen temizle
        resetHistory({ view: "section", sectionId: "home", itemId: null, railId: null });
        
        // Sonra önceki bölümü ekle (Movies)
        console.log(`[NavigationManager] Adding ${currentSection} to history`);
        pushToHistory("section", currentSection, null, null);
        
        // Add the latest target section (Settings)
        console.log(`[NavigationManager] Adding ${targetSection} to history`);
        pushToHistory("section", targetSection, null, null);
      }
      // If the previous section is Home
      else {
        // Reset history and set it as Home -> target section
        console.log(`[NavigationManager] Setting history to Home -> ${targetSection}`);
        resetHistory({ view: "section", sectionId: "home", itemId: null, railId: null });
        pushToHistory("section", targetSection, null, null);
      }
    }
    // If previous and target sections are the same, don't change history
    else {
      console.log(`[NavigationManager] Same section selected, not changing history`);
    }
  }
};

/**
 * Helper function standardizing section structure
 * 
 * @param {string} id - Section ID
 * @param {string} title - Section title
 * @param {Array} rails - Section rails
 * @param {boolean} isMenu - Is it a menu section?
 * @param {Function} fetchRails - Function to fetch rail data (optional)
 * @returns {Object} - Standardized section structure
 */
export const createSection = (id, title, rails, isMenu = false, fetchRails = null) => {
  return {
    id,
    title,
    rails,
    isMenu,
    fetchRails
  };
};

/**
 * Helper function creating a new rail
 * 
 * @param {string} title - Rail title
 * @param {string} railType - Rail type (16:9, 1:1, 9:16, 4:3)
 * @param {Array} items - Rail items
 * @returns {Object} - Created rail
 */
export const createRail = (title, railType, items) => {
  return {
    title,
    railType,
    items
  };
};

/**
 * Helper function creating a new rail item
 * 
 * @param {string} title - Item title
 * @param {string} thumbnail - Item thumbnail URL
 * @param {string} description - Item description
 * @param {string} ratio - Item ratio (16:9, 1:1, 9:16, 4:3)
 * @returns {Object} - Created item
 */
export const createRailItem = (title, thumbnail, description, ratio) => {
  return {
    title,
    thumbnail,
    description,
    ratio
  };
};
