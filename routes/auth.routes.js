import { Router } from "express";

import * as authControllers from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", authControllers.getLoginPage);
router.post("/login", authControllers.postLogin);
router.get("/register", authControllers.getRegisterPage);

export const authRoutes = router;
