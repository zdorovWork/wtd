import { cacheLife } from "next/cache";
import { connection } from "next/server";

const readServerUrl = (): string => {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    throw new Error("SERVER_URL is missing");
  }

  return serverUrl;
};

export const fetchServerApi = async (path: string): Promise<Response> => {
  await connection();

  return fetch(new URL(path, readServerUrl()));
};

export type CachedApiResult = {
  status: number;
  body: unknown;
};

export const fetchCachedServerApi = async (
  path: string,
): Promise<CachedApiResult> => {
  "use cache";
  cacheLife("hours");

  const response = await fetch(new URL(path, readServerUrl()));
  const body: unknown = await response.json();

  return { status: response.status, body };
};
