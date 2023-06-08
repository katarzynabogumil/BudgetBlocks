export const environment = {
  production: false,
  auth0: {
    domain: '',
    clientId: '',
    authorizationParams: {
      redirect_uri: '',
      audience: '',
    },
    errorPath: '/projects',
  },
  api: {
    serverUrl: '',
  },
  httpInterceptor: {
    allowedList: [''],
  },
};
