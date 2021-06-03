const os = require('os');

const sendSetup = async () => {
  let entity={};

  entity['platform'] = os.platform()
  entity['type']= os.type()
  entity['time']= new Date()
  entity['host']= os.hostname()


  // send an email by using the email plugin
  await strapi.plugins["email"].services.email.send({
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
      `,
  });
};

module.exports = sendSetup;
