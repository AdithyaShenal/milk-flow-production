import { createClient } from "redis";

let redisClient;

const url = process.env.REDIS_URL;

export const initRedis = async () => {
  redisClient = createClient({ url });
  await redisClient.connect();
  console.log(`Redis cache connected: ${url}`);
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis not initialized");
  }
  return redisClient;
};
