import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    fixturesFolder: 'fixtures',
    setupNodeEvents(on, config) {},
    baseUrl:
      'http://127.0.0.1:3000',
  },
});
