import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Menu component
 */
const Menu = ({
  items,
  activeFocus,
  sectionId,
  setFocus,
  onNavigate,
  onFocus,
}) => {
  const [menuWidth, setMenuWidth] = useState("70px");
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  const [activeContentSection, setActiveContentSection] = useState("home");

  useEffect(() => {
    const currentSection = localStorage.getItem("currentSection");
    if (currentSection) {
      setActiveContentSection(currentSection);
      console.log(`[Menu] Set active content section from localStorage: ${currentSection}`);
    }
  }, []);
  
  useEffect(() => {
    if (activeFocus?.sectionId === "menu") {
      const lastSection = localStorage.getItem("currentSection");
      if (lastSection) {
        setActiveContentSection(lastSection);
        console.log(`[Menu] Updated active content section from localStorage: ${lastSection}`);
      }
    }
  }, [activeFocus]);

  const handleMenuFocus = useCallback((focusInfo) => {
    console.log("[Menu] Menu focus changed", focusInfo);

    if (focusInfo.activeFocus) {
      // Measure the width of the selected menu item
      const railId = focusInfo.activeFocus.railId || "rail-0";
      const railIndex = parseInt(railId.split("-")[1]);
      const itemElement = itemRefs.current[railIndex];

      if (itemElement) {
        // Calculate width based on the content of the selected item
        const textWidth =
          itemElement.querySelector(".menu-item-text")?.offsetWidth || 0;

        // Minimum 200px, maximum content width + padding
        const calculatedWidth = Math.max(200, textWidth + 80);
        setMenuWidth(`${calculatedWidth}px`);
      } else {
        setMenuWidth("200px"); // Varsayılan genişlik
      }
    } else {
      setMenuWidth("70px"); // Focus yoksa daralt
    }
  }, []);

  // Keep useEffect for backward compatibility
  useEffect(() => {
    if (activeFocus && activeFocus.sectionId === sectionId) {
      handleMenuFocus({ sectionId, activeFocus });

      // Call the external onFocus callback
      if (onFocus) {
        onFocus({ sectionId, activeFocus, focused: true });
      }
    } else {
      setMenuWidth("70px");

      // Call callback when menu loses focus
      if (onFocus && activeFocus && activeFocus.sectionId !== sectionId) {
        onFocus({ sectionId, activeFocus, focused: false });
      }
    }
  }, [activeFocus, sectionId, handleMenuFocus, onFocus]);

  // Navigation handler
  const handleNavigation = (action, itemIndex) => {
    if (action === "select") {
      const selectedItem = items[itemIndex];
      console.log(`[Menu] Selected item: ${selectedItem.title}`);
      
      // Get section ID of selected menu item
      const selectedSectionId = selectedItem.sectionId || selectedItem.id;
      
      // Update active content section
      setActiveContentSection(selectedSectionId);
      
      // Save to localStorage
      localStorage.setItem("currentSection", selectedSectionId);
      
      // Custom operations can be done here
      onNavigate("select", sectionId, `item-${itemIndex}`);
    }
  };

  // Separate Settings item and prepare other items
  const renderMenuItems = () => {
    if (!items || items.length === 0) return null;

    // Find Settings item and separate it from other items
    const settingsItem = items.find(
      (item) =>
        item.title.toLowerCase() === "settings" ||
        item.title.toLowerCase() === "ayarlar"
    );

    const regularItems = items.filter(
      (item) =>
        item.title.toLowerCase() !== "settings" &&
        item.title.toLowerCase() !== "ayarlar"
    );

    // First render normal items
    const regularItemsElements = regularItems.map((item, idx) => {
      // Find the index in the original array
      const originalIndex = items.findIndex((i) => i.title === item.title);

      // Menü öğesi odaklanmış mı?
      const isFocused =
        activeFocus &&
        activeFocus.sectionId === sectionId &&
        activeFocus.railId === `rail-0` &&
        activeFocus.itemId === `item-${originalIndex}`;

      // Bu menü öğesine karşılık gelen içerik bölümü aktif mi?
      // Menü öğesinin ID'si veya sectionId'si ile activeContentSection'ı karşılaştır
      const itemSectionId = item.sectionId || item.id || item.title.toLowerCase();
      const isContentActive = activeContentSection === itemSectionId;

      return (
        <div
          key={`menu-item-${originalIndex}`}
          ref={(el) => (itemRefs.current[originalIndex] = el)}
          id={`menu-rail-0-cell${originalIndex}`}
          className={`py-5 px-4 mb-4 rounded-lg cursor-pointer transition-all text-2xl
            ${isContentActive ? "bg-[#222] font-bold" : ""} 
            ${isFocused ? "bg-[#0078D7] text-white font-bold" : ""}`}
          onClick={() => setFocus(sectionId, "rail-0", `item-${originalIndex}`)}
        >
          <div className="flex items-center">
            <span className="mr-3 text-xl">{item.icon || "•"}</span>
            <span className="menu-item-text">{item.title}</span>
            {isContentActive && !isFocused && (
              <span className="ml-auto text-blue-500">•</span>
            )}
          </div>
        </div>
      );
    });

    // Then render Settings item (if exists)
    let settingsElement = null;
    if (settingsItem) {
      const settingsIndex = items.findIndex(
        (i) => i.title === settingsItem.title
      );

      const isFocused =
        activeFocus &&
        activeFocus.sectionId === sectionId &&
        activeFocus.railId === `rail-0` &&
        activeFocus.itemId === `item-${settingsIndex}`;

      // Settings öğesi için section ID'yi al
      const settingsSectionId = settingsItem.sectionId || settingsItem.id || "settings";
      const isContentActive = activeContentSection === settingsSectionId;

      settingsElement = (
        <div
          key={`menu-item-${settingsIndex}`}
          ref={(el) => (itemRefs.current[settingsIndex] = el)}
          id={`menu-rail-0-cell${settingsIndex}`}
          className={`py-5 px-4 mb-4 rounded-lg cursor-pointer transition-all text-2xl mt-auto border-t border-[#333] pt-6
            ${isContentActive ? "bg-[#222] font-bold" : ""} 
            ${isFocused ? "bg-[#0078D7] text-white font-bold" : ""}`}
          onClick={() => setFocus(sectionId, "rail-0", `item-${settingsIndex}`)}
        >
          <div className="flex items-center">
            <span className="mr-3 text-xl">⚙️</span>
            <span className="menu-item-text">{settingsItem.title}</span>
            {isContentActive && !isFocused && (
              <span className="ml-auto text-blue-500">•</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col">{regularItemsElements}</div>
        {settingsElement}
      </>
    );
  };

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 h-full bg-[#111] shadow-lg z-50 overflow-hidden rounded-r-lg flex flex-col"
      style={{
        width: menuWidth,
        transition: "width 0.3s ease",
      }}
    >
      <div className="flex flex-col h-full w-full p-4 justify-between">
        {/* Logo veya uygulama adı */}
        <div className="text-2xl font-bold mb-10 text-white text-center py-4">
          TV
        </div>

        {/* Menü öğeleri */}
        <div className="flex-1 flex flex-col justify-between">
          {renderMenuItems()}
        </div>
      </div>
    </div>
  );
};

export default Menu;
