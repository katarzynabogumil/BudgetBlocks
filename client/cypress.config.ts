import { defineConfig } from "cypress";
import { seed, teardown, seedData } from '../server/prisma/e2eSeed';
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    apiUrl: "http://localhost:4200",
    coverage: true,
    codeCoverage: {
      url: "http://localhost:4200/__coverage__",
      exclude: "cypress/**/*.*",
    },
    auth0_domain: process.env['AUTH0_DOMAIN'],

    email: process.env['E2E_TEST_USER_1_EMAIL'],
    password: process.env['E2E_TEST_USER_1_PASSWORD'],
    sub: process.env['E2E_TEST_USER_1_SUB'],
    firstName: process.env['E2E_TEST_USER_1_FNAME'],
    nickname: process.env['E2E_TEST_USER_1_NICKNAME'],

    email2: process.env['E2E_TEST_USER_2_EMAIL'],
    password2: process.env['E2E_TEST_USER_2_PASSWORD'],
    sub2: process.env['E2E_TEST_USER_2_SUB'],
    firstName2: process.env['E2E_TEST_USER_2_FNAME'],
    nickname2: process.env['E2E_TEST_USER_2_NICKNAME'],

  },
  e2e: {
    baseUrl: "http://localhost:4200",
    // defaultCommandTimeout: 120000,
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async "db:seed"(data: seedData) {
          return seed(data);
        },
        async "db:teardown"(sub: string) {
          return teardown(sub);
        },
      });
    },
  },
});