export const environment = {
  production: false,
  auth0: {
    domain: 'domain-name.eu.auth0.com',
    clientId: '',
    authorizationParams: {
      redirect_uri: 'http://domain-name/callback',
      audience: 'Audience-name-or-url',
    },
    errorPath: '/projects',
  },
  api: {
    serverUrl: 'http://host:port',
  },
  httpInterceptor: {
    allowedList: ['http://host:port'],
  },
};