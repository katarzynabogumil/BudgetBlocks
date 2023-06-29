import { csrfSync } from 'csrf-sync';
import { Response, Request, NextFunction } from 'express';

const {
  generateToken,
  csrfSynchronisedProtection,
  storeTokenInState,
  getTokenFromState
} = csrfSync({
  getTokenFromState: (req) => {
    return req.session.csrfToken;
  },
  getTokenFromRequest: (req) => {
    const headers = req.headers['BB-Xsrf-Header'];
    return typeof headers === 'object' ? headers[0] : headers;
  },
  storeTokenInState: (req, token) => {
    req.session.csrfToken = token;
  },
  size: 256,
});

function crsfMiddleware(req: Request, res: Response, next: NextFunction) {
  let syncedToken = getTokenFromState(req);

  if (syncedToken === undefined) {
    syncedToken = generateToken(req);
    storeTokenInState(req, syncedToken)
  }

  next();
}

function crsfController(req: Request, res: Response) {
  const csrfToken = getTokenFromState(req)
  res.status(200);
  res.send({ csrfToken: csrfToken });
}

export {
  csrfSynchronisedProtection,
  getTokenFromState,
  crsfMiddleware,
  crsfController
};