const request = require("supertest");
var FormData = require("form-data");
const { response } = require("express");
// user mock data
const mockUserData = {
  username: "abiodun",
  email: "abiodun@testdomain.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
};

describe("Access should be forbidden for un-authenticated users", () => {
  it("Creating a post by unauthenticated user shoild fail", async () => {
    /** Finds a user in the database with a username */
    const user = await strapi
      .query("user", "users-permissions")
      .findOne({ username: mockUserData.username });

    var formdata = new FormData();
    formdata.append(
      "data",
      `{\n"author":${user.id},\n"text":"A beautiful post!"\n}`
    );
    await request(strapi.server) // app server is an instance of Class: http.Server
      .post("/posts")
      .set("accept", "multipart/form-data")
      .set("Content-Type", "multipart/form-data")
      .attach(formdata)
      .expect("Content-Type", /json/)
      .expect(403)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.message).toBe("Forbidden");
      });
  });
});

describe("Access should be granted for authenticated users", () => {
  it("Authenticated User should be able to send a post", async () => {
    /** Gets the default user role */
    const defaultRole = await strapi
      .query("role", "users-permissions")
      .findOne({}, []);

    const role = defaultRole ? defaultRole.id : null;

    /** Finds a user in the database with a username */
    const user = await strapi.plugins["users-permissions"].services.user.add({
      username: "abiodun2",
      email: "abiodun2@testdomain.com",
      provider: "local",
      password: "1234abc",
      confirmed: true,
      blocked: null,
      role,
    });

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
      id: user.id,
    });

    var formdata = new FormData();
    formdata.append(
      "data",
      `{\n"author":${user.id},\n"text":"A beautiful second post!"\n}`
    );
    await request(strapi.server) // app server is an instance of Class: http.Server
      .post("/posts")
      .set("accept", "multipart/form-data")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", "Bearer " + jwt)
      .field(
        "data",
        `{\n"author":${user.id},\n"text":"A beautiful second post!"\n}`
      )
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.text).toBe("A beautiful second post!");
      });
  });
});

describe("Database should shut down after Running test Suite", () => {
  it("Database is shuting down", () => {
    const end = "Yes";
    expect(end).toBeDefined();
  });
});
