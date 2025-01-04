import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_ADMISSION_NUMBER: process.env.ADMIN_ADMISSION_NUMBER,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  test: {
    SQLITE_DB: process.env.SQLITE_DB_TEST,
  },
  development: {
    SQLITE_DB: process.env.SQLITE_DB_DEV,
  },
  production: {
    SQLITE_DB: process.env.SQLITE_DB_PROD,
  },
};

export default config;
