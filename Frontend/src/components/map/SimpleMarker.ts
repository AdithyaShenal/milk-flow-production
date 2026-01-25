import L from "leaflet";

// Dimensions for the SVG viewBox and display size
const SVG_WIDTH = 24;
const SVG_HEIGHT = 35;

// Anchor MUST be set to the tip of the pin
const PIN_ANCHOR_X = SVG_WIDTH / 2;
const PIN_ANCHOR_Y = SVG_HEIGHT;

export const SimpleMarker = () => {
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
      </div>
    `,

    iconSize: [SVG_WIDTH, SVG_HEIGHT],
    iconAnchor: [PIN_ANCHOR_X, PIN_ANCHOR_Y],
  });
};
