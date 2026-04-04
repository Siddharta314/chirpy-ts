import { NextFunction, Request, Response, Router } from "express";
import { BadRequestError, UnauthorizedError } from "../customError.js";
import { checkPasswordHash } from "../auth/index.js";
import { getUserByEmail } from "../db/queries/users.js";
import { User } from "src/db/schema.js";
import { makeJWT } from "../auth/jwt.js";
import { config } from "../config.js";
export const authRouter = Router();

export type UserResponse = Omit<User, "hashedPassword"> & {
  token: string;
};

type RequesetLogin = {
  email: string;
  password: string;
  expiresInSeconds?: number;
};

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, expiresInSeconds } = req.body;
      if (!email || !password) {
        throw new BadRequestError("Missing required fields");
      }
      const user = await getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedError("Invalid credentials");
      }
      const isPasswordCorrect = await checkPasswordHash(
        password,
        user.hashedPassword,
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid credentials");
      }
      const DEFAULT_EXPIRY = 60 * 60; // 1h
      const MAX_EXPIRY = 24 * 60 * 60; // 24h

      const rawExpiry = Number(expiresInSeconds);
      let expiry = !isNaN(rawExpiry) ? rawExpiry : DEFAULT_EXPIRY;
      if (expiry < 0 || expiry > MAX_EXPIRY) {
        expiry = DEFAULT_EXPIRY;
      }
      const jwtToken = await makeJWT(user.id, expiry, config.jwtSecret);
      const response: UserResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: jwtToken,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);
