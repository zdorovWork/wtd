import "reflect-metadata";
import { createApp } from "./create-app";

const bootstrap = async () => {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3001);
};

void bootstrap();
