package com.logistic.logistic.Dto;

import lombok.Data;

import java.util.List;

@Data
public class RequestBody {
    private Integer route;
    private double[][] coords;
    private long[] demands;
    private long[] vehicle_capacities;
}
