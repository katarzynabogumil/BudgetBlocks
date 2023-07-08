const { writeFile } = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');

dotenv.config();

const writeFilePromisified = promisify(writeFile);

const production = process.env['NODE_ENV'] !== 'development';
const targetPath = production ? './src/environments/environment.prod.ts' : './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: ${production},
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
