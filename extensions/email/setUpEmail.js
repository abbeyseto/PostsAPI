const os = require("os");

const sendSetup = async () => {
  let entity = {};

  entity["platform"] = os.platform();
  entity["type"] = os.type();
  entity["time"] = new Date();
  entity["host"] = os.hostname();
  entity["domain"] = strapi.config.get("server.host", null);
  entity["port"] = strapi.config.get("server.port", null);
  // send an email by using the email plugin
  try {
    let sent = await strapi.plugins["email"].services.email.send({
      to: "adenleabbey@hotmail.com",
      from: "admin@strapi.io",
      subject: "NOTIFICATION FROM POSTAPI",
      text: `
        Project is up and running.
        Comment: Here are the details
        Platform: ${entity.platform}
        Type: ${entity.type}
        Time Started: ${entity.time}
        Host: ${entity.host}
        Domain: ${entity.domain}
        Port: ${entity.port}
      `,
    });
    if (sent) {
      console.log(sent);
    }
  } catch (error) {
    console.error("Email not properly configured");
    console.error(error);
  }
};

module.exports = sendSetup;
