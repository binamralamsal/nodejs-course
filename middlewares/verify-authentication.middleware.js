import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constants.js";
import { refreshTokens, verifyJWTToken } from "../services/auth.services.js";

export async function verifyAuthentication(req, res, next) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  if (!accessToken && !refreshToken) {
    return next();
  }

  if (accessToken) {
    try {
      const decodedToken = verifyJWTToken(accessToken);
      req.user = decodedToken;

      return next();
    } catch {}
  }

  if (refreshToken) {
    try {
      const { newAccessToken, newRefreshToken, user } = await refreshTokens(
        refreshToken
      );
      const baseCookieConfig = { httpOnly: true, secure: true };
      req.user = user;

      res.cookie("access_token", newAccessToken, {
        ...baseCookieConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
      });
      res.cookie("refresh_token", newRefreshToken, {
        ...baseCookieConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
      });

      return next();
    } catch {}
  }

  return next();
}
