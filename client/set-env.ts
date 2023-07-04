import { writeFile } from 'fs';
import { promisify } from 'util';
import * as dotenv from "dotenv";

dotenv.config();

const writeFilePromisified = promisify(writeFile);

const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: false,
  auth0: {
    domain: '${process.env['AUTH0_DOMAIN']}',
    clientId: '${process.env['AUTH0_CLIENT_ID']}',
    authorizationParams: {
      redirect_uri: '${process.env['AUTH0_CALLBACK_URL']}',
      audience: '${process.env['AUTH0_AUDIENCE']}',
    },
    errorPath: '/projects',
  },
  api: {
    serverUrl: '${process.env['API_SERVER_URL']}',
  },
  httpInterceptor: {
    allowedList: ['${process.env['API_SERVER_URL']}/*'],
  },
};
`;

(async () => {
  try {
    await writeFilePromisified(targetPath, envConfigFile);
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
