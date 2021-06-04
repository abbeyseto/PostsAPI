const aws = require("aws-sdk");
aws.config.update({region:'us-east-2'});
const ssm = new aws.SSM();

/**
 * This module connects to stored secrets and keys using Parameter Store provided by Systems Manager in AWS.
 * The lambda decrypts these encrypted keys for use in function calls
 * @returns {string}
 */
module.exports.getAWSAccountId = async function getAWSAccountId() {
  const params = {
    Name: "AccountId",
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports.getMailgunAPIKey = async function getMailgunAPIKey() {
  const params = {
    Name: "MAILGUN_API_KEY",
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports.getMailgunDomain = async function getMailgunDomain() {
  const params = {
    Name: "MAILGUN_DOMAIN",
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};
