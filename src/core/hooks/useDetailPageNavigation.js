// src/core/hooks/useDetailPageNavigation.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigation } from '../navigation/NavigationContext';

/**
 * Navigation management hook for detail page
 * @param {Function} onBack - Back navigation function
 * @returns {Object} - Navigation state and functions
 */
const useDetailPageNavigation = (onBack) => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState('play-button');
  const [uiState, setUiState] = useState({
    isDimmed: false,
    contentTranslateY: 0
  });

  // Return with Backspace key
  const handleKeyDown = useCallback((event) => {
    if (event.keyCode === 8) { // Backspace
      console.log("[DetailPage] Backspace detected, triggering onBack");
      onBack();
    }
  }, [onBack]);

  // Klavye olaylarını dinle
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Sayfa yüklenince oynat butonuna focus sağla - sadece bir kez çalışması için useRef kullan
  const initialFocusRef = useRef(false);
  
  useEffect(() => {
    // Sadece ilk render'da çalışsın
    if (initialFocusRef.current === false) {
      console.log("[DetailPage] Setting initial focus to play button");
      setActiveSection('play-button');
      
      // 100ms gecikme ile focus'u ayarla (component render olduktan sonra)
      const timer = setTimeout(() => {
        if (navigation && navigation.setFocus) {
          navigation.setFocus('play-button', 'rail-0', 'item-0');
          initialFocusRef.current = true;
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [navigation]);

  // Bölüm focus olduğunda çağrılacak callback
  const handleSectionFocus = useCallback((focusInfo) => {
    console.log("[DetailPage] Section focus changed:", focusInfo.sectionId, "focused:", focusInfo.focused);
    
    // Benzer içerikler bölümü için focus/unfocus durumlarını ayırt et
    if (focusInfo.sectionId === 'similar-content' && focusInfo.focused) {
      // Benzer içerikler gridi focus olduğunda
      console.log("[DetailPage] Similar content section focused, applying animation");
      setUiState({
        isDimmed: true,
        contentTranslateY: -100 // 100px yukarı kaydır
      });
    } 
    // Play button bölümü focus olduğunda veya similar-content unfocus olduğunda
    else if (focusInfo.sectionId === 'play-button' && focusInfo.focused || 
             focusInfo.sectionId === 'similar-content' && !focusInfo.focused) {
      // Diğer bölümler focus olduğunda veya benzer içerikler unfocus olduğunda
      console.log("[DetailPage] Resetting UI state to normal");
      setUiState({
        isDimmed: false,
        contentTranslateY: 0
      });
    }
  }, []);

  // Bölümler arası geçiş işlemi
  const handleSectionNavigation = useCallback((action, fromSectionId, toSectionId, railId, itemId) => {
    console.log("[DetailPage] Navigation:", action, fromSectionId, toSectionId, railId, itemId);
    
    if (action === "back") {
      onBack();
    } else if (action === "select" && fromSectionId === "play-button") {
      console.log("[DetailPage] Play button selected");
      // Oynat butonuna tıklanınca yapılacak işlemler
      alert(`İçerik oynatılıyor...`);
    } else if (action === "changeSection") {
      // Bölümler arası geçiş
      console.log(`[DetailPage] Changing section from ${fromSectionId} to ${toSectionId}`);
      setActiveSection(toSectionId);
      
      // Hedef bölüme focus sağla
      setTimeout(() => {
        if (navigation && navigation.setFocus) {
          console.log(`[DetailPage] Setting focus to ${toSectionId} rail-0 item-0`);
          navigation.setFocus(toSectionId, "rail-0", "item-0");
        }
      }, 50);
    }
  }, [onBack, navigation]);

  return {
    activeSection,
    uiState,
    handleSectionFocus,
    handleSectionNavigation
  };
};

export default useDetailPageNavigation;
