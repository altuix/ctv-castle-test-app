// src/App.jsx
import React from "react";
import { NavigationProvider } from "./core/navigation/NavigationContext";
import AppContent from "./AppContent";

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
