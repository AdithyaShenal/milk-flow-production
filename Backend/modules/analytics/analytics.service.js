import * as repository from "./analytics.repository.js";

export async function miniDashboardService() {
  const totalPendingProductionVolume =
    await repository.getTotalPendingProduction();
  const totalAvailableTruckCapacity = await repository.getTotalTruckCapacity();

  const autoResolvability =
    totalPendingProductionVolume <= totalAvailableTruckCapacity;

  const productionSumByRoute = await repository.getProductionSumByRoute();
  const truckCapacityByRoute = await repository.getTruckCapacityByRoute();

  const productionMap = new Map(
    productionSumByRoute.map((p) => [p.route, p.totalVolume]),
  );

  let routeWiseResolvability = true;

  const capacityMap = truckCapacityByRoute.map((t) => {
    const totalVolume = productionMap.get(t.route) || 0;

    if (totalVolume > t.totalCapacity) {
      routeWiseResolvability = false;
    }

    return {
      ...t,
      totalVolume,
    };
  });

  return {
    totalVolume: totalPendingProductionVolume,
    availableCapacity: totalAvailableTruckCapacity,
    autoResolvability,
    routeWiseResolvability,
    capacityMap,
  };
}
