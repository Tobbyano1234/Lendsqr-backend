import { Request, Response, NextFunction } from "express";
import db from "../configs/db.config";
import {
  errorResponse,
  serverError,
  successResponse,
} from "../utils/helperMethods";
import { v4 as uuid } from "uuid";
import httpStatus from "http-status";
import { User } from "../utils/types/userInterface";
import jwt from "jsonwebtoken";
import {
  getAllBanksNG,
  validateAccountDetails,
} from "../utils/flutterwaveRequest";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface jwtPayload {
  id: string;
  email: string;
}

export const CreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountId = uuid();

    const { bankName, accountName, accountNumber } = req.body;

    const token = req.headers.token as string;

    const { id } = jwt.verify(token, JWT_SECRET) as unknown as jwtPayload;

    const user = (await db<User>("users")
      .select("id", "firstName", "lastName")
      .where("id", id)
      .first()) as unknown as { [key: string]: string };

    if (!user) {
      return errorResponse(res, "User does not exist", httpStatus.NOT_FOUND);
    }

    const duplicateAccountNumber = await db("accounts")
      .where("accountNumber", accountNumber)
      .first();

    if (duplicateAccountNumber) {
      return errorResponse(
        res,
        "Account number already exists",
        httpStatus.CONFLICT
      );
    }

    const allBankNG = await getAllBanksNG();
    const banks = allBankNG.data;

    const bankCode = banks.filter(
      (el: { name: string; code: string; id: string }) => {
        if (el.name == bankName) {
          return el.code;
        }
      }
    );

    const accountBank = bankCode[0].code;

    const details = {
      account_number: accountNumber,
      account_bank: accountBank,
    };

    const checkAccount = await validateAccountDetails(details);

    if (checkAccount.status === "error") {
      return errorResponse(
        res,
        `${checkAccount?.message}`,
        httpStatus.BAD_REQUEST
      );
    }

    const userFullName = `${user.firstName} ${user.lastName}`;

    if (
      checkAccount?.data?.account_name !== userFullName &&
      checkAccount?.data?.account_name !== accountName
    ) {
      return errorResponse(
        res,
        "Kindly enter your correct account number that belong to you",
        httpStatus.BAD_REQUEST
      );
    }

    const account = {
      userId: id,
      id: accountId,
      bankName,
      accountBank,
      accountName,
      accountNumber,
    };

    const record = await db("accounts").insert(account);

    const updatedAccount = (await db("accounts")
      .select("*")
      .where("id", accountId)
      .first()) as unknown as { [key: string]: string };

    return successResponse(
      res,
      "Account created successfully",
      httpStatus.CREATED,
      updatedAccount
    );
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};

// export const UpdateAccount = async (req: Request, res: Response) => {
//   try {
//     const token = req.headers.token as string;
//     const { id } = jwt.verify(token, JWT_SECRET) as jwtPayload;
//     const { firstName, lastName, phoneNumber, address, avatar } = req.body;

//     const user = (await db<User>("users")
//       .select("id")
//       .where("id", id)
//       .first()) as unknown as { [key: string]: string };
//     if (!user) {
//       return res
//         .status(httpStatus.NOT_FOUND)
//         .json({ message: "User not found" });
//     }

//     const avatarUrl = (await uploadImage(req.body.avatar)) as string;

//     const updateUser = (await db<User>("users").where("id", id).update({
//       firstName,
//       lastName,
//       phoneNumber,
//       address,
//       avatar: avatarUrl,
//     })) as unknown as {
//       [key: string]: string;
//     };

//     const updatedUser = (await db<User>("users")
//       .select(
//         "id",
//         "firstName",
//         "lastName",
//         "dob",
//         "gender",
//         "email",
//         "bvn",
//         "phoneNumber",
//         "address",
//         "avatar",
//         "wallet",
//         "isVerified"
//       )
//       .where("id", id)
//       .first()) as unknown as { [key: string]: string };

//     successResponse(
//       res,
//       "User updated successfully",
//       httpStatus.CREATED,
//       updatedUser
//     );
//   } catch (error) {
//     console.log(error);
//     return serverError(res);
//   }
// };

export const DeleteAccount = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;
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

    const deletedAccount = (await db("accounts")
      .where({ userId: id, id: accountId })
      .delete()) as unknown as {
      [key: string]: string;
    };

    successResponse(res, "Successfully deleted account", httpStatus.CREATED, {
      deletedAccount,
    });
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

export const GetAccount = async (req: Request | any, res: Response) => {
  try {
    const accountId = req.params.id;

    const verified = req.headers.token;

    const token = jwt.verify(verified, JWT_SECRET) as jwtPayload;

    const { id } = token;
    console.log(accountId);
    const user = (await db<User>("users")
      .where("id", id)
      .first()) as unknown as { [key: string]: string };
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const accountExist = (await db("accounts")
      .select("*")
      .where("id", accountId)
      .first()) as unknown as {
      [key: string]: string;
    };

    return successResponse(
      res,
      "You have successfully fetch user account",
      httpStatus.OK,
      accountExist
    );
  } catch (error) {
    console.log(error);
    serverError(res);
  }
};

export const GetAllAccount = async (req: Request | any, res: Response) => {
  try {
    const accountId = req.params.id;

    const verified = req.headers.token;

    const token = jwt.verify(verified, JWT_SECRET) as jwtPayload;

    const { id } = token;

    const user = (await db<User>("users")
      .where("id", id)
      .first()) as unknown as { [key: string]: string };
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const accountExist = (await db("accounts")
      .select("*")
      .where("userId", id)) as unknown as {
      [key: string]: string;
    };

    return successResponse(
      res,
      "You have successfully fetch all user's accounts",
      httpStatus.OK,
      accountExist
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
