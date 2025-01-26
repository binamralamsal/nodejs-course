import { Router } from "express";

import * as authControllers from "../controllers/auth.controller.js";

const router = Router();

// router.get("/login", authControllers.getLoginPage);
// router.post("/login", authControllers.postLogin);
// router.get("/register", authControllers.getRegisterPage);
// router.post("/register", authControllers.postRegister);

// This is shortcut when you have multiple methods for same route.
router
  .route("/login")
  .get(authControllers.getLoginPage)
  .post(authControllers.postLogin);
router
  .route("/register")
  .get(authControllers.getRegisterPage)
  .post(authControllers.postRegister);

export const authRoutes = router;
