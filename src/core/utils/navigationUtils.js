/**
 * Helper functions for navigation operations
 */

/**
 * Manages navigation operations
 * @param {string} action - Navigation action (up, down, left, right, enter, back)
 * @param {Object} params - Navigation parameters
 * @returns {Object|null} - Navigation result or null
 */
export const handleSectionNavigation = (action, params) => {
  const {
    activeFocus,
    sectionId,
    rails,
    orientation,
    neighbors,
    getLastFocus,
    getLastSectionFocus,
    onNavigate
  } = params;

  if (!activeFocus || activeFocus.sectionId !== sectionId) {
    console.log(
      "[NavigationUtils] Focus not on this section, ignoring action:",
      action
    );
    return null;
  }

  const { railId, itemId } = activeFocus;
  const currentRailIndex = parseInt(railId.split("-")[1]);
  const currentItemIndex = parseInt(itemId.split("-")[1]);
  const currentRail = rails[currentRailIndex];
  let nextRailId = railId;
  let nextItemId = itemId;

  // Navigation between items
  if (action === "right" && orientation === "horizontal") {
    const nextItemIndex = currentItemIndex + 1;
    if (nextItemIndex < currentRail.items.length) {
      nextItemId = `item-${nextItemIndex}`;
      console.log("[NavigationUtils] Moving right to item:", nextItemId);
      return { type: "focus", sectionId, railId, itemId: nextItemId };
    } else {
      console.log(
        "[NavigationUtils] Reached last item in rail, staying at last item"
      );
      return null;
    }
  } else if (action === "left" && orientation === "horizontal") {
    const prevItemIndex = currentItemIndex - 1;
    if (prevItemIndex >= 0) {
      nextItemId = `item-${prevItemIndex}`;
      console.log("[NavigationUtils] Moving left to item:", nextItemId);
      return { type: "focus", sectionId, railId, itemId: nextItemId };
    }
  } else if (action === "down" && orientation === "vertical") {
    const nextItemIndex = currentItemIndex + 1;
    if (nextItemIndex < currentRail.items.length) {
      nextItemId = `item-${nextItemIndex}`;
      console.log("[NavigationUtils] Moving down to item:", nextItemId);
      return { type: "focus", sectionId, railId, itemId: nextItemId };
    }
  } else if (action === "up" && orientation === "vertical") {
    const prevItemIndex = currentItemIndex - 1;
    if (prevItemIndex >= 0) {
      nextItemId = `item-${prevItemIndex}`;
      console.log("[NavigationUtils] Moving up to item:", nextItemId);
      return { type: "focus", sectionId, railId, itemId: nextItemId };
    }
  }

  // Rail'ler arası navigasyon (içerikte yukarı/aşağı)
  if (action === "down" && orientation === "horizontal") {
    const nextRailIndex = currentRailIndex + 1;
    if (nextRailIndex < rails.length) {
      nextRailId = `rail-${nextRailIndex}`;
      const lastFocus = getLastFocus(sectionId, nextRailId);
      nextItemId = lastFocus.itemId || "item-0";
      console.log(
        "[NavigationUtils] Moving down to rail:",
        nextRailId,
        "with item:",
        nextItemId
      );
      return { type: "focus", sectionId, railId: nextRailId, itemId: nextItemId };
    }
  } else if (action === "up" && orientation === "horizontal") {
    const prevRailIndex = currentRailIndex - 1;
    if (prevRailIndex >= 0) {
      nextRailId = `rail-${prevRailIndex}`;
      const lastFocus = getLastFocus(sectionId, nextRailId);
      nextItemId = lastFocus.itemId || "item-0";
      console.log(
        "[NavigationUtils] Moving up to rail:",
        nextRailId,
        "with item:",
        nextItemId
      );
      return { type: "focus", sectionId, railId: nextRailId, itemId: nextItemId };
    }
  }

  // Navigation between sections
  if (
    action === "right" &&
    neighbors.right &&
    (orientation === "vertical" ||
      currentItemIndex === currentRail.items.length - 1)
  ) {
    console.log(
      "[NavigationUtils] Switching to right section:",
      neighbors.right
    );
    const { railId: lastRailId, itemId: lastItemId } = getLastSectionFocus(
      neighbors.right
    );
    return {
      type: "changeSection",
      fromSection: sectionId,
      toSection: neighbors.right,
      railId: lastRailId,
      itemId: lastItemId
    };
  } else if (
    action === "left" &&
    neighbors.left &&
    (orientation === "vertical" || currentItemIndex === 0)
  ) {
    console.log(
      "[NavigationUtils] Switching to left section:",
      neighbors.left
    );
    const { railId: lastRailId, itemId: lastItemId } = getLastSectionFocus(
      neighbors.left
    );
    return {
      type: "changeSection",
      fromSection: sectionId,
      toSection: neighbors.left,
      railId: lastRailId,
      itemId: lastItemId
    };
  } else if (
    action === "down" &&
    neighbors.down &&
    (orientation === "horizontal" ||
      currentItemIndex === currentRail.items.length - 1)
  ) {
    console.log(
      "[NavigationUtils] Switching to down section:",
      neighbors.down
    );
    const { railId: lastRailId, itemId: lastItemId } = getLastSectionFocus(
      neighbors.down
    );
    return {
      type: "changeSection",
      fromSection: sectionId,
      toSection: neighbors.down,
      railId: lastRailId,
      itemId: lastItemId
    };
  } else if (
    action === "up" &&
    neighbors.up &&
    (orientation === "horizontal" || currentItemIndex === 0)
  ) {
    console.log(
      "[NavigationUtils] Switching to up section:",
      neighbors.up
    );
    const { railId: lastRailId, itemId: lastItemId } = getLastSectionFocus(
      neighbors.up
    );
    return {
      type: "changeSection",
      fromSection: sectionId,
      toSection: neighbors.up,
      railId: lastRailId,
      itemId: lastItemId
    };
  }

  // Diğer eylemler
  if (action === "enter") {
    console.log("[NavigationUtils] Selecting item:", activeFocus.railId, activeFocus.itemId);
    return {
      type: "select",
      sectionId,
      railId: activeFocus.railId,
      itemId: activeFocus.itemId
    };
  } else if (action === "back") {
    if (params.isMenu) {
      console.log("[NavigationUtils] Going back from menu");
      return { type: "back", sectionId };
    } else {
      // Grid içindeyken backspace'e basıldığında menüye dön
      console.log("[NavigationUtils] Going back from content section to menu");
      return {
        type: "back",
        sectionId,
        toSection: "menu",
        railId: activeFocus.railId,
        itemId: activeFocus.itemId
      };
    }
  }

  return null;
};
