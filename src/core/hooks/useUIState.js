import { useState, useCallback } from 'react';

/**
 * Custom hook for managing UI state
 * 
 * @param {Object} initialState - Initial UI state
 * @returns {Object} - UI state and management functions
 */
const useUIState = (initialState = {
  menuExpanded: false,
  contentDimmed: false,
  contentMargin: 50
}) => {
  const [uiState, setUiState] = useState(initialState);

  /**
   * Manages menu focus state
   * @param {Object} focusInfo - Focus information
   */
  const handleMenuFocus = useCallback((focusInfo) => {
    if (focusInfo.focused) {
      // When menu is focused
      setUiState(prev => ({
        ...prev,
        menuExpanded: true,
        contentDimmed: true,
        contentMargin: 200 // Shift content to the right when menu expands
      }));
    } else {
      // When menu is not focused
      setUiState(prev => ({
        ...prev,
        menuExpanded: false,
        contentDimmed: false,
        contentMargin: 50 // Return content to normal when menu is collapsed
      }));
    }
  }, []);
  
  /**
   * Manages content focus state
   * @param {Object} focusInfo - Focus information
   */
  const handleContentFocus = useCallback((focusInfo) => {
    if (focusInfo.focused) {
      // When content section is focused
      setUiState(prev => ({
        ...prev,
        menuExpanded: false,
        contentDimmed: false,
        contentMargin: 50 // Return content to normal when menu is collapsed
      }));
    }
  }, []);

  /**
   * Directly updates UI state
   * @param {Object} newState - New UI state
   */
  const updateUIState = useCallback((newState) => {
    setUiState(prev => ({ ...prev, ...newState }));
  }, []);

  return {
    uiState,
    handleMenuFocus,
    handleContentFocus,
    updateUIState
  };
};

export default useUIState;
