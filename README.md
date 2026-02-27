# MilkFlow – Production Deployment Repository

**MilkFlow** – An Intelligent Dairy Supply Chain & VRP-Based Route Optimization System

---

## Overview

This repository contains the **final production deployment** of the MilkFlow system, integrating **all services** into a unified platform.

MilkFlow is designed to:

- Optimize milk collection routes using **VRP algorithms**
- Digitize farmer and driver operations
- Provide real-time operational visibility for administrators
- Improve logistics efficiency and reduce operational costs

This repository includes the **backend, optimization engine, web dashboard, and mobile applications**.

---

## System Components

### 1️. Main Backend Service
- **Technology:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- Handles:
  - Supply chain and production data
  - User authentication & roles
  - Route coordination
  - Integration with VRP engine

### 2️. VRP Optimization Service
- **Technology:** Spring Boot
- Handles:
  - Vehicle Routing Problem (VRP) algorithms
  - Depot-based route optimization
  - Capacity and distance constraints

### 3️. Admin Web Dashboard
- **Technology:** React
- Provides:
  - Operational analytics
  - Route visualization
  - Production monitoring
  - User management

### 4️. Farmer Mobile Application
- **Technology:** React + Capacitor
- Features:
  - Production submissions
  - Collection tracking
  - Notifications

### 5️. Driver Mobile Application
- **Technology:** React + Capacitor
- Features:
  - Assigned route visualization
  - Delivery tracking
  - Status updates

---

## Deployment Architecture

This repository includes:

- All service configurations
- Environment-based configuration management
- Docker-based containerization
- Reverse proxy setup (if applicable)
- Production-ready environment variables

---

## Mobile Application Builds

**APKs for Android:**  
[Google Drive Link](https://drive.google.com/drive/folders/1MHDMqMoZ-yUtba8vVB5KJJG9Pbi-AwPr?usp=sharing)

---

## Core Capabilities

- VRP-based route optimization
- Role-based access control
- Real-time production data management
- Distributed service communication
- Scalable microservice architecture
- Secure API integration

---

## Performance Testing Using Grafana K6 (With Redis Cache Enabled)

```language

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: .\dev-load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 50 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 50 looping VUs for 1m0s (gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✗ 'p(95)<500' p(95)=820.41ms

    http_req_failed
    ✗ 'rate<0.1' rate=12.50%


  █ TOTAL RESULTS

    HTTP
    http_req_duration..............: avg=223.81ms min=1.61ms med=135.15ms max=1.8s  p(90)=605.11ms p(95)=820.41ms
      { expected_response:true }...: avg=243.64ms min=2.82ms med=151.12ms max=1.8s  p(90)=658.63ms p(95)=851.44ms
    http_req_failed................: 12.50% 1094 out of 8752
    http_reqs......................: 8752   140.697934/s

    EXECUTION
    iteration_duration.............: avg=2.8s     min=1.83s  med=2.76s    max=4.57s p(90)=3.11s    p(95)=3.31s
    iterations.....................: 1094   17.587242/s
    vus............................: 12     min=12           max=50
    vus_max........................: 50     min=50           max=50

    NETWORK
    data_received..................: 33 MB  537 kB/s
    data_sent......................: 1.0 MB 17 kB/s
```

## Performance Testing Using Grafana K6 (Without Redis Cache Disabled)
```language

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: .\dev-load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 50 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 50 looping VUs for 1m0s (gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✗ 'p(95)<500' p(95)=1.39s

    http_req_failed
    ✗ 'rate<0.1' rate=12.50%


  █ TOTAL RESULTS

    HTTP
    http_req_duration..............: avg=636.46ms min=6.04ms   med=540.59ms max=3.96s  p(90)=1.11s p(95)=1.39s
      { expected_response:true }...: avg=682.13ms min=122.19ms med=574.61ms max=3.96s  p(90)=1.16s p(95)=1.47s
    http_req_failed................: 12.50% 514 out of 4112
    http_reqs......................: 4112   63.950313/s

    EXECUTION
    iteration_duration.............: avg=6.1s     min=3.69s    med=5.63s    max=11.33s p(90)=9.01s p(95)=9.97s
    iterations.....................: 514    7.993789/s
    vus............................: 14     min=14          max=50
    vus_max........................: 50     min=50          max=50

    NETWORK
    data_received..................: 16 MB  245 kB/s
    data_sent......................: 525 kB 8.2 kB/s
```
## Comparison
## API Performance Test Results (k6)

| Cache Status | VUs | Duration | Requests | Avg Duration | Median (p50) | 90th Percentile (p90) | 95th Percentile (p95) | Max Duration | Failed Requests |
|-------------|-----|---------|---------|-------------|--------------|----------------------|----------------------|--------------|----------------|
| With Cache  | 50  | 1 min   | 8,224   | 247 ms      | 142 ms       | 639 ms               | 922 ms               | 2.62 s       | 12.5%          |
| Without Cache | 50 | 1 min   | 4,112   | 636 ms      | 541 ms       | 1.11 s               | 1.39 s               | 3.96 s       | 12.5%          |

## Academic Context

This project is the **Final Year Project (FYP)** of the  
**Bachelor of Computer Science (BCS)**, **University of Ruhuna, Sri Lanka**.

Focus: Applying **optimization algorithms to real-world dairy logistics** for efficiency and operational intelligence.

---
