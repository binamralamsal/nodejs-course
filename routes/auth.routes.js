import { Router } from "express";

import * as authControllers from "../controllers/auth.controller.js";

const router = Router();

router
  .route("/login")
  .get(authControllers.getLoginPage)
  .post(authControllers.postLogin);
router
  .route("/register")
  .get(authControllers.getRegisterPage)
  .post(authControllers.postRegister);
router.get("/me", authControllers.getMe);
router.get("/logout", authControllers.logoutUser);

export const authRoutes = router;
