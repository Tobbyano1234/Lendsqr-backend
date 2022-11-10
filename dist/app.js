"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./configs/db.config"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const accountRoute_1 = __importDefault(require("./routes/accountRoute"));
const transferRoute_1 = __importDefault(require("./routes/transferRoute"));
const withdrawalRoute_1 = __importDefault(require("./routes/withdrawalRoute"));
dotenv_1.default.config();
db_config_1.default.raw("SELECT VERSION()")
    .then((version) => console.log("MySQL Database is connected Successfully"))
    .catch((err) => {
    console.log(err);
    throw err;
});
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use("/api/v1/users", userRoute_1.default);
app.use("/api/v1/accounts", accountRoute_1.default);
app.use("/api/v1/transfers", transferRoute_1.default);
app.use("/api/v1/withdrawals", withdrawalRoute_1.default);
// catch 404 and forward to error handler
app.use(function (err, req, res, _next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
});
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
exports.default = app;
