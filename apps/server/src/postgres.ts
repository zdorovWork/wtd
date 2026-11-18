import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { Pool } from "pg";
import { type AppConfig, sslFor } from "./config";

@Injectable()
export class PostgresService implements OnModuleDestroy {
  readonly pool: Pool;

  constructor(config: AppConfig) {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: sslFor(config.databaseUrl),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
