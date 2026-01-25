import L from "leaflet";

export const depotMarker = L.divIcon({
  className: "custom-depot-marker",
  html: `
    <div class="w-6 h-6 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-lg">
        <div class="text-white font-bold text-sm">D</div>
    </div>
  `,
  // Set the size of the overall container.
  // Should match the largest dimension (w-6 h-6 is 24x24px by default Tailwind config)
  iconSize: [24, 24],

  // Anchor point: half the size to center the marker on the coordinate
  iconAnchor: [12, 12],
});
