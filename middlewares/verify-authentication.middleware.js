import { verifyJWTToken } from "../services/auth.services.js";

// Adding a value to request object makes it able to access
// in other routes or controllers using req.user
export function verifyAuthentication(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = verifyJWTToken(token);
    req.user = decodedToken;
  } catch {
    req.user = null;
  }

  return next();
}
