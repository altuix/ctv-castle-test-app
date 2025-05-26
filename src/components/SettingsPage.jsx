import React, {
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { useNavigation } from "../core/navigation/NavigationContext";
import TVKeyHandler from "../core/navigation/TVKeyHandler";

/**
 * Settings Page Component
 * Displays user settings including subscription details, profile settings, and device settings
 *
 * @param {Function} onBack - Callback function to navigate back
 */
const SettingsPage = ({ onBack }) => {
  // Get navigation context - using ref to prevent re-renders
  const { activeFocus, setFocus } = useNavigation();
  const focusRef = useRef(activeFocus);

  // State for active section and item
  const [activeSection, setActiveSection] = useState("subscription");
  const [activeItem, setActiveItem] = useState(null);

  // Flag to prevent initial focus setting from triggering multiple times
  const initialFocusSetRef = useRef(false);

  // Config for enabling/disabling mouse click functionality
  const enableMouseClick = false; // Set to false to disable mouse click functionality

  // Mock data for settings
  const [settings, setSettings] = useState({
    subscription: {
      plan: "Premium",
      expiryDate: "2025-12-31",
      status: "Active",
      autoRenewal: true,
    },
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      profileImage: "https://via.placeholder.com/320x180",
      profiles: [
        { id: "profile-1", name: "John", isActive: true },
        { id: "profile-2", name: "Jane", isActive: false },
        { id: "profile-3", name: "Kids", isActive: false },
      ],
    },
    devices: [
      {
        id: "device-1",
        name: "Living Room TV",
        lastActive: "2025-05-24",
        type: "Smart TV",
      },
      {
        id: "device-2",
        name: "Bedroom TV",
        lastActive: "2025-05-20",
        type: "Smart TV",
      },
      {
        id: "device-3",
        name: "Mobile Phone",
        lastActive: "2025-05-25",
        type: "Mobile",
      },
      {
        id: "device-4",
        name: "Tablet",
        lastActive: "2025-05-15",
        type: "Tablet",
      },
    ],
  });

  // Update focus ref when activeFocus changes
  useLayoutEffect(() => {
    focusRef.current = activeFocus;
  }, [activeFocus]);

  // Set initial focus only once using useEffect to ensure it runs after render
  useEffect(() => {
    if (!initialFocusSetRef.current) {
      initialFocusSetRef.current = true;
      // Delay the initial focus to ensure the component is fully mounted
      setTimeout(() => {
        setFocus("settings", "section-nav", "subscription");
        setActiveSection("subscription");
      }, 100);
    }
  }, [setFocus]);

  // Handle navigation between sections
  const handleNavigation = useCallback(
    (action) => {
      // Use the ref to get the latest focus state
      const focus = focusRef.current;
      if (!focus || focus.sectionId !== "settings") return;

      const { railId, itemId } = focus;

      // Navigation in the section menu
      if (railId === "section-nav") {
        if (action === "down") {
          if (itemId === "subscription") {
            setFocus("settings", "section-nav", "profile");
          } else if (itemId === "profile") {
            setFocus("settings", "section-nav", "devices");
          }
        } else if (action === "up") {
          if (itemId === "devices") {
            setFocus("settings", "section-nav", "profile");
          } else if (itemId === "profile") {
            setFocus("settings", "section-nav", "subscription");
          }
        } else if (action === "right" || action === "enter") {
          setActiveSection(itemId);
          // Move to content area
          if (itemId === "subscription") {
            setFocus("settings", "subscription-content", "plan");
          } else if (itemId === "profile") {
            setFocus("settings", "profile-content", "name");
          } else if (itemId === "devices") {
            if (settings.devices.length > 0) {
              setFocus("settings", "devices-content", "device-1");
            }
          }
        } else if (action === "back") {
          onBack();
        }
      }
      // Navigation in the subscription content
      else if (railId === "subscription-content") {
        if (action === "left") {
          setFocus("settings", "section-nav", "subscription");
        } else if (action === "back") {
          onBack();
        }
      }
      // Navigation in the profile content
      else if (railId === "profile-content") {
        if (action === "down") {
          if (itemId === "name") {
            setFocus("settings", "profile-content", "image");
          } else if (itemId === "image") {
            setFocus("settings", "profile-content", "profile-1");
          } else {
            const currentIndex = parseInt(itemId.split("-")[1]);
            const nextIndex = currentIndex + 1;
            if (nextIndex <= settings.profile.profiles.length) {
              setFocus("settings", "profile-content", `profile-${nextIndex}`);
            }
          }
        } else if (action === "up") {
          if (itemId === "image") {
            setFocus("settings", "profile-content", "name");
          } else if (itemId === "profile-1") {
            setFocus("settings", "profile-content", "image");
          } else {
            const currentIndex = parseInt(itemId.split("-")[1]);
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 1) {
              setFocus("settings", "profile-content", `profile-${prevIndex}`);
            } else {
              setFocus("settings", "profile-content", "image");
            }
          }
        } else if (action === "left") {
          setFocus("settings", "section-nav", "profile");
        } else if (action === "enter") {
          setActiveItem(itemId);
          // Handle profile switching
          if (itemId.startsWith("profile-")) {
            const profileId = itemId;
            setSettings((prev) => {
              const updatedProfiles = prev.profile.profiles.map((profile) => ({
                ...profile,
                isActive: profile.id === profileId,
              }));

              return {
                ...prev,
                profile: {
                  ...prev.profile,
                  profiles: updatedProfiles,
                },
              };
            });
          }
        } else if (action === "back") {
          onBack();
        }
      }
      // Navigation in the devices content
      else if (railId === "devices-content") {
        if (action === "down") {
          const currentIndex = parseInt(itemId.split("-")[1]);
          const nextIndex = currentIndex + 1;
          if (nextIndex <= settings.devices.length) {
            setFocus("settings", "devices-content", `device-${nextIndex}`);
          }
        } else if (action === "up") {
          const currentIndex = parseInt(itemId.split("-")[1]);
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 1) {
            setFocus("settings", "devices-content", `device-${prevIndex}`);
          }
        } else if (action === "left") {
          setFocus("settings", "section-nav", "devices");
        } else if (action === "enter") {
          setActiveItem(itemId);
        } else if (action === "back") {
          onBack();
        }
      }
    },
    [
      onBack,
      setFocus,
      settings.devices.length,
      settings.profile.profiles.length,
    ]
  );

  // Handle device removal
  const handleRemoveDevice = useCallback(
    (deviceId) => {
      setSettings((prev) => {
        const updatedDevices = prev.devices.filter(
          (device) => device.id !== deviceId
        );

        // Reset focus if needed - using setTimeout to ensure state is updated first
        setTimeout(() => {
          if (updatedDevices.length > 0) {
            setFocus("settings", "devices-content", "device-1");
          } else {
            setFocus("settings", "section-nav", "devices");
          }
        }, 0);

        return {
          ...prev,
          devices: updatedDevices,
        };
      });
    },
    [setFocus]
  );

  // Handle device renaming
  const handleRenameDevice = useCallback((deviceId, newName) => {
    setSettings((prev) => {
      // Create updated devices array
      const updatedDevices = prev.devices.map((device) =>
        device.id === deviceId ? { ...device, name: newName } : device
      );

      return {
        ...prev,
        devices: updatedDevices,
      };
    });
  }, []);

  // Render subscription section
  const renderSubscriptionSection = () => {
    const { plan, expiryDate, status, autoRenewal } = settings.subscription;
    const isFocused =
      focusRef.current && focusRef.current.railId === "subscription-content";

    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 border-b-2 border-[#333] pb-4">
          Subscription Details
        </h2>
        <div className="grid grid-cols-1 gap-5">
          <div
            className={`bg-[#222] rounded-lg p-5 transition-all ${
              isFocused && focusRef.current.itemId === "plan"
                ? "bg-[#0078D7] text-white"
                : ""
            }`}
            onClick={
              enableMouseClick
                ? () => setFocus("settings", "subscription-content", "plan")
                : undefined
            }
          >
            <div
              className={`text-lg ${
                isFocused && focusRef.current.itemId === "plan"
                  ? "text-gray-300"
                  : "text-gray-500"
              } mb-2`}
            >
              Plan
            </div>
            <div className="text-2xl font-bold">{plan}</div>
          </div>
          <div
            className={`bg-[#222] rounded-lg p-5 transition-all ${
              isFocused && focusRef.current.itemId === "expiry"
                ? "bg-[#0078D7] text-white"
                : ""
            }`}
            onClick={
              enableMouseClick
                ? () => setFocus("settings", "subscription-content", "expiry")
                : undefined
            }
          >
            <div
              className={`text-lg ${
                isFocused && focusRef.current.itemId === "expiry"
                  ? "text-gray-300"
                  : "text-gray-500"
              } mb-2`}
            >
              Expiry Date
            </div>
            <div className="text-2xl font-bold">{expiryDate}</div>
          </div>
          <div
            className={`bg-[#222] rounded-lg p-5 transition-all ${
              isFocused && focusRef.current.itemId === "status"
                ? "bg-[#0078D7] text-white"
                : ""
            }`}
            onClick={
              enableMouseClick
                ? () => setFocus("settings", "subscription-content", "status")
                : undefined
            }
          >
            <div
              className={`text-lg ${
                isFocused && focusRef.current.itemId === "status"
                  ? "text-gray-300"
                  : "text-gray-500"
              } mb-2`}
            >
              Status
            </div>
            <div className="text-2xl font-bold">{status}</div>
          </div>
          <div
            className={`bg-[#222] rounded-lg p-5 transition-all ${
              isFocused && focusRef.current.itemId === "renewal"
                ? "bg-[#0078D7] text-white"
                : ""
            }`}
            onClick={
              enableMouseClick
                ? () => setFocus("settings", "subscription-content", "renewal")
                : undefined
            }
          >
            <div
              className={`text-lg ${
                isFocused && focusRef.current.itemId === "renewal"
                  ? "text-gray-300"
                  : "text-gray-500"
              } mb-2`}
            >
              Auto Renewal
            </div>
            <div className="text-2xl font-bold">
              {autoRenewal ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render profile section
  const renderProfileSection = () => {
    const { name, email, profileImage, profiles } = settings.profile;
    const isFocused =
      focusRef.current && focusRef.current.railId === "profile-content";

    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 border-b-2 border-[#333] pb-4">
          Profile Settings
        </h2>
        <div className="grid grid-cols-1 gap-5">
          <div
            className={`bg-[#222] rounded-lg p-5 transition-all ${
              isFocused && focusRef.current.itemId === "name"
                ? "bg-[#0078D7] text-white"
                : ""
            }`}
            onClick={
              enableMouseClick
                ? () => setFocus("settings", "profile-content", "name")
                : undefined
            }
          >
            <div
              className={`text-lg ${
                isFocused && focusRef.current.itemId === "name"
                  ? "text-gray-300"
                  : "text-gray-500"
              } mb-2`}
            >
              Name
            </div>
            <div className="text-2xl font-bold">{name}</div>
          </div>
          <div
            className={`bg-[#222] rounded-lg p-5 transition-all ${
              isFocused && focusRef.current.itemId === "image"
                ? "bg-[#0078D7] text-white"
                : ""
            }`}
            onClick={
              enableMouseClick
                ? () => setFocus("settings", "profile-content", "image")
                : undefined
            }
          >
            <div
              className={`text-lg ${
                isFocused && focusRef.current.itemId === "image"
                  ? "text-gray-300"
                  : "text-gray-500"
              } mb-2`}
            >
              Profile Image
            </div>
            <div className="text-2xl font-bold">
              <img
                src={profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="text-2xl font-bold mt-6 mb-4 text-gray-300">
            Switch Profile
          </div>
          <div className="grid grid-cols-1 gap-3">
            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                className={`flex justify-between items-center p-5 rounded-lg transition-all ${
                  profile.isActive ? "border-l-4 border-green-500" : ""
                } ${
                  isFocused && focusRef.current.itemId === profile.id
                    ? "bg-[#0078D7] text-white"
                    : "bg-[#222]"
                }`}
                onClick={
                  enableMouseClick
                    ? () => setFocus("settings", "profile-content", profile.id)
                    : undefined
                }
              >
                <div className="text-2xl font-medium">{profile.name}</div>
                {profile.isActive && (
                  <div className="text-green-500 text-2xl">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render devices section
  const renderDevicesSection = () => {
    const { devices } = settings;
    const isFocused =
      focusRef.current && focusRef.current.railId === "devices-content";

    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 border-b-2 border-[#333] pb-4">
          Device Settings
        </h2>
        {devices.length === 0 ? (
          <div className="text-xl text-gray-400 p-6 bg-[#222] rounded-lg">
            No devices registered
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`rounded-lg overflow-hidden transition-all ${
                  isFocused && focusRef.current.itemId === device.id
                    ? "bg-[#0078D7] text-white"
                    : "bg-[#222]"
                }`}
                onClick={
                  enableMouseClick
                    ? () => setFocus("settings", "devices-content", device.id)
                    : undefined
                }
              >
                <div className="p-5">
                  <div className="text-2xl font-bold mb-2">{device.name}</div>
                  <div className="flex gap-6 text-lg">
                    <span
                      className={
                        isFocused && focusRef.current.itemId === device.id
                          ? "text-gray-300"
                          : "text-gray-500"
                      }
                    >
                      {device.type}
                    </span>
                    <span
                      className={
                        isFocused && focusRef.current.itemId === device.id
                          ? "text-gray-300"
                          : "text-gray-500"
                      }
                    >
                      Last active: {device.lastActive}
                    </span>
                  </div>
                </div>
                {activeItem === device.id && (
                  <div className="flex border-t border-[#333] divide-x divide-[#333]">
                    <button
                      className="flex-1 py-4 text-xl font-medium transition-colors hover:bg-[#333] focus:bg-[#333]"
                      onClick={() =>
                        handleRenameDevice(
                          device.id,
                          `${device.name} (Renamed)`
                        )
                      }
                    >
                      Rename
                    </button>
                    <button
                      className="flex-1 py-4 text-xl font-medium text-red-500 transition-colors hover:bg-[#333] focus:bg-[#333]"
                      onClick={() => handleRemoveDevice(device.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <TVKeyHandler onNavigate={handleNavigation}>
      <div className="bg-[#111] text-white min-h-screen p-8 text-lg">
        <div className="flex justify-between items-center mb-10 border-b-2 border-[#333] pb-5">
          <h1 className="text-4xl font-bold">Settings</h1>
          <button
            className="bg-transparent border-2 border-[#555] text-white px-6 py-3 rounded-lg cursor-pointer text-xl transition-all hover:bg-[#555]"
            onClick={onBack}
          >
            Back
          </button>
        </div>
        <div className="flex gap-10 h-[calc(100vh-120px)]">
          <div className="w-64 border-r-2 border-[#333] pr-6">
            <div
              className={`py-5 px-4 mb-4 rounded-lg cursor-pointer transition-all text-2xl ${
                activeSection === "subscription" ? "bg-[#222] font-bold" : ""
              } ${
                focusRef.current &&
                focusRef.current.railId === "section-nav" &&
                focusRef.current.itemId === "subscription"
                  ? "bg-[#0078D7] text-white font-bold"
                  : ""
              }`}
              onClick={
                enableMouseClick
                  ? () => {
                      setActiveSection("subscription");
                      setFocus("settings", "section-nav", "subscription");
                    }
                  : undefined
              }
            >
              Subscription
            </div>
            <div
              className={`py-5 px-4 mb-4 rounded-lg cursor-pointer transition-all text-2xl ${
                activeSection === "profile" ? "bg-[#222] font-bold" : ""
              } ${
                focusRef.current &&
                focusRef.current.railId === "section-nav" &&
                focusRef.current.itemId === "profile"
                  ? "bg-[#0078D7] text-white font-bold"
                  : ""
              }`}
              onClick={
                enableMouseClick
                  ? () => {
                      setActiveSection("profile");
                      setFocus("settings", "section-nav", "profile");
                    }
                  : undefined
              }
            >
              Profile
            </div>
            <div
              className={`py-5 px-4 mb-4 rounded-lg cursor-pointer transition-all text-2xl ${
                activeSection === "devices" ? "bg-[#222] font-bold" : ""
              } ${
                focusRef.current &&
                focusRef.current.railId === "section-nav" &&
                focusRef.current.itemId === "devices"
                  ? "bg-[#0078D7] text-white font-bold"
                  : ""
              }`}
              onClick={
                enableMouseClick
                  ? () => {
                      setActiveSection("devices");
                      setFocus("settings", "section-nav", "devices");
                    }
                  : undefined
              }
            >
              Devices
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            {activeSection === "subscription" && renderSubscriptionSection()}
            {activeSection === "profile" && renderProfileSection()}
            {activeSection === "devices" && renderDevicesSection()}
          </div>
        </div>
      </div>
    </TVKeyHandler>
  );
};

export default SettingsPage;
