import { getRedisClient } from "../lib/redisClient.js";

export const cacheGet = async (key) => {
  const redis = getRedisClient();
  const data = await redis.get(String(key));
  return data ? JSON.parse(data) : null;
};

export const cacheSet = async (key, value, ttl = 60) => {
  const redis = getRedisClient();
  await redis.set(String(key), JSON.stringify(value), { EX: Number(ttl) });
};

export const cacheDel = async (key) => {
  if (key === undefined || key === null) return;
  const redis = getRedisClient();
  console.log("Cache Key Deleted", key);
  await redis.del(String(key));
};

export const delByPrefix = async (prefix) => {
  const redis = getRedisClient();

  for await (const keysBatch of redis.scanIterator({
    MATCH: `${prefix}*`,
    COUNT: 100,
  })) {
    for (const key of keysBatch) {
      await redis.del(String(key));
    }
  }
};
