export type AppConfig = {
  databaseUrl: string;
};

export const APP_CONFIG = "APP_CONFIG";

export const loadConfig = (): AppConfig => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
  }

  return { databaseUrl };
};

export const sslFor = (
  databaseUrl: string,
): false | { rejectUnauthorized: boolean } => {
  const isLocal =
    databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");
  if (isLocal) return false;

  return { rejectUnauthorized: false };
};
