// // Update with your config settings.

// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
// // module.exports = {
// //   development: {
// //     client: "sqlite3",
// //     connection: {
// //       filename: "./dev.sqlite3",
// //     },
// //   },
// // };
// import knex from "knex";
// import dotenv from "dotenv";
// dotenv.config();
// const options = {
//   client: "mysql",
//   connection: {
//     host: process.env.DB_HOST || "sql7.freesqldatabase.com",
//     port: process.env.DB_PORT || 3306,
//     database: process.env.DB_NAME || "sql7544556",
//     user: process.env.DB_USER || "sql7544556",
//     password: process.env.DB_PASSWORD || "hQX3KRGDdi",
//   },
//   migrations: {
//     tableName: "knex_migrations",
//   },
//   useNullAsDefault: true,
// };

// const db = knex(options);

// export default db;
