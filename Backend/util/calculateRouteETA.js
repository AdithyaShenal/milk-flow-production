import { haversineDistance } from "./haversineDistance.js";
import RouteETA from "../modules/routeETA/routeETA.model.js";

const AVG_SPEED_KMPH = 30;
const SERVICE_TIME_MIN = 3;
const BUFFER_MIN = 10;

export async function calculateRouteETA(route) {
  if (!route.activatedAt) return;

  await RouteETA.deleteMany({ route_id: route._id });

  let currentTime = new Date(route.activatedAt);

  for (let i = 0; i < route.stops.length; i++) {
    const stop = route.stops[i];

    if (!stop.production || !stop.production.farmer) {
      continue; // skip stops without production/farmer
    }

    const farmer = stop.production.farmer;

    if (i > 0) {
      const prevStop = route.stops[i - 1];
      if (prevStop.production?.farmer) {
        const prevFarmer = prevStop.production.farmer;

        const distance = haversineDistance(
          prevFarmer.location.lat,
          prevFarmer.location.lon,
          farmer.location.lat,
          farmer.location.lon,
        );

        const travelMinutes = (distance / AVG_SPEED_KMPH) * 60;
        currentTime = new Date(currentTime.getTime() + travelMinutes * 60000);
      }
    }

    // add service time
    currentTime = new Date(currentTime.getTime() + SERVICE_TIME_MIN * 60000);

    await RouteETA.create({
      route_id: route._id,
      farmer_id: farmer._id,
      production_id: stop.production._id,
      stop_order: stop.order,
      eta: currentTime,
      eta_window_start: new Date(currentTime.getTime() - BUFFER_MIN * 60000),
      eta_window_end: new Date(currentTime.getTime() + BUFFER_MIN * 60000),
      calculatedAt: new Date(),
    });
  }
}
