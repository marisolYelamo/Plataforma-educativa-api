const roleSuite = require("./suites/roles/roles.integrations");
const createUsers = require("./suites/users/create-users.integration");

describe("User suites", () => {
  createUsers();
});

describe("Roles suites", () => {
  roleSuite();
});
