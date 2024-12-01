import { Router } from "express";

import * as shortenerControllers from "../controllers/shortener.controller.js";

const router = Router();

router.get("/", shortenerControllers.getShortenerPage);
router.post("/", shortenerControllers.postShortenLink);
router.get("/:shortCode", shortenerControllers.redirectToShortLink);

export const shortenerRoutes = router;
