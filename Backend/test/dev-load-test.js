import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 50, // 50 virtual users
  duration: "1m", // 1 minute test
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.1"],
  },
};

export default function () {
  // Production endpoints
  http.get("https://localhost:5000/api/production"); // Get all productions
  http.get("https://localhost:5000/api/production/pending/all"); // Get pending productions

  // Fleet endpoints
  http.get("https://localhost:5000/api/fleet"); // Get all trucks

  // Farmer endpoints
  http.get("https://localhost:5000/api/farmer"); // Get all farmers

  // Driver endpoints
  http.get("https://localhost:5000/api/driver"); // Get all drivers

  // Config endpoints
  http.get("https://localhost:5000/api/config");
  http.get("https://localhost:5000/api/config/depotLocation");

  // Analytics endpoints
  http.get("https://localhost:5000/api/analytics/mini_dashboard");

  sleep(1);
}
