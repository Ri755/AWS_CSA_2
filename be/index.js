const app = require("./app");
const { sequelize } = require("./config/sequelize");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed.");

    console.error(err);
  }
}

startServer();
