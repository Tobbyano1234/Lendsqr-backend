import { Request, Response, NextFunction } from "express";
import {
  options,
  userSchema,
  loginSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  updateUserSchema,
  createBankAccountSchema,
  transferAirtimeSchema,
  withdrawalHistorySchema,
  walletSchema,
} from "../utils/utils";

export const validateSignupUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateUser = userSchema.validate(req.body, options);
  if (validateUser.error) {
    return res.status(400).json({
      status: 400,
      message: validateUser.error.details[0].message,
    });
  }
  next();
};

export const validateLoginUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = loginSchema.validate(req.body, options);
  if (validateResult.error) {
    return res
      .status(400)
      .json({ message: validateResult.error.details[0].message });
  }
  next();
};

export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = forgotPasswordSchema.validate(req.body, options);
  if (validateResult.error) {
    return res
      .status(400)
      .json({ message: validateResult.error.details[0].message });
  }
  next();
};

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = changePasswordSchema.validate(req.body, options);
  if (validateResult.error) {
    return res.status(400).json({
      message: validateResult.error.details[0].message,
    });
  }
  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateUser = updateUserSchema.validate(req.body, options);
  if (validateUser.error) {
    return res.status(400).json({
      message: validateUser.error.details[0].message,
    });
  }
  next();
};

export const validateCreateBankAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = createBankAccountSchema.validate(req.body, options);
  if (validateResult.error) {
    return res
      .status(400)
      .json({ message: validateResult.error.details[0].message });
  }
  next();
};

export const validateTransfer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateInput = transferAirtimeSchema.validate(req.body, options);
  if (validateInput.error) {
    return res
      .status(400)
      .json({ status: 400, message: validateInput.error.details[0].message });
  }
  next();
};

export const validatewithdrawal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateUser = withdrawalHistorySchema.validate(req.body, options);
  if (validateUser.error) {
    return res.status(400).json({
      status: 400,
      message: validateUser.error.details[0].message,
    });
  }
  next();
};

export const validateWallet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateWallet = walletSchema.validate(req.body, options);
  if (validateWallet.error) {
    return res.status(400).json({
      status: 400,
      message: validateWallet.error.details[0].message,
    });
  }
  next();
};
