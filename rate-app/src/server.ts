
import App from './app';
import config from './config';
const port = config.PORT;

App.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
