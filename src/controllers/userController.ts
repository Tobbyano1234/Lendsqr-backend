import { Request, Response, NextFunction } from "express";
import db from "../configs/db.config";
import {
  errorResponse,
  serverError,
  successResponse,
  successResponseLogin,
} from "../utils/helperMethods";
import { v4 as uuid } from "uuid";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { User } from "../utils/types/userInterface";
import { generateLoginToken } from "../utils/utils";
import { emailVerificationView } from "../mail/emailTemplate";
import { sendEmail } from "../mail/sendMail";
import { uploadImage } from "../utils/cloudinary";
import jwt from "jsonwebtoken";
import { forgotPasswordVerification } from "../mail/forgotPasswordVerification";
import { validateBvn } from "../utils/flutterwaveRequest";

const fromUser = process.env.FROM as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

interface jwtPayload {
  id: string;
  email: string;
}

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = uuid();
    const {
      firstName,
      lastName,
      dob,
      gender,
      email,
      bvn,
      phoneNumber,
      address,
      password,
    } = req.body;

    const duplicateEmail = await db<User>("users")
      .select("email")
      .where("email", req.body.email)
      .first();

    if (duplicateEmail) {
      return errorResponse(res, "Email already exists", httpStatus.CONFLICT);
    }

    const duplicatePhoneNumber = await db<User>("users")
      .select("phoneNumber")
      .where("phoneNumber", phoneNumber)
      .first();

    if (duplicatePhoneNumber) {
      return errorResponse(
        res,
        "Phone number already exists",
        httpStatus.CONFLICT
      );
    }

    // const checkBvn = await validateBvn({ bvn: bvn });
    // console.log(checkBvn);
    // if (checkBvn?.status === "error") {
    //   return errorResponse(res, `${checkBvn.message}`, httpStatus.BAD_REQUEST);
    // }

    // if (
    //   checkBvn?.data?.phone_number !== phoneNumber &&
    //   checkBvn?.data?.date_of_birth !== dob
    // ) {
    //   return errorResponse(
    //     res,
    //     `Enter your correct bvn`,
    //     httpStatus.BAD_REQUEST
    //   );
    // }
    const hashPassword = await bcrypt.hash(password, 10);

    const avatarUrl = (await uploadImage(req.body.avatar)) as string;

    const user = {
      id: userId,
      firstName,
      lastName,
      dob,
      gender,
      email,
      bvn,
      phoneNumber,
      address,
      avatar: avatarUrl,
      password: hashPassword,
    };
    const record = await db<User>("users").insert(user);

    const updatedRecord = (await db<User>("users")
      .select(
        "id",
        "firstName",
        "lastName",
        "dob",
        "gender",
        "email",
        "bvn",
        "phoneNumber",
        "address",
        "avatar",
        "wallet"
      )
      .where("id", userId)
      .first()) as unknown as { [key: string]: string };

    const token = generateLoginToken({ userId, email });
    if (record) {
      const html = emailVerificationView(token);
      await sendEmail(
        fromUser,
        req.body.email,
        "Please verify your email",
        html
      );
    }
    return successResponse(
      res,
      "User created successfully",
      httpStatus.CREATED,
      { token, updatedRecord }
    );
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};

export const VerifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;

    const { email, id } = jwt.verify(token, JWT_SECRET) as jwtPayload;

    if (!email) {
      return errorResponse(res, "Verification failed", httpStatus.BAD_REQUEST);
    } else {
      const updated = await db<User>("users")
        .where("email", email)
        .update({ isVerified: true });
      if (updated) {
        const record = (await db<User>("users")
          .select(
            "id",
            "firstName",
            "lastName",
            "dob",
            "gender",
            "email",
            "bvn",
            "phoneNumber",
            "address",
            "avatar",
            "wallet",
            "isVerified"
          )
          .where("email", email)
          .first()) as unknown as { [key: string]: string };
        return successResponse(
          res,
          "User verified successfully",
          httpStatus.CREATED,
          {
            record,
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const LoginUser = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  try {
    const { email, password } = req.body;
    const user = (await db<User>("users")
      .select("*")
      .where("email", email)
      .first()) as unknown as { [key: string]: string };
    const loggedInUser = (await db<User>("users")
      .select(
        "id",
        "firstName",
        "lastName",
        "dob",
        "gender",
        "email",
        "bvn",
        "phoneNumber",
        "address",
        "avatar",
        "wallet",
        "isVerified"
      )
      .where("email", email)
      .first()) as unknown as { [key: string]: string };

    if (!user) {
      return errorResponse(res, "User not found", httpStatus.NOT_FOUND);
    }

    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
      return errorResponse(
        res,
        "Incorrect credentials",
        httpStatus.BAD_REQUEST
      );
    }
    const { id } = user;

    const token = generateLoginToken({ id, email });

    if (!user.isVerified) {
      return errorResponse(
        res,
        "Kindly verify your email",
        httpStatus.UNAUTHORIZED
      );
    }
    if (validUser) {
      return successResponseLogin(
        res,
        "Login successfully",
        httpStatus.OK,
        loggedInUser,
        token
      );
    }
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const ForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = (await db<User>("users")
      .select("*")
      .where("email", email)
      .first()) as unknown as { [key: string]: string };
    if (!user) {
      return errorResponse(res, "Email not found", httpStatus.NOT_FOUND);
    }
    const { id } = user;
    const subject = "Password Reset";
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "30mins" });
    const html = forgotPasswordVerification(token);
    await sendEmail(fromUser, req.body.email, subject, html);
    return successResponse(
      res,
      "Check email for the verification link",
      httpStatus.OK,
      {}
    );
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const ChangePassword = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const { id } = jwt.verify(token, JWT_SECRET) as unknown as jwtPayload;
    const user = (await db<User>("users")
      .select("id")
      .where("id", id)
      .first()) as unknown as { [key: string]: string };

    if (!user) {
      return errorResponse(res, "User does not exist", httpStatus.NOT_FOUND);
    }
    const passwordHash = await bcrypt.hash(req.body.password, 8);

    const updatedPassword = (await db<User>("users")
      .where("id", id)
      .update({ password: passwordHash })) as unknown as {
      [key: string]: string;
    };

    return successResponse(
      res,
      "Password Successfully Changed",
      httpStatus.OK,
      {}
    );
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const { id } = jwt.verify(token, JWT_SECRET) as jwtPayload;
    const { firstName, lastName, phoneNumber, address, avatar } = req.body;

    const user = (await db<User>("users")
      .select("id")
      .where("id", id)
      .first()) as unknown as { [key: string]: string };
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const avatarUrl = (await uploadImage(req.body.avatar)) as string;

    const updateUser = (await db<User>("users").where("id", id).update({
      firstName,
      lastName,
      phoneNumber,
      address,
      avatar: avatarUrl,
    })) as unknown as {
      [key: string]: string;
    };

    const updatedUser = (await db<User>("users")
      .select(
        "id",
        "firstName",
        "lastName",
        "dob",
        "gender",
        "email",
        "bvn",
        "phoneNumber",
        "address",
        "avatar",
        "wallet",
        "isVerified"
      )
      .where("id", id)
      .first()) as unknown as { [key: string]: string };

    successResponse(
      res,
      "User updated successfully",
      httpStatus.CREATED,
      updatedUser
    );
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string;
    const { id } = jwt.verify(token, JWT_SECRET) as jwtPayload;

    const user = (await db<User>("users")
      .where("id", id)
      .first()) as unknown as { [key: string]: string };
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const deletedUser = (await db<User>("users")
      .where("id", id)
      .delete()) as unknown as {
      [key: string]: string;
    };

    successResponse(res, "Successfully deleted user", httpStatus.CREATED, {});
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const GetUser = async (req: Request | any, res: Response) => {
  try {
    const verified = req.headers.token;

    const token = jwt.verify(verified, JWT_SECRET) as jwtPayload;

    const { id } = token;

    const user = (await db<User>("users")
      .select(
        "id",
        "firstName",
        "lastName",
        "dob",
        "gender",
        "email",
        "bvn",
        "phoneNumber",
        "address",
        "avatar",
        "wallet",
        "isVerified"
      )
      .where("id", id)
      .first()) as unknown as { [key: string]: string };
    if (!user) {
      return errorResponse(res, `User not found. `, httpStatus.NOT_FOUND);
    }
    return successResponse(
      res,
      "You have successfully fetch user details",
      httpStatus.OK,
      user
    );
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};

export const UserCount = async (req: Request | any, res: Response) => {
  try {
    const verifiedUser = (await db<User>("users")
      .where("isVerified", 1)
      .count()) as unknown as { [key: string]: string };

    const unVerifiedUser = (await db<User>("users")
      .where("isVerified", 0)
      .count()) as unknown as { [key: string]: string };

    return successResponse(
      res,
      "You have successfully fetched all Verified  and Unverified users",
      httpStatus.OK,
      {
        isVerified: verifiedUser,
        unVerified: unVerifiedUser,
      }
    );
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};

export const GetAllUsers = async (req: Request | any, res: Response) => {
  try {
    const allUsers = (await db<User>("users").select("*")) as unknown as {
      [key: string]: string;
    };

    return successResponse(
      res,
      "You have successfully fetched all users details",
      httpStatus.OK,
      allUsers
    );
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};
