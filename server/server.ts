import { app } from './index';
import debug from 'debug';
const log = debug('app:log');

const PORT = parseInt(process.env.PORT || '', 10);

app.listen(PORT, () => {
  log(`DEBUG Server running at ${PORT}`);
});
