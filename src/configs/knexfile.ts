import type { Knex } from "knex";
require("dotenv").config();
import path from "path";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST || "sql7.freesqldatabase.com",
      port: Number(process.env.DB_PORT as string) || 3306,
      database: process.env.DB_NAME || "sql7544556",
      user: process.env.DB_USER || "sql7544556",
      password: process.env.DB_PASSWORD || "hQX3KRGDdi",
    },
    migrations: {
      directory: "/Users/decagon/Desktop/Lendsqr Backend/src/models",
    },
    useNullAsDefault: true,
  },

  test: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST || "sql7.freesqldatabase.com",
      port: Number(process.env.DB_PORT as string) || 3306,
      database: process.env.DB_NAME || "sql7544556",
      user: process.env.DB_USER || "sql7544556",
      password: process.env.DB_PASSWORD || "hQX3KRGDdi",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST || "sql7.freesqldatabase.com",
      port: Number(process.env.DB_PORT as string) || 3306,
      database: process.env.DB_NAME || "sql7544556",
      user: process.env.DB_USER || "sql7544556",
      password: process.env.DB_PASSWORD || "hQX3KRGDdi",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
