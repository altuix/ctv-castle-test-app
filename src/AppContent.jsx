import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigation } from "./core/navigation/NavigationContext";
import NavigableSection from "./core/components/NavigableSection";
import DetailPage from "./components/DetailPage";
import SettingsPage from "./components/SettingsPage";
import { mockData } from "./data/mockData";

import useNavigationHistory from "./core/hooks/useNavigationHistory";
import useUIState from "./core/hooks/useUIState";

import {
  handleSectionTransition,
  createSection,
} from "./core/utils/navigationManager";

/**
 * Main application content component
 */
export default function AppContent() {
  const navigation = useNavigation();

  const {
    currentView,
    viewState,
    resetHistory,
    pushToHistory,
    popFromHistory,
    updateViewState,
  } = useNavigationHistory({
    view: "section",
    sectionId: "home",
    itemId: null,
  });

  const setViewState = useCallback(
    (newState) => {
      if (typeof newState === "function") {
        updateViewState(currentView, newState(viewState));
      } else {
        updateViewState(currentView, newState);
      }
    },
    [currentView, viewState, updateViewState]
  );

  const [activeSection, setActiveSection] = useState("menu");

  const [lastGridPositions, setLastGridPositions] = useState({
    home: { railId: "rail-0", itemId: "item-0" },
    movies: { railId: "rail-0", itemId: "item-0" },
    settings: { railId: "rail-0", itemId: "item-0" },
  });

  const [lastContentSection, setLastContentSection] = useState("home");

  const { uiState, handleMenuFocus, handleContentFocus } = useUIState();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[AppContent] Application initialized with activeSection:",
        activeSection
      );
    }
  }, []);

  const sections = useMemo(
    () => ({
      menu: createSection(
        "menu",
        "Menu",
        [
          {
            title: "Menu",
            railType: "16:9",
            items: mockData.menu,
          },
        ],
        true
      ),
      home: createSection("home", "Home", mockData.homeRails, false),
      movies: createSection("movies", "Movies", mockData.moviesRails, false),
      settings: createSection(
        "settings",
        "Settings",
        [
          {
            title: "Settings",
            railType: "16:9",
            items: [
              { title: "Subscription", thumbnail: "" },
              { title: "Account", thumbnail: "" },
              { title: "Preferences", thumbnail: "" },
            ],
          },
        ],
        false
      ),
    }),
    []
  );

  /**
   * Manages navigation between sections
   */
  const handleSectionNavigation = useCallback(
    (action, fromSectionId, toSectionId, railId, itemId) => {
      try {
        console.log("[AppContent] Handling navigation:", {
          action,
          fromSectionId,
          toSectionId,
          railId,
          itemId,
        });

        if (fromSectionId && fromSectionId !== "menu") {
          localStorage.setItem("currentSection", fromSectionId);
          console.log(
            `[AppContent] Saved current section to localStorage: ${fromSectionId}`
          );
        }

        if (
          action === "changeSection" &&
          fromSectionId === "menu" &&
          toSectionId !== "menu"
        ) {
          const targetSection = toSectionId;
          console.log("[AppContent] Going to content section:", targetSection);

          const lastPosition = lastGridPositions[targetSection] || {
            railId: "rail-0",
            itemId: "item-0",
          };
          console.log(
            "[AppContent] Last position in that section:",
            lastPosition
          );

          setViewState({ sectionId: targetSection });
          setActiveSection(targetSection);
          setLastContentSection(targetSection);

          if (targetSection !== lastContentSection) {
            console.log("[AppContent] Adding to history:", targetSection);
            pushToHistory("section", targetSection, null, null);
          }

          if (navigation && navigation.setFocus) {
            setTimeout(() => {
              navigation.setFocus(
                targetSection,
                lastPosition.railId,
                lastPosition.itemId
              );
              console.log(
                "[AppContent] Focus set to:",
                targetSection,
                lastPosition.railId,
                lastPosition.itemId
              );
            }, 50);
          }

          return;
        }

        if (
          action === "changeSection" &&
          fromSectionId !== "menu" &&
          toSectionId === "menu"
        ) {
          if (navigation && navigation.activeFocus) {
            const currentFocus = navigation.activeFocus;
            console.log(
              "[AppContent] Saving current position before going to menu:",
              {
                sectionId: fromSectionId,
                railId: currentFocus.railId,
                itemId: currentFocus.itemId,
              }
            );
            setLastGridPositions((prev) => ({
              ...prev,
              [fromSectionId]: {
                railId: currentFocus.railId,
                itemId: currentFocus.itemId,
              },
            }));
          } else {
            console.log("[AppContent] No active focus, using default position");
          }

          // Save last content section
          setLastContentSection(fromSectionId);

          // Switch to menu
          setActiveSection("menu");

          // Set focus to menu - preserve the item index when returning to menu
          if (navigation && navigation.setFocus) {
            // Important: itemId parameter contains the correct index for menu
            // This parameter comes from navigationUtils.js and indicates which menu item to go to
            // For example, when we go from search menu to content and back, we should return to search

            setTimeout(() => {
              // Focus directly on the correct menu item using the incoming itemId
              navigation.setFocus("menu", "rail-0", itemId);
            }, 50);
          }
          return;
        }

        // When an item is selected from the menu
        if (action === "select" && fromSectionId === "menu") {
          // Extract index from itemId (like item-0, item-1)
          const itemIndex = parseInt(itemId.split("-")[1]);

          // Determine target section
          let targetSection;

          // Process menu selection
          switch (itemIndex) {
            case 0:
              targetSection = "home";
              break;
            case 1:
              targetSection = "movies";
              break;
            case 2:
              targetSection = "settings";
              break;
            default:
              targetSection = "home";
          }

          if (sections[targetSection]) {
            // Log menu selection
            console.log(
              `[AppContent] Menu selection: ${targetSection} (current: ${viewState.sectionId})`
            );

            // NAVIGATION LOGIC
            // Save target section information to localStorage when transitioning from menu to a section
            localStorage.setItem("currentSection", targetSection);
            console.log(
              `[AppContent] Saved target section to localStorage: ${targetSection}`
            );

            // Use central navigation management function
            handleSectionTransition({
              currentSection: viewState.sectionId,
              targetSection,
              resetHistory,
              pushToHistory,
              setLastContentSection,
            });

            // Update ViewState and activeSection
            setViewState({ sectionId: targetSection });
            setActiveSection(targetSection);

            // Set focus
            if (navigation && navigation.setFocus) {
              setTimeout(() => {
                navigation.setFocus(targetSection, "rail-0", "item-0");
              }, 50);
            }
          }
          return;
        }

        // When an item is selected from a content section
        if (action === "select" && fromSectionId !== "menu") {
          if (!railId || !itemId) {
            console.error(
              "[AppContent] railId or itemId is not provided for detail view",
              railId,
              itemId
            );
            return;
          }

          // Save current section information to localStorage before transitioning to detail page
          localStorage.setItem("currentSection", fromSectionId);
          console.log(
            `[AppContent] Saved section before detail page: ${fromSectionId}, railId: ${railId}, itemId: ${itemId}`
          );

          pushToHistory(currentView, viewState.sectionId, viewState.itemId);
          updateViewState("detail", { railId, itemId });
          return;
        }

        // Return from detail view
        if (action === "back" && currentView === "detail") {
          try {
            // Get previous state from history
            const previousState = popFromHistory();

            // If there is a previous state and it's in section view
            if (previousState && previousState.view === "section") {
              console.log(
                "[AppContent] Returning from detail view to section:",
                previousState.sectionId
              );

              // Set active section
              setActiveSection(previousState.sectionId);
            }

            return;
          } catch (error) {
            console.error(
              "[AppContent] Error returning from detail view:",
              error
            );
            popFromHistory(); // Try to return even in case of error
            return;
          }
        }

        // Return to menu when back button is pressed from content section
        if (action === "back" && fromSectionId !== "menu") {
          // Save last content section
          setLastContentSection(fromSectionId);

          // Return to menu
          setActiveSection("menu");
          
          // Save last content section to localStorage
          localStorage.setItem("currentSection", fromSectionId);
          console.log(`[AppContent] Saved last content section to localStorage: ${fromSectionId}`);

          // Set focus to menu
          if (navigation && navigation.setFocus) {
            // Find the menu item corresponding to the last content section
            const menuIndex = mockData.menu.findIndex(item => 
              (item.sectionId === fromSectionId) || (item.id === fromSectionId));
            
            // If a corresponding menu item is found, focus on that item
            if (menuIndex !== -1) {
              navigation.setFocus("menu", "rail-0", `item-${menuIndex}`);
            } else {
              navigation.setFocus("menu", "rail-0", "item-0");
            }
          }
          return;
        }
      } catch (error) {
        console.error("[AppContent] Error in handleSectionNavigation:", error);
      }
    },
    [
      currentView,
      viewState,
      sections,
      pushToHistory,
      popFromHistory,
      updateViewState,
      setViewState,
      setActiveSection,
      setLastGridPositions,
      setLastContentSection,
      navigation,
    ]
  );

  /**
   * Renders the menu component
   */
  const renderMenu = useCallback(
    () => (
      <NavigableSection
        sectionId="menu"
        rails={sections.menu.rails}
        orientation="vertical"
        isMenu={sections.menu.isMenu}
        onNavigate={handleSectionNavigation}
        fetchRails={sections.menu.fetchRails}
        isActive={activeSection === "menu"}
        neighbors={{ right: viewState.sectionId }}
        onFocus={handleMenuFocus}
      />
    ),
    [
      sections.menu,
      activeSection,
      viewState.sectionId,
      handleSectionNavigation,
      handleMenuFocus,
    ]
  );

  /**
   * Renders the content component
   */
  /**
   * Effect that tracks section changes
   * Updates activeSection when viewState.sectionId changes
   */
  useEffect(() => {
    const currentSection = viewState.sectionId;
    if (activeSection !== currentSection) {
      console.log(
        `[AppContent] Updating active section from ${activeSection} to ${currentSection}`
      );
      setActiveSection(currentSection);
    }
  }, [viewState.sectionId, activeSection]);

  /**
   * Renders the content section based on current viewState
   */
  const renderContent = useCallback(() => {
    // Get current section
    const currentSection = viewState.sectionId;
    const sectionData = sections[currentSection];

    if (!sectionData) {
      console.error(
        `[AppContent] Section data not found for: ${currentSection}`
      );
      return null;
    }

    return (
      <div
        className="flex-1"
        style={{
          marginLeft: `${uiState.contentMargin}px`,
          transition: "all 0.3s ease",
          opacity: uiState.contentDimmed ? 0.7 : 1,
          filter: uiState.contentDimmed ? "brightness(0.8)" : "brightness(1)",
        }}
      >
        {/* Section title - only show for Movies and Settings */}
        {(currentSection === "movies" || currentSection === "settings") && (
          <h1
            style={{
              fontSize: "28px",
              margin: "20px 0",
              padding: "0 20px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {currentSection === "movies" ? "Movies" : "Settings"}
          </h1>
        )}

        {/* Important: Adding key for re-rendering when section changes */}
        <NavigableSection
          key={`section-${currentSection}`}
          sectionId={currentSection}
          rails={sectionData.rails || []}
          orientation="horizontal"
          isMenu={sectionData.isMenu || false}
          onNavigate={handleSectionNavigation}
          fetchRails={sectionData.fetchRails || null}
          isActive={true}
          neighbors={{ left: "menu" }}
          scrollStyle="early"
          onFocus={handleContentFocus}
        />
      </div>
    );
  }, [
    uiState,
    viewState.sectionId,
    sections,
    handleSectionNavigation,
    handleContentFocus,
  ]);

  /**
   * Renders the detail page
   */
  const renderDetailPage = useCallback(
    () => (
      <DetailPage
        itemId={viewState.itemId}
        railId={viewState.railId}
        onBack={popFromHistory}
      />
    ),
    [viewState.itemId, viewState.railId, popFromHistory]
  );

  /**
   * Renders the settings page
   */
  const renderSettingsPage = useCallback(
    () => <SettingsPage onBack={popFromHistory} />,
    [popFromHistory]
  );

  // Main render function
  return (
    <div
      className="app-content"
      style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}
    >
      {currentView === "section" && viewState.sectionId !== "settings" && (
        <div
          className="flex"
          style={{ position: "relative", overflow: "hidden" }}
        >
          {renderMenu()}
          {renderContent()}
        </div>
      )}
      {currentView === "section" && viewState.sectionId === "settings" && (
        <div style={{ position: "relative", overflow: "hidden" }}>
          {renderSettingsPage()}
        </div>
      )}
      {currentView === "detail" &&
        viewState.itemId &&
        viewState.railId &&
        renderDetailPage()}
    </div>
  );
}
