import Production from "./production.model.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function isExistsTodayProd(farmer_id) {
  const tz = "Asia/Colombo";
  const startOfDay = dayjs().tz(tz).startOf("day").utc().toDate();
  const endOfDay = dayjs().tz(tz).endOf("day").utc().toDate();

  const existing = await Production.findOne({
    "farmer._id": farmer_id,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  return existing;
}

export async function submit(data) {
  const production = new Production(data);
  return await production.save();
}

export async function findAllPending() {
  return await Production.find({ status: "pending", blocked: false }).sort({
    registration_time: -1,
  });
}

export async function findById(id) {
  return Production.findById(id);
}

export async function updateStatus(id, blocked) {
  return Production.findByIdAndUpdate(id, { blocked }, { new: true });
}

export async function findByFarmerId(farmer_id) {
  return await Production.find({ farmer_id }).sort({ registration_time: -1 });
}

export async function findByRoute(route) {
  return await Production.find({ route }).sort({ registration_time: -1 });
}
