import Joi from "joi";
import jwt from "jsonwebtoken";

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  bvn: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  gender: Joi.string().required(),
  dob: Joi.date().required(),
  address: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirmPassword: Joi.ref("password"),
  avatar: Joi.string().required(),
  isVerified: Joi.boolean().default(false),
}).with("password", "confirmPassword");

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const generateLoginToken = (user: {
  [key: string]: unknown;
}): string => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: "1d" });
};

export const changePasswordSchema = Joi.object()
  .keys({
    password: Joi.string().required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  })
  .with("password", "confirmPassword");

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  avatar: Joi.string(),
});

export const createBankAccountSchema = Joi.object({
  bankName: Joi.string().required(),
  accountName: Joi.string().required(),
  accountNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
});

export const transferAirtimeSchema = Joi.object({
  network: Joi.string().required(),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  amountTransfered: Joi.number().min(100).required(),
  destinationPhoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
});
export const withdrawalHistorySchema = Joi.object({
  bankName: Joi.string().required(),
  accountNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  amount: Joi.number().required(),
  status: Joi.string(),
});

export const walletSchema = Joi.object({
  completed: Joi.boolean().required(),
  amount: Joi.when("completed", {
    is: Joi.boolean().valid(true),
    then: Joi.number().required(),
    otherwise: Joi.valid(null),
  }),
  email: Joi.when("completed", {
    is: Joi.boolean().valid(true),
    then: Joi.string().email().required(),
    otherwise: Joi.valid(null),
  }),
  transactionId: Joi.string().required(),
});

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
