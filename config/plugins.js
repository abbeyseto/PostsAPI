const {
  getMailgunAPIKey,
  getMailgunDomain,
  defaultEmail,
} = require("../extensions/email/keyStoreModule.ts");

module.exports = async ({ env }) => {
  const apiKey = await getMailgunAPIKey();
  const apiDomain = await getMailgunDomain();
  const email = await defaultEmail();
  return {
    email: {
      provider: "mailgun",
      providerOptions: {
        apiKey: env("MAILGUN_API_KEY" || apiKey),
        domain: env("MAILGUN_DOMAIN" || apiDomain), //Required if you have an account with multiple domains
      },
      settings: {
        defaultFrom: env("EMAIL_FROM" || email),
        defaultReplyTo: env("EMAIL_REPLY_TO" || email),
      },
    },
  };
};
