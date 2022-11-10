"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.walletSchema = exports.withdrawalHistorySchema = exports.transferAirtimeSchema = exports.createBankAccountSchema = exports.updateUserSchema = exports.changePasswordSchema = exports.generateLoginToken = exports.forgotPasswordSchema = exports.loginSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    bvn: joi_1.default.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    gender: joi_1.default.string().required(),
    dob: joi_1.default.date().required(),
    address: joi_1.default.string().required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirmPassword: joi_1.default.ref("password"),
    avatar: joi_1.default.string().required(),
    isVerified: joi_1.default.boolean().default(false),
}).with("password", "confirmPassword");
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
});
const generateLoginToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: "1d" });
};
exports.generateLoginToken = generateLoginToken;
exports.changePasswordSchema = joi_1.default.object()
    .keys({
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
})
    .with("password", "confirmPassword");
exports.updateUserSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    avatar: joi_1.default.string(),
});
exports.createBankAccountSchema = joi_1.default.object({
    bankName: joi_1.default.string().required(),
    accountName: joi_1.default.string().required(),
    accountNumber: joi_1.default.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
});
exports.transferAirtimeSchema = joi_1.default.object({
    network: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    amountTransfered: joi_1.default.number().min(100).required(),
    destinationPhoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
});
exports.withdrawalHistorySchema = joi_1.default.object({
    bankName: joi_1.default.string().required(),
    accountNumber: joi_1.default.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    amount: joi_1.default.number().required(),
    status: joi_1.default.string(),
});
exports.walletSchema = joi_1.default.object({
    completed: joi_1.default.boolean().required(),
    amount: joi_1.default.when("completed", {
        is: joi_1.default.boolean().valid(true),
        then: joi_1.default.number().required(),
        otherwise: joi_1.default.valid(null),
    }),
    email: joi_1.default.when("completed", {
        is: joi_1.default.boolean().valid(true),
        then: joi_1.default.string().email().required(),
        otherwise: joi_1.default.valid(null),
    }),
    transactionId: joi_1.default.string().required(),
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
