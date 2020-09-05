const envalid = require('envalid');

const rule = {
  AWS_PROFILE: envalid.str({ default: '' }),
  AWS_LAMBDA_NAME: envalid.str({ default: '' }),
  AWS_REGION: envalid.str({ default: 'us-east-1' }),
};

module.exports = envalid.cleanEnv(process.env, rule, { dotEnvPath: '.env', strict: true, });
