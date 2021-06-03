const _ = require("lodash")

/**
   * Setting permissions
   */

 const setUsersRolePermission = async () => {
    const service = await strapi.plugins["users-permissions"].services.userspermissions;
    const plugins = await service.getPlugins("en");

    /** @type Role[] */
    const roles = await service.getRoles();

    /**
     * @param {Role["type"]} type
     */
    const getRole = async (type) => {
      const {id} = _.find(roles, x => x.type === type);
      return service.getRole(id, plugins);
    }

    /**
     * @param {Role} role
     * @param {PluginPermissionKey} type
     * @param {string} controller
     * @param {string} action
     * @param {boolean} enabled
     */
    const setPermission = (role, type, controller, action, enabled) => {
      try {
        role.permissions[type].controllers[controller][action].enabled = enabled;
        console.log(`Permission is set for ${role.name} users on ${controller}:${action} as ${enabled}`)
      }
      catch (e) {
        console.error(`Couldn't set permission ${role.name} ${type}:${controller}:${action}:${enabled}`);
      }
    }

    /**
     * Setting roles and permissions for Authenticated users
     */
     const userRole = await getRole("authenticated");

     console.log('*****Starting Clients Roles & Permissions*****')

     setPermission(userRole, "application", "post", "find", true);
     setPermission(userRole, "application", "post", "findone", true);
     setPermission(userRole, "application", "post", "create", true);
     setPermission(userRole, "application", "post", "count", true);
     setPermission(userRole, "application", "post", "delete", true);
     setPermission(userRole, "application", "post", "update", true);
     setPermission(userRole, "application", "post", "like", true);

     setPermission(userRole, "application", "replies", "find", true);
     setPermission(userRole, "application", "replies", "findone", true);
     setPermission(userRole, "application", "replies", "create", true);
     setPermission(userRole, "application", "replies", "count", true);
     setPermission(userRole, "application", "replies", "delete", true);
     setPermission(userRole, "application", "replies", "update", true);

     setPermission(userRole, "email", "email", "send", true);

     setPermission(userRole, "upload", "upload", "upload", true);

     setPermission(userRole, "users-permissions", "auth", "connect", true);
     setPermission(userRole, "users-permissions", "user", "me", true);
     setPermission(userRole, "users-permissions", "user", "update", true);

     await service.updateRole(userRole.id, userRole);
    console.log('***** Finished setting Roles and Permissions *****')
    return;
  };


module.exports = setUsersRolePermission;
