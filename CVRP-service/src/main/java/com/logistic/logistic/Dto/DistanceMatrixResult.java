package com.logistic.logistic.Dto;

import lombok.Data;

@Data
public class DistanceMatrixResult {
    public long[][] durations;
    public long[][] distances;

    public DistanceMatrixResult(long[][] durations, long[][] distances) {
        this.durations = durations;
        this.distances = distances;
    }
}

