package com.logistic.logistic.Controller;

import com.logistic.logistic.Dto.RouteResult;
import com.logistic.logistic.Service.RouteService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class MapController {

    private final RouteService routeService;

    @PostMapping("/routeOptimize/auto")
    public RouteResult optimizeAuto(
            @RequestBody com.logistic.logistic.Dto.RequestBody request) {
        return routeService.findRoute(request);
    }

    @PostMapping("/routeOptimize/routeWise")
    public List<RouteResult> optimizeRouteWise(
            @RequestBody com.logistic.logistic.Dto.RequestBody[] request) {

        return Arrays.stream(request)
                .parallel()
                .map(routeService::findRoute)
                .toList();
    }
}