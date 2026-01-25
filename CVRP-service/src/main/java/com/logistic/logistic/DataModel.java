package com.logistic.logistic;

public class DataModel {

    public final long[][] distanceMatrix;
    public final long[] demands;
    public final long[] vehicleCapacities;
    public final int vehicleNumber;
    public final int depot = 0;

    public DataModel(
            long[][] distanceMatrix,
            long[] demands,
            long[] vehicleCapacities
    ) {
        this.distanceMatrix = distanceMatrix;
        this.demands = demands;
        this.vehicleCapacities = vehicleCapacities;
        this.vehicleNumber = vehicleCapacities.length;
    }
}
