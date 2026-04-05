import { NextFunction, Request, Response, Router } from "express";
import { BadRequestError, UnauthorizedError } from "../customError.js";
import { checkPasswordHash } from "../auth/index.js";
import { getUserByEmail } from "../db/queries/users.js";
import { User } from "src/db/schema.js";
import { getBearerToken, makeJWT, makeRefreshToken } from "../auth/jwt.js";
import { config } from "../config.js";
import {
  createRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
} from "../db/queries/auth.js";

export const authRouter = Router();

export type UserResponse = Omit<User, "hashedPassword"> & {
  token: string;
  refreshToken: string;
};

type RequesetLogin = {
  email: string;
  password: string;
};

authRouter.post("/login", handlerLogin);
authRouter.post("/refresh", handlerRefreshToken);
authRouter.post("/revoke", handlerRevokeToken);

async function handlerLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
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
    // const DEFAULT_EXPIRY = 60 * 60; // 1h
    // const MAX_EXPIRY = 24 * 60 * 60; // 24h

    // const rawExpiry = Number(expiresInSeconds);
    // let expiry = !isNaN(rawExpiry) ? rawExpiry : DEFAULT_EXPIRY;
    // if (expiry < 0 || expiry > MAX_EXPIRY) {
    //   expiry = DEFAULT_EXPIRY;
    // }
    const expireInHour = 60 * 60;
    const jwtToken = await makeJWT(user.id, expireInHour, config.jwtSecret);
    const refreshTokenString = makeRefreshToken();
    const refreshToken = await createRefreshToken(refreshTokenString, user.id);
    const response: UserResponse = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: jwtToken,
      refreshToken: refreshToken.token,
      isChirpyRed: user.isChirpyRed,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function handlerRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = getBearerToken(req);
    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token");
    }

    const validRefreshToken = await getRefreshToken(refreshToken);
    if (!validRefreshToken || validRefreshToken.revokedAt) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    const newToken = makeJWT(
      validRefreshToken.userId,
      60 * 60,
      config.jwtSecret,
    );
    res.status(200).json({ token: newToken });
  } catch (error) {
    next(error);
  }
}

async function handlerRevokeToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = getBearerToken(req);
    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token");
    }

    const validRefreshToken = await getRefreshToken(refreshToken);
    if (!validRefreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
