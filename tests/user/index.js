const request = require("supertest");

// user mock data
const mockUserData = {
  username: "abiodun",
  email: "abiodun@testdomain.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
};
describe("User should be able to log in and obtain JWT", () => {
  it("should login user and return jwt token", async () => {
    /** Creates a new user and save it to the database */
    await strapi.plugins["users-permissions"].services.user.add({
      ...mockUserData,
    });

    await request(strapi.server) // app server is an instance of Class: http.Server
      .post("/auth/local")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        identifier: mockUserData.email,
        password: mockUserData.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.jwt).toBeDefined();
      });
  });
});

describe("Authenticated user should be able to fetch their user data from /user/me", () => {
  it("should return users data for authenticated user", async () => {
    /** Gets the default user role */
    const defaultRole = await strapi
      .query("role", "users-permissions")
      .findOne({}, []);

    const role = defaultRole ? defaultRole.id : null;

    /** Creates a new user an push to database */
    const user = await strapi.plugins["users-permissions"].services.user.add({
      ...mockUserData,
      username: "tester2",
      email: "tester2@strapi.com",
      role,
    });

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
      id: user.id,
    });

    await request(strapi.server) // app server is an instance of Class: http.Server
      .get("/users/me")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + jwt)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.id).toBe(user.id);
        expect(data.body.username).toBe(user.username);
        expect(data.body.email).toBe(user.email);
      });
  });
});