package com.logistic.logistic.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logistic.logistic.Dto.DistanceMatrixResult;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OsrmService {

    // private static final String OSRM_TABLE_URL =
    //         "http://router.project-osrm.org/table/v1/driving/";
    private static final String OSRM_TABLE_URL = "http://osrm:6000/table/v1/driving/";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public record Coordinate(double lon, double lat) {}

    public DistanceMatrixResult getDistanceMatrix(List<Coordinate> coords)
            throws Exception {

        if (coords == null || coords.isEmpty()) {
            throw new IllegalArgumentException("Coordinates list is empty");
        }

        // lon,lat;lon,lat
        String locations = coords.stream()
                .map(c -> c.lon() + "," + c.lat())
                .collect(Collectors.joining(";"));

        String url = OSRM_TABLE_URL + locations +
                "?annotations=distance,duration";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode root = mapper.readTree(response.body());

        long[][] durations = null;
        long[][] distances = null;

        if (root.has("durations")) {
            durations = parseMatrix(root.get("durations"));
        }

        if (root.has("distances")) {
            distances = parseMatrix(root.get("distances"));
        }

        if (durations != null) {
            return new DistanceMatrixResult(durations, distances);
        }

        throw new RuntimeException(
                "Unexpected OSRM response: " + root.toString()
        );
    }

    private long[][] parseMatrix(JsonNode matrixNode) {
        int rows = matrixNode.size();
        int cols = matrixNode.get(0).size();

        long[][] matrix = new long[rows][cols];

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                matrix[i][j] = matrixNode.get(i).get(j).asLong();
            }
        }
        return matrix;
    }
}

