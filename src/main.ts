import { createApp } from './main.base';
import { ConfigService } from './modules/config/services/config.service';

async function dev() {
  const app = await createApp();
  const config = await app.get(ConfigService);

  await app.listen(config.API_PORT);
}

dev();
