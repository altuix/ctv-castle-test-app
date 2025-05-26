import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '../navigation/NavigationContext';

/**
 * Custom hook for managing navigation history
 * 
 * @param {Object} initialState - Initial state
 * @returns {Object} - History state and management functions
 */
const useNavigationHistory = (initialState = { view: "section", sectionId: "home", itemId: null }) => {
  // Get navigation context
  const navigation = useNavigation();
  
  // States for navigation status and history
  const [history, setHistory] = useState([initialState]);
  const [currentView, setCurrentView] = useState(initialState.view);
  const [viewState, setViewState] = useState({
    sectionId: initialState.sectionId,
    itemId: initialState.itemId,
    railId: null
  });
  
  // Debug için geçmiş değişikliklerini izle
  useEffect(() => {
    console.log("[useNavigationHistory] History updated:", history);
  }, [history]);
  
  // Focus yönetimi için referanslar
  const initialFocusRef = useRef(false);
  const lastFocusedSectionRef = useRef(null);
  
  // ViewState değiştiğinde focus'u ayarla
  useEffect(() => {
    if (currentView === 'section' && viewState.sectionId && navigation && navigation.setFocus) {
      if (lastFocusedSectionRef.current !== viewState.sectionId || initialFocusRef.current === false) {
        lastFocusedSectionRef.current = viewState.sectionId;
        
        const timer = setTimeout(() => {
          console.log('[useNavigationHistory] Setting focus after state change:', viewState.sectionId);
          navigation.setFocus(viewState.sectionId, 'rail-0', 'item-0');
          initialFocusRef.current = true;
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentView, viewState.sectionId, navigation]);

  /**
   * Geçmişi tamamen sıfırlar ve yeni bir geçmiş başlatır
   * @param {Object} newState - Yeni başlangıç durumu
   */
  const resetHistory = useCallback((newState) => {
    console.log("[useNavigationHistory] Resetting history with:", newState);
    setHistory([newState]);
  }, []);

  /**
   * Geçmişe yeni bir durum ekler
   * @param {string} view - Görünüm tipi (section, detail)
   * @param {string} sectionId - Bölüm ID
   * @param {string} itemId - Öğe ID
   * @param {string} railId - Rail ID (opsiyonel)
   */
  const pushToHistory = useCallback((view, sectionId, itemId, railId = null) => {
    // Yeni durumu oluştur
    const newState = { view, sectionId, itemId, railId };
    
    // Geçmişe ekle
    setHistory((prev) => [...prev, newState]);
    console.log("[useNavigationHistory] Added to history:", newState);
  }, []);

  /**
   * Geçmişten son durumu kaldırır ve önceki duruma döner
   * @returns {Object|null} - Önceki durum veya null
   */
  const popFromHistory = useCallback(() => {
    console.log("[useNavigationHistory] Current history:", history);
    
    // Geçmişte en az 2 durum olmalı
    if (history.length <= 1) {
      console.log("[useNavigationHistory] No previous state to return to, staying at initial state");
      return null;
    }
    
    // Son durumu kaldır ve önceki duruma dön
    const newHistory = [...history];
    const removedState = newHistory.pop();
    const previousState = newHistory[newHistory.length - 1];
    
    console.log("[useNavigationHistory] Removed state:", removedState);
    console.log("[useNavigationHistory] Returning to state:", previousState);
    
    // Geçmişi ve durumu güncelle
    setHistory(newHistory);
    setCurrentView(previousState.view);
    setViewState({
      sectionId: previousState.sectionId,
      itemId: previousState.itemId,
      railId: previousState.railId
    });
    
    // Focus'u ayarla
    if (previousState.view === 'section' && previousState.sectionId && navigation && navigation.setFocus) {
      lastFocusedSectionRef.current = previousState.sectionId;
      
      const focusTimer = setTimeout(() => {
        console.log('[useNavigationHistory] Setting focus after history pop:', previousState.sectionId);
        navigation.setFocus(previousState.sectionId, 'rail-0', 'item-0');
      }, 100);
    }
    
    console.log("[useNavigationHistory] Returned to previous state:", previousState);
    return previousState;
  }, [history, navigation]);

  /**
   * Görünüm ve durum bilgisini günceller
   * @param {string} view - Görünüm tipi
   * @param {Object} state - Durum nesnesi
   */
  const updateViewState = useCallback((view, state) => {
    setCurrentView(view);
    setViewState(prev => ({ ...prev, ...state }));
  }, []);

  return {
    history,
    currentView,
    viewState,
    resetHistory,
    pushToHistory,
    popFromHistory,
    updateViewState
  };
};

export default useNavigationHistory;
