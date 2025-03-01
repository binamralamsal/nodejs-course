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
router.get("/profile", authControllers.getProfilePage);
router.get("/verify-email", authControllers.getVerifyEmailPage);
router.get("/verify-email-token", authControllers.verifyEmailToken);
router.post(
  "/resend-verification-link",
  authControllers.resendVerificationLink
);
router.get("/logout", authControllers.logoutUser);
router
  .route("/edit-profile")
  .get(authControllers.getEditProfilePage)
  .post(authControllers.postEditProfile);
router
  .route("/change-password")
  .get(authControllers.getChangePasswordPage)
  .post(authControllers.postChangePassword);
router
  .route("/reset-password")
  .get(authControllers.getForgotPasswordPage)
  .post(authControllers.postForgotPassword);
router
  .route("/reset-password/:token")
  .get(authControllers.getResetPasswordPage)
  .post(authControllers.postResetPassword);
router.get("/google", authControllers.getGoogleLoginPage);
router.get("/google/callback", authControllers.getGoogleLoginCallback);

export const authRoutes = router;
