export const SKYFIRE_API_KEY = process.env.SKYFIRE_API_KEY || "";

export const SKYFIRE_ENV =
  (process.env.SKYFIRE_ENV as ENV_TYPES) || "production";
