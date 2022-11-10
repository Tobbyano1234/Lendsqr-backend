import { Router } from "express";
import { validateCreateBankAccount } from "../middlewares/validations";
import { auth } from "../middlewares/auth";
import {
  CreateAccount,
  DeleteAccount,
  GetAccount,
  GetAllAccount,
} from "../controllers/accountController";

const router = Router();

router.post("/add-account", validateCreateBankAccount, CreateAccount);
router.delete("/delete/:id", DeleteAccount);
router.get("/get-account/:id", auth, GetAccount);
router.get("/all-accounts", auth, GetAllAccount);

export default router;
