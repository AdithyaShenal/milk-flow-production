package com.logistic.logistic.Dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RouteResult {
    public List<RouteInfo> routes = new ArrayList<>();
    public long total_distance = 0;
    public long total_load = 0;
    public Integer route = 0;
}
