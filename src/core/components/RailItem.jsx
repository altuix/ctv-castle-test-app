import React from "react";
import { getRatioHeight, getRatioWidth } from "../utils/aspectRatio";

/**
 * RailItem component - Renders items within a rail
 */
const RailItem = ({
  item,
  itemId,
  sectionId,
  railIndex,
  isFocused,
  orientation,
  setFocus,
  className = "",
  imageClassName = "",
  titleClassName = "",
  buttonClassName = "",
  style = {},
  imageStyle = {},
  titleStyle = {},
}) => {
  if (item.isButton) {
    const defaultButtonClasses = `rail-item ${isFocused ? "bg-red-600" : "bg-red-500"} text-white py-3 px-8 rounded-lg shadow-lg transition-all duration-300 ${isFocused ? "scale-105" : ""}`;
    
    const defaultButtonStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "auto",
      minWidth: "150px",
      height: "50px",
      cursor: "pointer",
      transform: isFocused ? "scale(1.05)" : "scale(1)",
      boxShadow: isFocused ? "0 0 15px rgba(255, 0, 0, 0.5)" : "none",
      ...style
    };
    
    return (
      <div
        id={`${sectionId}-rail-${railIndex}-cell${itemId.split("-")[1]}`}
        className={buttonClassName || defaultButtonClasses}
        style={defaultButtonStyle}
        onClick={() => setFocus(sectionId, `rail-${railIndex}`, itemId)}
      >
        <span className="flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          {item.title}
        </span>
      </div>
    );
  }

  // Normal item için varsayılan sınıflar
  const defaultItemClasses = `rail-item ${isFocused ? "fake-focus" : ""} ${className}`;
  
  // Normal item için varsayılan stil nesnesi
  const defaultItemStyle = {
    width: orientation === "horizontal" ? getRatioWidth(item.ratio || "16:9") : "100%",
    height: orientation === "vertical" ? "60px" : "auto",
    display: "inline-block",
    marginRight: orientation === "horizontal" ? "10px" : "0",
    ...style
  };
  
  // Resim için varsayılan stil nesnesi
  const defaultImageStyle = {
    width: "100%",
    height: getRatioHeight(item.ratio || "16:9"),
    objectFit: "cover",
    borderRadius: "8px",
    ...imageStyle
  };
  
  // Başlık için varsayılan sınıflar
  const defaultTitleClasses = titleClassName || "";
  
  // Başlık için varsayılan stil nesnesi
  const defaultTitleStyle = {
    ...titleStyle
  };

  // Normal item render
  return (
    <div
      id={`${sectionId}-rail-${railIndex}-cell${itemId.split("-")[1]}`}
      className={defaultItemClasses}
      style={defaultItemStyle}
      onClick={() => setFocus(sectionId, `rail-${railIndex}`, itemId)}
    >
      {orientation === "horizontal" ? (
        <>
          <img
            src={item.thumbnail}
            alt={item.title}
            className={imageClassName}
            style={defaultImageStyle}
          />
          <p className={defaultTitleClasses} style={defaultTitleStyle}>{item.title}</p>
        </>
      ) : (
        <div className={`p-2 ${defaultTitleClasses}`} style={defaultTitleStyle}>{item.title}</div>
      )}
    </div>
  );
};

export default React.memo(RailItem);
