import { Router } from "express";

import * as shortenerControllers from "../controllers/shortener.controller.js";

const router = Router();

router
  .route("/")
  .get(shortenerControllers.getShortenerPage)
  .post(shortenerControllers.postShortenLink);
router
  .route("/edit/:id")
  .get(shortenerControllers.getEditPage)
  .post(shortenerControllers.postEditLink);
router.get("/:shortCode", shortenerControllers.redirectToShortLink);

export const shortenerRoutes = router;
