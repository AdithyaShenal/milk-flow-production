import L from "leaflet";

// Dimensions for the SVG viewBox and display size
const SVG_WIDTH = 24;
const SVG_HEIGHT = 35;

// Anchor MUST be set to the tip of the pin
const PIN_ANCHOR_X = SVG_WIDTH / 2;
const PIN_ANCHOR_Y = SVG_HEIGHT;

export const createNumberedMarkerIcon = (index: number) => {
  const textColor = "#5E5C5C";
  const markerNumber = String(index);

  return L.divIcon({
    className: "custom-svg-marker",

    html: `
      <div class="relative drop-shadow-lg" style="width: ${SVG_WIDTH}px; height: ${SVG_HEIGHT}px;">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 35" 
          width="${SVG_WIDTH}" 
          height="${SVG_HEIGHT}"
          fill="none" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path 
            d="M12 2C6.477 2 2 6.477 2 12c0 8.74 10 20 10 20s10-11.26 10-20c0-5.523-4.477-10-10-10z" 
            fill="#fb2c36" 
            stroke="white" 
            stroke-width="0" 
          />
          <circle 
            cx="12" 
            cy="12" 
            r="7" 
            fill="white" 
          />
        </svg>

        <div style="
          position: absolute;
          top: 0px; /* Top of the circle is roughly 0px from the top of the container */
          left: 0px; 
          width: 100%;
          height: ${SVG_WIDTH}px; /* Only needs to cover the circle area */
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px; /* Adjust size to fit the number */
          color: ${textColor};
          z-index: 10; /* Ensure the number is above the SVG */
        ">
          ${markerNumber}
        </div>
      </div>
    `,

    iconSize: [SVG_WIDTH, SVG_HEIGHT],
    iconAnchor: [PIN_ANCHOR_X, PIN_ANCHOR_Y],
  });
};
