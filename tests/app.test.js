const fs = require("fs");
const { setupStrapi } = require("./helpers/strapi");

// Setting timeout because sometimes bootstrap can take 15-50 seconds (big apps)
jest.setTimeout(120000);
/** this code is called once before any test is called */
beforeAll(async () => {
  await setupStrapi(); // singleton so it can be called many times
});

/** this code is called once before all the tested are finished */
afterAll(async () => {
  const dbSettings = strapi.config.get("database.connections.default.settings");

  //delete test database after all tests
  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

describe("Server instance should be active and reacheable", () => {
  it("Post API server is defined and running", () => {
    expect(strapi).toBeDefined();
  });
});

require("./user");
require("./posts");
