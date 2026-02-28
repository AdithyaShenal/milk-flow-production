export const ROUTING_KEYS = {
  DEPOT_LOCATION: "routing:depot:location",
  PENDING_PRODUCTIONS: "routing:productions:pending",
  AVAILABLE_TRUCKS: "routing:trucks:available",
};

export const FLEET_KEYS = {
  ALL_TRUCKS: "fleet:trucks:all",
  TRUCK_BY_ID: (id) => `fleet:truck:${id}`,
  TRUCK_BY_LICENSE: (license_no) => `fleet:truck:license:${license_no}`,
  TRUCKS_BY_ROUTE: (route) => `fleet:trucks:route:${route}`,
  SEARCH: (status, filterBy, search) =>
    `fleet:search:${status}:${filterBy}:${String(search).toLowerCase().trim()}`,
  SEARCH_PREFIX: "fleet:search:",
};

export const DRIVER_KEYS = {
  ALL_DRIVERS: "driver:all",
  DRIVER_BY_ID: (id) => `driver:${id}`,
  DRIVER_BY_LICENSE: (license_no) => `driver:license:${license_no}`,
  SEARCH: (status, filterBy, search) =>
    `driver:search:${status}:${filterBy}:${String(search).toLowerCase().trim()}`,
  SEARCH_PREFIX: "driver:search:",
};

export const FARMER_KEYS = {
  ALL_FARMERS: "farmer:all",
  FARMER_BY_ID: (id) => `farmer:${id}`,
  FARMER_BY_NAME: (name) => `farmer:name:${String(name).toLowerCase().trim()}`,
  FARMERS_BY_ROUTE: (route) => `farmer:route:${route}`,
  SEARCH: (route, filterBy, search) =>
    `farmer:search:${route}:${filterBy}:${String(search).toLowerCase().trim()}`,
  SEARCH_PREFIX: "farmer:search:",
};

export const PRODUCTION_KEYS = {
  PENDING_PRODUCTIONS: "routing:productions:pending",

  ALL_PENDING: "production:pending:all",
  TODAY_BY_FARMER: (farmer_id) => `production:today:${farmer_id}`,
  HISTORY_BY_FARMER: (farmer_id) => `production:history:${farmer_id}`,
  BY_FARMER_ID: (farmer_id) => `production:farmer:${farmer_id}`,
  BY_ROUTE: (route) => `production:route:${route}`,
  SEARCH: (status, filterBy, search, date) =>
    `production:search:${status}:${filterBy}:${String(search).toLowerCase().trim()}:${date}`,
  SEARCH_PREFIX: "production:search:",
};

export const TTL = {
  DEPOT_LOCATION: 60 * 60 * 24,
  PENDING_PRODUCTIONS: 60,
  AVAILABLE_TRUCKS: 60 * 2,

  ALL_TRUCKS: 60 * 5,
  TRUCK_DETAIL: 60 * 10,
  TRUCKS_BY_ROUTE: 60 * 5,
  FLEET_SEARCH: 60 * 2,

  ALL_DRIVERS: 60 * 5,
  DRIVER_DETAIL: 60 * 10,
  DRIVER_SEARCH: 60 * 2,

  ALL_FARMERS: 60 * 10,
  FARMER_DETAIL: 60 * 30,
  FARMERS_BY_ROUTE: 60 * 10,
  FARMER_SEARCH: 60 * 5,

  ALL_PENDING: 60,
  TODAY_PROD: 60 * 2,
  HISTORY_PROD: 60 * 5,
  PROD_BY_FARMER: 60 * 5,
  PROD_BY_ROUTE: 60 * 5,
  PRODUCTION_SEARCH: 60 * 2,
};
