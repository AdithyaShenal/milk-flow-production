# 🥛 MilkFlow – Production Deployment Repository

**MilkFlow** – An Intelligent Dairy Supply Chain & VRP-Based Route Optimization System

---

## 📌 Overview

This repository contains the **final production deployment** of the MilkFlow system, integrating **all services** into a unified platform.

MilkFlow is designed to:

- Optimize milk collection routes using **VRP algorithms**
- Digitize farmer and driver operations
- Provide real-time operational visibility for administrators
- Improve logistics efficiency and reduce operational costs

This repository includes the **backend, optimization engine, web dashboard, and mobile applications**.

---

## 🏗️ System Architecture

            ┌─────────────────────────┐
            │   Admin Web Dashboard   │
            │       (React)           │
            └────────────┬────────────┘
                         │ REST API
                         ▼
            ┌─────────────────────────┐
            │     Main Backend API    │
            │   (Node.js + Express)   │
            └────────────┬────────────┘
                         │ Secure API
                         ▼
            ┌─────────────────────────┐
            │  VRP Optimization API   │
            │    (Spring Boot)        │
            └─────────────────────────┘

    ▲                              ▲
    │                              │
    │ REST API                     │ REST API
    │                              │

---

## 🧩 System Components

### 1️⃣ Main Backend Service
- **Technology:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- Handles:
  - Supply chain and production data
  - User authentication & roles
  - Route coordination
  - Integration with VRP engine

### 2️⃣ VRP Optimization Service
- **Technology:** Spring Boot
- Handles:
  - Vehicle Routing Problem (VRP) algorithms
  - Depot-based route optimization
  - Capacity and distance constraints

### 3️⃣ Admin Web Dashboard
- **Technology:** React
- Provides:
  - Operational analytics
  - Route visualization
  - Production monitoring
  - User management

### 4️⃣ Farmer Mobile Application
- **Technology:** React + Capacitor
- Features:
  - Production submissions
  - Collection tracking
  - Notifications

### 5️⃣ Driver Mobile Application
- **Technology:** React + Capacitor
- Features:
  - Assigned route visualization
  - Delivery tracking
  - Status updates

---

## 🚀 Deployment Architecture

This repository includes:

- All service configurations
- Environment-based configuration management
- Docker-based containerization
- Reverse proxy setup (if applicable)
- Production-ready environment variables

---

## 📦 Mobile Application Builds

**APKs for Android:**  
[Google Drive Link](https://drive.google.com/drive/folders/1MHDMqMoZ-yUtba8vVB5KJJG9Pbi-AwPr?usp=sharing)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Optimization Engine | Spring Boot |
| Database | MongoDB |
| Cache | Redis |
| Web Frontend | React |
| Mobile Apps | React + Capacitor |
| API Communication | REST |
| Deployment | Docker / Cloud VM |

---

## 🔐 Core Capabilities

- VRP-based route optimization
- Role-based access control
- Real-time production data management
- Distributed service communication
- Scalable microservice architecture
- Secure API integration

---

## 🎓 Academic Context

This project is the **Final Year Project (FYP)** of the  
**Bachelor of Computer Science (BCS)**, **University of Ruhuna, Sri Lanka**.

Focus: Applying **optimization algorithms to real-world dairy logistics** for efficiency and operational intelligence.

---

## 📜 License

This project is developed for **academic and research purposes**.
