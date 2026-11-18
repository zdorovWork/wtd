import { Global, Module } from "@nestjs/common";
import { APP_CONFIG, loadConfig } from "./config";
import { PostgresService } from "./postgres";

@Global()
@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: loadConfig,
    },
    {
      provide: PostgresService,
      inject: [APP_CONFIG],
      useFactory: (config: ReturnType<typeof loadConfig>) =>
        new PostgresService(config),
    },
  ],
  exports: [PostgresService],
})
export class PostgresModule {}
