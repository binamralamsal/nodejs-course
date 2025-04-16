import { Router } from "express";
import path from "path";
import * as authControllers from "../controllers/auth.controller.js";
import multer from "multer";

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

// const avatarUpload = multer({ dest: "public/uploads/avatar/" });

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/avatar/"); // change as needed
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random()}${ext}`);
  },
});

const avatarFileFilter = function (req, file, cb) {
  console.log(file);

  if (file.mimetype.startsWith("image/")) {
    // first parameter is error, second is whether to upload the file or not.
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
});

router
  .route("/edit-profile")
  .get(authControllers.getEditProfilePage)
  .post(avatarUpload.single("avatar"), authControllers.postEditProfile); // avatarUpload.array("photos", 10)
router
  .route("/change-password")
  .get(authControllers.getChangePasswordPage)
  .post(authControllers.postChangePassword);
router
  .route("/reset-password")
  .get(authControllers.getForgotPasswordPage)
  .post(authControllers.postForgotPassword);
// for someone who created account using oauth, we want to make sure that they can set their password
router
  .route("/set-password")
  .get(authControllers.getSetPasswordPage)
  .post(authControllers.postSetPassword);
router
  .route("/reset-password/:token")
  .get(authControllers.getResetPasswordPage)
  .post(authControllers.postResetPassword);
router.get("/google", authControllers.getGoogleLoginPage);
router.get("/google/callback", authControllers.getGoogleLoginCallback);
router.get("/github", authControllers.getGitHubLoginPage);
router.get("/github/callback", authControllers.getGitHubLoginCallback);

export const authRoutes = router;
