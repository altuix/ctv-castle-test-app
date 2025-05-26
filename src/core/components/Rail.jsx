import React, { useEffect, useRef } from "react";
import RailItem from "./RailItem";

/**
 * Rail component - horizontal or vertical content list
 */
const Rail = React.memo(
  ({
    rail,
    index,
    sectionId,
    orientation,
    activeFocus,
    setFocus,
    transform,
    onRailRef,
    className = "",
    titleClassName = "",
    railClassName = "",
    style = {},
    titleStyle = {},
    railStyle = {},
    itemProps = {},
  }) => {
    const railRef = useRef(null);

    useEffect(() => {
      if (railRef.current) {
        onRailRef(index, railRef.current);
      }
    }, [index, onRailRef]);

    // Varsayılan container sınıfları
    const defaultContainerClasses = `rail-container ${className}`;
    
    // Varsayılan başlık sınıfları
    const defaultTitleClasses = `text-2xl mb-2 ${titleClassName}`;
    
    // Varsayılan rail sınıfları
    const defaultRailClasses = `rail ${orientation === "vertical" ? "flex-col" : "flex-row"} ${railClassName}`;
    
    // Varsayılan rail stilleri
    const defaultRailStyle = {
      overflow: "hidden",
      whiteSpace: "nowrap",
      transform: `translateX(${transform || 0}px)`,
      transition: "transform 0.3s ease",
      ...railStyle
    };
    
    return (
      <div className={defaultContainerClasses} style={style}>
        {rail.title && <h2 className={defaultTitleClasses} style={titleStyle}>{rail.title}</h2>}
        <div
          ref={railRef}
          className={defaultRailClasses}
          data-orientation={orientation}
          style={defaultRailStyle}
        >
          {rail.items.map((item, itemIndex) => {
            const itemId = `item-${itemIndex}`;
            const isFocused =
              activeFocus &&
              activeFocus.sectionId === sectionId &&
              activeFocus.railId === `rail-${index}` &&
              activeFocus.itemId === itemId;

            return (
              <RailItem
                key={itemId}
                item={item}
                itemId={itemId}
                sectionId={sectionId}
                railIndex={index}
                isFocused={isFocused}
                orientation={orientation}
                setFocus={setFocus}
                {...itemProps}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

export default Rail;
