"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const environment = process.env.ENVIRONMENT || "development";
const knexfile_1 = __importDefault(require("../configs/knexfile"));
const db = (0, knex_1.default)(knexfile_1.default["development"]);
exports.default = db;
// // const db = mysql.createConnection({
// //   host: process.env.DB_HOST,
// //   port: process.env.DB_PORT as unknown as number,
// //   user: process.env.DB_USERNAME,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASSWORD,
// //   multipleStatements: true,
// // });
// // const db = mysql.createConnection({
// //   host: "sql7.freesqldatabase.com",
// //   port: 3306,
// //   user: "sql7544556",
// //   database: "sql7544556",
// //   password: "hQX3KRGDdi",
// //   multipleStatements: true,
// // });
// import knex from "knex";
// // const db = require("knex")({
// const knexDb = knex({
//   client: "mysql",
//   connection: {
//     host: "sql7.freesqldatabase.com",
//     port: 3306,
//     user: "sql7544556",
//     password: "hQX3KRGDdi",
//     database: "sql7544556",
//   },
// });
// // const DB = knexDb.schema
// //   .createTable("users", (table) => {
// //     table.increments("id");
// //     table.string("name");
// //     table.integer("price");
// //   })
// //   .then(() => {
// //     console.log("User table created");
// //     console.log("MySQL Database is connected Successfully");
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //     throw err;
// //   })
// //   .finally(() => {
// //     knexDb.destroy();
// //   });
// const DB = knexDb
//   .raw("SELECT VERSION()")
//   .then((version) => console.log("MySQL Database is connected Successfully"))
//   .catch((err) => {
//     console.log(err);
//     throw err;
//   })
//   .finally(() => {
//     knexDb.destroy();
//   });
// export default DB;
// import knex from "knex";
// import config from "../../knexfile";
// const db = knex(config)[process.env.NODE_ENV];
// export default db;
