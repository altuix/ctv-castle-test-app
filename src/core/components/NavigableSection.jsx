import React, { useEffect, useRef, useCallback } from "react";
import { useNavigation } from "../navigation/NavigationContext";
import TVKeyHandler from "../navigation/TVKeyHandler";
import Menu from "../../components/Menu";
import Rail from "./Rail";
import useRailData from "../hooks/useRailData";
import useScrollManagement from "../hooks/useScrollManagement";
import { handleSectionNavigation } from "../utils/navigationUtils";

/**
 * NavigableSection component
 * Creates navigable content sections for TV applications
 */
const NavigableSection = ({
  sectionId,
  rails: initialRails,
  orientation = "horizontal",
  isMenu = false,
  onNavigate,
  fetchRails,
  neighbors = {},
  isActive = false,
  scrollStyle = "default",
  onFocus = null,
}) => {
  const sectionRef = useRef();
  const railContainerRef = useRef();
  const railRefs = useRef({});

  const { activeFocus, setFocus, getLastFocus, getLastSectionFocus } =
    useNavigation();

  const { rails, loading, error } = useRailData(
    fetchRails,
    initialRails,
    sectionId
  );

  // Manage scroll state
  const { transforms, verticalTransform } = useScrollManagement({
    activeFocus,
    sectionId,
    orientation,
    railRefs: railRefs.current,
    railContainerRef: railContainerRef.current,
    scrollStyle,
  });

  // Callback for saving rail references
  const setRailRef = useCallback((index, ref) => {
    railRefs.current[index] = ref;
  }, []);

  // Set initial focus - only for menu
  useEffect(() => {
    // Set initial focus only for menu when there's no active focus yet
    // Önemli: Burada sadece hiç focus yoksa başlangıç odağını ayarlıyoruz
    // AppContent'ten gelen focus değişikliklerini geçersiz kılmamak için
    if (isActive && sectionId === "menu" && !activeFocus) {
      const { railId, itemId } = getLastFocus(sectionId, "rail-0");
      console.log(
        "[NavigableSection] Setting initial focus for menu (only when no focus exists):",
        sectionId,
        {
          railId,
          itemId,
        }
      );
      setFocus(sectionId, railId, itemId);
    }
  }, [isActive, sectionId, setFocus, getLastFocus, activeFocus]);

  // Call onFocus callback when section becomes active
  const prevIsActiveRef = useRef(isActive);
  const isMenuSection = isMenu === true;

  useEffect(() => {
    // If onFocus callback is defined and isActive state has changed, call it
    // Sadece menü ve içerik bölümleri arasındaki geçişlerde onFocus'u çağır
    if (onFocus && prevIsActiveRef.current !== isActive) {
      // Menü bölümü için veya içerik bölümü aktif olduğunda çağır
      if (isMenuSection || isActive) {
        // Call onFocus callback
        onFocus({
          sectionId,
          activeFocus,
          focused: isActive,
          rails,
          orientation,
        });
      }
    }

    // Update reference
    prevIsActiveRef.current = isActive;
  }, [
    isActive,
    sectionId,
    onFocus,
    activeFocus,
    rails,
    orientation,
    isMenuSection,
  ]);

  // Navigation handler
  const handleNavigation = useCallback(
    (action) => {
      // Get navigation operations from navigationUtils
      const result = handleSectionNavigation(action, {
        activeFocus,
        sectionId,
        rails,
        orientation,
        neighbors,
        isMenu,
        getLastFocus,
        getLastSectionFocus,
      });

      if (!result) return;

      // Process based on result type
      switch (result.type) {
        case "focus":
          setFocus(result.sectionId, result.railId, result.itemId);
          break;
        case "changeSection":
          onNavigate(
            "changeSection",
            result.fromSection,
            result.toSection,
            result.railId,
            result.itemId
          );
          break;
        case "select":
          onNavigate(
            "select",
            result.sectionId,
            null,
            result.railId,
            result.itemId
          );
          break;
        case "back":
          if (result.toSection) {
            onNavigate(
              "back",
              result.sectionId,
              result.toSection,
              result.railId,
              result.itemId
            );
          } else {
            onNavigate("back", result.sectionId);
          }
          break;
        default:
          break;
      }
    },
    [
      activeFocus,
      sectionId,
      rails,
      orientation,
      neighbors,
      isMenu,
      getLastFocus,
      getLastSectionFocus,
      setFocus,
      onNavigate,
    ]
  );

  // Check loading and error states
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Separate render function for menu - optimized with React.memo
  const renderMenu = useCallback(() => {
    if (!rails || rails.length === 0) return null;

    // Use only the first rail for menu
    const menuItems = rails[0].items;

    return (
      <Menu
        items={menuItems}
        activeFocus={activeFocus}
        sectionId={sectionId}
        setFocus={setFocus}
        onNavigate={onNavigate}
        onFocus={onFocus}
      />
    );
  }, [rails, activeFocus, sectionId, setFocus, onNavigate, onFocus]);

  // Render function for normal content - optimized with React.memo
  const renderContent = useCallback(() => {
    return (
      <div ref={sectionRef} className="navigable-section">
        <div
          ref={railContainerRef}
          className="rail-container-wrapper"
          style={{
            height: "100%",
            overflow: "visible", // Using visible instead of hidden
            transform: `translateY(${verticalTransform}px)`,
            transition: "transform 0.3s ease",
            paddingBottom: "100px", // Extra space at the bottom
          }}
        >
          {rails.map((rail, index) => (
            <Rail
              key={`rail-${index}`}
              rail={rail}
              index={index}
              sectionId={sectionId}
              orientation={orientation}
              activeFocus={activeFocus}
              setFocus={setFocus}
              transform={transforms[index] || 0}
              onRailRef={(idx, ref) => setRailRef(idx, ref)}
            />
          ))}
        </div>
      </div>
    );
  }, [
    sectionRef,
    railContainerRef,
    rails,
    verticalTransform,
    transforms,
    sectionId,
    orientation,
    activeFocus,
    setFocus,
    setRailRef,
  ]);

  // Memoized render for performance
  return (
    <TVKeyHandler onNavigate={handleNavigation}>
      {isMenu ? renderMenu() : renderContent()}
    </TVKeyHandler>
  );
};

// Wrap component with React.memo to prevent unnecessary renders
export default React.memo(NavigableSection);
