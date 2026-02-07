import jwt from "jsonwebtoken";
import { UnauthorizedError, InternalError } from "../errors/errors.js";

function auth(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) throw new UnauthorizedError("No token provided");

  if (!process.env.JWT_SECRET) {
    throw new InternalError("JWT_SECRET not configured");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export default auth;
