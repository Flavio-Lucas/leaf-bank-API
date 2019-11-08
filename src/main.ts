import { createApp } from './main.base';

async function dev() {
  const app = await createApp();

  await app.listen(3000);
}

dev();
