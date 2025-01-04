import { Sequelize } from "sequelize";
import config from "../config/config.mjs";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${
    config.NODE_ENV == "test"
      ? config.test.SQLITE_DB
      : config.development.SQLITE_DB
  }`,
  logging: true, // Disable logging for production
});

export default sequelize;
