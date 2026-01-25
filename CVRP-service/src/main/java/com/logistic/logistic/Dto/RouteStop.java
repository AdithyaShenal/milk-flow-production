package com.logistic.logistic.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteStop {
    public int node;
    public long load_after_visit;

}
