import { Router } from "express";

import * as shortenerControllers from "../controllers/shortener.controller.js";

const router = Router();

// You might say that this is a controller file, you are right but if the routes grow then
// this file becomes huge and harder to maintain with different routes.
// so it's good idea to separate controllers and routes.
// we already have views, so we can just ignore it.

// we will also move loadLinks and saveLinks to model related folder.

router.get("/", shortenerControllers.getShortenerPage);
router.post("/", shortenerControllers.postShortenLink);
router.get("/:shortCode", shortenerControllers.redirectToShortLink);

export const shortenerRoutes = router;
