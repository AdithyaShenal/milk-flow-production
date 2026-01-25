package com.logistic.logistic.Service;

import com.logistic.logistic.DataModel;
import com.logistic.logistic.Dto.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import com.google.ortools.Loader;
import com.google.ortools.constraintsolver.Assignment;
import com.google.ortools.constraintsolver.FirstSolutionStrategy;
import com.google.ortools.constraintsolver.LocalSearchMetaheuristic;
import com.google.ortools.constraintsolver.RoutingIndexManager;
import com.google.ortools.constraintsolver.RoutingModel;
import com.google.ortools.constraintsolver.RoutingSearchParameters;
import com.google.ortools.constraintsolver.main;
import com.google.protobuf.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;


@Service
@AllArgsConstructor
public class RouteService {
    private final OsrmService osrmService;
    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    @PostConstruct
    public void init() {
        Loader.loadNativeLibraries();
        log.info("OR-Tools native libraries loaded");
    }

    // [START solution_printer]
    static void printSolution(
            DataModel data, RoutingModel routing, RoutingIndexManager manager, Assignment solution) {
        // Solution cost.
        log.info("Objective: " + solution.objectiveValue());
        // Inspect solution.
        long totalDistance = 0;
        long totalLoad = 0;
        for (int i = 0; i < data.vehicleNumber; ++i) {
            if (!routing.isVehicleUsed(solution, i)) {
                continue;
            }
            long index = routing.start(i);
            log.info("Route for Vehicle " + i + ":");
            long routeDistance = 0;
            long routeLoad = 0;
            String route = "";
            while (!routing.isEnd(index)) {
                long nodeIndex = manager.indexToNode(index);
                routeLoad += data.demands[(int) nodeIndex];
                route += nodeIndex + " Load(" + routeLoad + ") -> ";
                long previousIndex = index;
                index = solution.value(routing.nextVar(index));
                routeDistance += routing.getArcCostForVehicle(previousIndex, index, i);
            }
            route += manager.indexToNode(routing.end(i));
            log.info(route);
            log.info("Distance of the route: " + routeDistance + "m");
            totalDistance += routeDistance;
            totalLoad += routeLoad;
        }
        log.info("Total distance of all routes: " + totalDistance + "m");
        log.info("Total load of all routes: " + totalLoad);
    }
    // [END solution_printer]

    public RouteResult findRoute(RequestBody request){
        Loader.loadNativeLibraries();

        // 1️⃣ Convert double[][] → List<Coordinate>
        List<OsrmService.Coordinate> coordinates =
                Arrays.stream(request.getCoords())
                        .map(c -> new OsrmService.Coordinate(c[0], c[1]))
                        .toList();

        // 2️⃣ Call OSRM
        DistanceMatrixResult matrix;
        try {
            matrix = osrmService.getDistanceMatrix(coordinates);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch OSRM matrix", e);
        }

        if (matrix.distances == null) {
            throw new RuntimeException("OSRM returned no distance matrix");
        }

        final DataModel data = new DataModel(matrix.distances,request.getDemands(),request.getVehicle_capacities());


        RoutingIndexManager manager =
                new RoutingIndexManager(data.distanceMatrix.length, data.vehicleNumber, data.depot);

        RoutingModel routing = new RoutingModel(manager);

        final int transitCallbackIndex =
                routing.registerTransitCallback((long fromIndex, long toIndex) -> {
                    int fromNode = manager.indexToNode(fromIndex);
                    int toNode = manager.indexToNode(toIndex);
                    return data.distanceMatrix[fromNode][toNode];
                });

        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        final int demandCallbackIndex = routing.registerUnaryTransitCallback((long fromIndex) -> {
            int fromNode = manager.indexToNode(fromIndex);
            return data.demands[fromNode];
        });
        boolean unused = routing.addDimensionWithVehicleCapacity(
                demandCallbackIndex,
                0,
                data.vehicleCapacities,
                true,
                "Capacity");

        RoutingSearchParameters searchParameters =
                main.defaultRoutingSearchParameters()
                        .toBuilder()
                        .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC)
                        .setLocalSearchMetaheuristic(LocalSearchMetaheuristic.Value.GUIDED_LOCAL_SEARCH)
                        .setTimeLimit(Duration.newBuilder().setSeconds(1).build())
                        .build();

        Assignment solution = routing.solveWithParameters(searchParameters);

//        printSolution(data, routing, manager, solution);

        RouteResult jsonResult =
                solutionToJson(data, routing, manager, solution,  request.getRoute()); //Changes

// For testing
        log.info("Result = {}", jsonResult);
        return jsonResult;

    }

    static RouteResult solutionToJson(
            DataModel data,
            RoutingModel routing,
            RoutingIndexManager manager,
            Assignment solution,
            Integer routeNumber) { // Changes

        RouteResult result = new RouteResult();

        // Changes
        result.setRoute(routeNumber == null ? 0 : routeNumber);

        for (int vehicleId = 0; vehicleId < data.vehicleNumber; vehicleId++) {
            long index = routing.start(vehicleId);

            RouteInfo routeInfo = new RouteInfo();
            routeInfo.vehicle_id = vehicleId;

            long routeDistance = 0;
            long routeLoad = 0;

            while (!routing.isEnd(index)) {
                int nodeIndex = manager.indexToNode(index);
                routeLoad += data.demands[nodeIndex];

                routeInfo.stops.add(
                        new RouteStop(nodeIndex, routeLoad)
                );

                long prevIndex = index;
                index = solution.value(routing.nextVar(index));

                routeDistance += routing.getArcCostForVehicle(
                        prevIndex, index, vehicleId);
            }

            // Final depot
            routeInfo.stops.add(
                    new RouteStop(manager.indexToNode(index), routeLoad)
            );

            routeInfo.distance = routeDistance;
            routeInfo.load = routeLoad;

            // Same logic as Python: ignore empty routes
            if (routeLoad > 0) {
                result.routes.add(routeInfo);
                result.total_distance += routeDistance;
                result.total_load += routeLoad;
            }
        }

        return result;
    }

}
