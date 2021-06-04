"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */
const setup = require("../../extensions/email/setUpEmail");
const setUsersRolePermission = require("./permissionSettings");

module.exports = () => {
  /**
   * Calling the functions below to programmatically set users permission
   * based on the route you want users to have access to, if this code is commented out
   * permissions will not be set.
   */
  setUsersRolePermission();
  // setup();
};
