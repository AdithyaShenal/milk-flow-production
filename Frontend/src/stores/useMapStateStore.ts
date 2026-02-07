import { create } from "zustand";
import type { Route } from "../hooks/useGenerateRoutes";

interface RouteStore {
  mapRoute: Route | null;
  setMapRoute: (route: Route) => void;
  resetMapRoute: () => void;
}

export const useMapStateStore = create<RouteStore>((set) => ({
  mapRoute: null,

  setMapRoute: (route) =>
    set({
      mapRoute: route,
    }),

  resetMapRoute: () =>
    set({
      mapRoute: null,
    }),
}));

export default useMapStateStore;
