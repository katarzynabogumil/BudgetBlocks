export const environment = {
  production: false,
  auth0: {
    domain: 'dev-ghe8pl4wqgfyt6v0.eu.auth0.com',
    clientId: 'jpnppl8s71irhnSTdMlWqIo8vc0TicMD',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/callback',
    },
    errorPath: '/projects',
  },
  api: {
    serverUrl: 'http://localhost:6060',
  },
};
