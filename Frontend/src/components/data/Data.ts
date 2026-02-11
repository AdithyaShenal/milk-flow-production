export type RouteId = "R1" | "R2" | "R3" | "R4" | "R5" | "R6";

export type WeeklyPoint = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  value: number;
};

export type RouteWeeklyDistance = {
  route: RouteId;
  weekly: WeeklyPoint[];
};

export type RouteRow = {
  routeNo: RouteId;
  truckNo: string;
  truckId: string;
  driverName: string;
  totalStops: number;
  coveredStops: number;
  status: "Not Started" | "In Progress" | "Finished";
};

export const summaryData = {
  milkCollectedTodayLiters: 1240,
  milkVsYesterdayPercent: 12,

  pendingRequestsToday: 23,
  pendingRequestsNote: "Needs assignment",

  driversAvailableToday: 14,
  driversOnRoute: 2,

  trucksAvailableToday: 7,
  trucksInMaintenance: 1,
};

export const milkWeekly = [
  { day: "Mon", value: 1200 },
  { day: "Tue", value: 1400 },
  { day: "Wed", value: 1100 },
  { day: "Thu", value: 1650 },
  { day: "Fri", value: 1550 },
  { day: "Sat", value: 1750 },
  { day: "Sun", value: 1820 },
];

export const milkWeeklyLastWeek = [
  { day: "Mon", value: 1000 },
  { day: "Tue", value: 1280 },
  { day: "Wed", value: 980 },
  { day: "Thu", value: 1500 },
  { day: "Fri", value: 1420 },
  { day: "Sat", value: 1600 },
  { day: "Sun", value: 1700 },
];

export const distanceByRouteWeekly: RouteWeeklyDistance[] = [
  {
    route: "R1",
    weekly: [
      { day: "Mon", value: 80 },
      { day: "Tue", value: 90 },
      { day: "Wed", value: 70 },
      { day: "Thu", value: 95 },
      { day: "Fri", value: 85 },
      { day: "Sat", value: 110 },
      { day: "Sun", value: 120 },
    ],
  },
  {
    route: "R2",
    weekly: [
      { day: "Mon", value: 60 },
      { day: "Tue", value: 75 },
      { day: "Wed", value: 68 },
      { day: "Thu", value: 80 },
      { day: "Fri", value: 72 },
      { day: "Sat", value: 90 },
      { day: "Sun", value: 95 },
    ],
  },
  {
    route: "R3",
    weekly: [
      { day: "Mon", value: 55 },
      { day: "Tue", value: 62 },
      { day: "Wed", value: 50 },
      { day: "Thu", value: 70 },
      { day: "Fri", value: 66 },
      { day: "Sat", value: 78 },
      { day: "Sun", value: 85 },
    ],
  },
  {
    route: "R4",
    weekly: [
      { day: "Mon", value: 90 },
      { day: "Tue", value: 98 },
      { day: "Wed", value: 88 },
      { day: "Thu", value: 105 },
      { day: "Fri", value: 100 },
      { day: "Sat", value: 118 },
      { day: "Sun", value: 130 },
    ],
  },
  {
    route: "R5",
    weekly: [
      { day: "Mon", value: 40 },
      { day: "Tue", value: 52 },
      { day: "Wed", value: 45 },
      { day: "Thu", value: 58 },
      { day: "Fri", value: 55 },
      { day: "Sat", value: 63 },
      { day: "Sun", value: 70 },
    ],
  },
  {
    route: "R6",
    weekly: [
      { day: "Mon", value: 75 },
      { day: "Tue", value: 80 },
      { day: "Wed", value: 74 },
      { day: "Thu", value: 88 },
      { day: "Fri", value: 82 },
      { day: "Sat", value: 96 },
      { day: "Sun", value: 105 },
    ],
  },
];

export const routesTableData: RouteRow[] = [
  {
    routeNo: "R1",
    truckNo: "T-04",
    truckId: "TRK-004",
    driverName: "Nimal Perera",
    totalStops: 8,
    coveredStops: 0,
    status: "Not Started",
  },
  {
    routeNo: "R2",
    truckNo: "T-01",
    truckId: "TRK-001",
    driverName: "Suresh Kumara",
    totalStops: 6,
    coveredStops: 3,
    status: "In Progress",
  },
  {
    routeNo: "R3",
    truckNo: "T-03",
    truckId: "TRK-003",
    driverName: "Kasun Wijesinghe",
    totalStops: 7,
    coveredStops: 7,
    status: "Finished",
  },
];

export const farmersPieData = {
  totalRegisteredFarmers: 220,
  farmersSentRequestToday: 36,
};
