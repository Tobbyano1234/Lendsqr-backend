import { Router } from "express";
import {
  LoginUser,
  RegisterUser,
  VerifyUser,
  ForgotPassword,
  ChangePassword,
  UpdateUser,
  DeleteUser,
  GetUser,
  UserCount,
  GetAllUsers,
} from "../controllers/userController";
import {
  validateSignupUser,
  validateLoginUser,
  validateForgotPassword,
  validateChangePassword,
  validateUpdateUser,
} from "../middlewares/validations";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/signup", RegisterUser);
router.post("/signup", validateSignupUser, RegisterUser);
router.post("/forgot-password", validateForgotPassword, ForgotPassword);
router.post("/change-password", auth, validateChangePassword, ChangePassword);
router.post("/login", validateLoginUser, LoginUser);
router.get("/verify/:token", VerifyUser);
router.patch("/update", auth, validateUpdateUser, UpdateUser);
router.delete("/delete", auth, DeleteUser);
router.get("/getuser", auth, GetUser);
router.get("/count", UserCount);
router.get("/allusers", GetAllUsers);

export default router;
