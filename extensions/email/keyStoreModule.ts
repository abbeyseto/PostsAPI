const aws = require("aws-sdk");

const ssm = new aws.SSM();

interface ParameterInterface {
  Name: string;
  WithDecryption: Boolean;
}
/**
 * This module connects to stored secrets and keys using Parameter Store provided by Systems Manager in AWS.
 * The lambda decrypts these encrypted keys for use in function calls
 * @returns {string}
 */
module.exports.getAWSAccountId = async function getAWSAccountId(): Promise<string> {
  const params: ParameterInterface = {
    Name: "AccountId",
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports.getMailgunAPIKey = async function getMailgunAPIKey(): Promise<string> {
  const params: ParameterInterface = {
    Name: "MAILGUN_API_KEY",
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports.getMailgunDomain = async function getMailgunDomain(): Promise<string> {
  const params: ParameterInterface = {
    Name: "MAILGUN_DOMAIN",
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};
