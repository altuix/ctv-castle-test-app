# CTV Castle - Navigation Framework for TV Applications

## Table of Contents

1. [Project Description](#project-description)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation](#installation)
5. [Framework Structure](#framework-structure)
6. [How the Navigation System Works](#how-the-navigation-system-works)
7. [Testing](#testing)
8. [Production Build](#production-build)
9. [License](#license)

## Project Description

CTV Castle is a navigation framework specially designed for TV applications. This framework provides a structure that enables easy navigation with a TV remote control, manages transitions between sections, and optimizes the user experience. The framework is specifically designed for applications controlled by TV remotes and offers comprehensive solutions for focus management, transitions between sections, and user experience optimization.

## Features

- Fully compatible navigation system with TV remote control (arrow keys, enter, back, menu)
- Easy transition between sections
- Content organization with rail structure
- Focus management and memory system
- Detail page navigation
- Scroll management
- Responsive design
- Transition between menu and content sections
- Navigation history management
- UI state management (menu expansion/contraction, content dimming, etc.)

## Technology Stack

- React: For UI components
- JavaScript: For core logic and navigation operations
- Tailwind CSS: For styling
- Vite: For fast development and build process
- Node.js: v18.12.x
- npm: v8.19.x

## Installation

```bash
# Clone the project
git clone [repo-url]

# Navigate to the project directory
cd ctv_castle

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Framework Structure

CTV Castle framework consists of the following core components:

### 1. Core Components

- **NavigationContext** (`/src/core/navigation/NavigationContext.jsx`): The central context that manages the navigation state of the application. It controls focus management, focus memory, and transitions between sections.

- **NavigableSection** (`/src/core/components/NavigableSection.jsx`): The basic component used to create navigable sections in TV applications. It organizes rails and manages navigation with the TV remote.

- **TVKeyHandler** (`/src/core/navigation/TVKeyHandler.jsx`): The component that captures TV remote key events and converts them into navigation actions.

- **Rail** (`/src/core/components/Rail.jsx`): Component used to organize and display content items in a horizontal or vertical layout.

### 2. Core Hooks

- **useNavigationHistory** (`/src/core/hooks/useNavigationHistory.js`): Hook that manages navigation history within the application.

- **useDetailPageNavigation** (`/src/core/hooks/useDetailPageNavigation.js`): Hook that manages navigation on the detail page.

- **useUIState** (`/src/core/hooks/useUIState.js`): Hook that manages UI state within the application (menu expansion, content dimming, etc.).

- **useRailData** (`/src/core/hooks/useRailData.js`): Hook that manages rail data and processes it for display.

- **useScrollManagement** (`/src/core/hooks/useScrollManagement.js`): Hook that manages the scroll state of rails and sections.

### 3. Utility Functions

- **navigationUtils.js** (`/src/core/utils/navigationUtils.js`): Contains helper functions for managing navigation operations, including the `handleSectionNavigation` function that manages navigation within sections.

- **scrollUtils.js** (`/src/core/utils/scrollUtils.js`): Contains utility functions for calculating scroll positions and managing scroll behavior.

- **aspectRatio.js** (`/src/core/utils/aspectRatio.js`): Contains utility functions for calculating dimensions based on aspect ratios.

### 4. Alternative Navigation Approach (Testing)

- **SettingsPage** (`/src/components/SettingsPage.jsx`): This component implements an alternative navigation approach specifically designed for testing performance on TV devices. Unlike the rest of the application which uses the NavigableSection and Rail components, SettingsPage uses a custom focus management system. This was intentionally designed differently to compare performance and user experience between different navigation approaches.

## How the Navigation System Works

The navigation system in CTV Castle works with the following basic principles:

### 1. Navigation Between Sections

Navigation between sections is managed by connecting NavigableSection components and using the `neighbors` prop:

```jsx
<NavigableSection
  sectionId="home"
  // Other props...
  neighbors={{
    left: "menu", // Transition to the "menu" section when the left arrow key is pressed
    right: "settings", // Transition to the "settings" section when the right arrow key is pressed
  }}
/>
```

### 2. Focus Management

Focus management is performed within NavigationContext. This context tracks which item is focused and manages focus memory:

```javascript
// Setting focus
setFocus("home", "rail-0", "item-2");

// Getting the last focus
const lastPosition = getLastSectionFocus("home"); // { railId: "rail-0", itemId: "item-0" }
```

### 3. Usage Scenarios

#### Menu-Content Transitions

Transitions between menu and content sections are managed at the AppContent level. When transitioning from the menu to a content section, the last focus position in that section is remembered and focused.

#### Detail Page Navigation

When a content item is clicked, a transition to the detail page is made. When returning from the detail page, the previous state is returned to using navigation history.

#### Navigation Within Rails

Navigation within rails is managed by the handleSectionNavigation function. This function enables navigation between items within a rail and transitions between rails.

## Testing

### Testing in Chrome

To test the application in Chrome:

```bash
npm run dev
```

Run the command and go to `http://localhost:5173`. You can test navigation using keyboard keys:

- Arrow keys (37-left, 38-up, 39-right, 40-down): Navigate between sections and items
- Enter key (13): Select an item
- Backspace key (8): Go back
- M key (77): Menu key

#### TV Device Emulation in Chrome

For a more accurate testing experience that simulates a TV environment:

1. Open Chrome DevTools (F12 or Right-click > Inspect)
2. Click on the Device Toggle toolbar (or press Ctrl+Shift+M)
3. Click on "Edit" in the devices dropdown
4. Click "Add custom device"
5. Enter the following settings:
   - Name: TV
   - Width: 1920
   - Height: 1080
   - Device pixel ratio: 1
   - User agent string: (leave as default)
6. Click "Add"
7. Select your new "TV" device from the dropdown

This setup provides a 1920x1080 resolution viewport which is standard for TV applications and helps ensure your UI elements are properly sized and positioned for TV displays.

## Production Build

To create a production build:

```bash
npm run build
```

This command creates an optimized build in the `dist` folder. You can upload this build to a web server or test it with a local web server:

```bash
npm run preview
```

## License

This project is for evaluation purposes and is not licensed for public use.

---

© 2025 CTV Castle
