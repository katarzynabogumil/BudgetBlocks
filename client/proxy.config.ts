const dotenv = require('dotenv');
dotenv.config();

exports.PROXY_CONFIG = {
  "/api/*": {
    "target": process.env['API_SERVER_URL'],
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/api": "" }
  }
};
