import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db from "./configs/db.config";
// import db from "./configs/knexfile";

dotenv.config();

db.raw("SELECT VERSION()")
  .then((version) => console.log("MySQL Database is connected Successfully"))
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    db.destroy();
  });

const PORT = process.env.PORT;

const app = express();
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// catch 404 and forward to error handler

app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
