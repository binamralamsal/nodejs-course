import {
  refreshTokens,
  setAuthCookies,
  verifyJWTToken,
} from "../services/auth.services.js";

export async function verifyAuthentication(req, res, next) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  if (!accessToken && !refreshToken) {
    return next();
  }

  if (accessToken) {
    try {
      req.user = verifyJWTToken(accessToken);

      return next();
    } catch {}
  }

  if (refreshToken) {
    try {
      const { newAccessToken, newRefreshToken, user } = await refreshTokens(
        refreshToken
      );
      req.user = user;

      setAuthCookies({
        res,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      return next();
    } catch {}
  }

  return next();
}
