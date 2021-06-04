const os = require("os");
var express = require("express");
var Mailgun = require("mailgun-js");
var app = express();

const { getMailgunAPIKey, getMailgunDomain, defaultEmail } = require("./keyStoreModule.ts");

const sendSetup = async () => {
  const apiKey = await getMailgunAPIKey();
  const apiDomain = await getMailgunDomain();
  const email = await defaultEmail();

  var mailgun = new Mailgun({
    apiKey: apiKey,
    domain: apiDomain,
  });

  let entity = {};

  entity["platform"] = os.platform();
  entity["type"] = os.type();
  entity["time"] = new Date();
  entity["host"] = os.hostname();
  entity["domain"] = strapi.config.get("server.host", null);
  entity["port"] = strapi.config.get("server.port", null);

  let message = {
    to: "adenleabbey@hotmail.com",
    from: process.env.EMAIL_FROM || email,
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
  };
  //Invokes the method to send emails given the above data with the helper library
  mailgun.messages().send(message, function (err, body) {
    //If there is an error, render the error page
    if (err) {
      console.log("got an error: ", err);
    } else {
      console.log("ok");
    }
  });
};

module.exports = sendSetup;
