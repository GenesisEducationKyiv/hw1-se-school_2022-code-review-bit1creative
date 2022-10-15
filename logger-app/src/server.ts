import App from './app';
import config from './config';
import { initAMQP } from './amqp';

const port = config.PORT;

App.listen(port, async () => {
  // asserting channels for logs
  await initAMQP();
  console.log(`⚡️[server]: Logger APP is running at http://localhost:${port}`);
});
