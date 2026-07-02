const serverless = require("serverless-http");

const app = require("./app");

const { sequelize } = require("./config/sequelize");

let initialized = false;

async function initialize() {
  if (initialized) return;

  await sequelize.authenticate();

  console.log("Database Connected");

  initialized = true;
}

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  await initialize();

  return handler(event, context);
};
