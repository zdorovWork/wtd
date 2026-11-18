import { loadConfig } from "./config";

describe("loadConfig", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
      return;
    }

    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("throws a clear error when DATABASE_URL is missing", () => {
    delete process.env.DATABASE_URL;

    expect(() => loadConfig()).toThrow("DATABASE_URL is missing");
  });

  it("returns the database URL when it is set", () => {
    process.env.DATABASE_URL = "postgres://wtd:wtd@localhost:5432/wtd";

    expect(loadConfig()).toEqual({
      databaseUrl: "postgres://wtd:wtd@localhost:5432/wtd",
    });
  });
});
