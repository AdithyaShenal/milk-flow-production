package com.logistic.logistic.Dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RouteInfo {
    public int vehicle_id;
    public List<RouteStop> stops = new ArrayList<>();
    public long distance;
    public long load;
}

