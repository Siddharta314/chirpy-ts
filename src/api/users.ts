import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../customError.js";
import { hashPassword } from "../auth/index.js";
import { NewUser } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";
import { updateUser } from "../db/queries/users.js";

export const userRouter = Router();

export type UserResponse = Omit<NewUser, "hashedPassword">;

userRouter.post("/", handlerCreateUser);
userRouter.put("/", handlerUpdateUser);

async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Missing required fields");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      email,
      hashedPassword,
    } satisfies NewUser);
    const response: UserResponse = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

async function handlerUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Missing required fields");
    }
    const accessToken = getBearerToken(req);

    const userId = validateJWT(accessToken, config.jwtSecret);
    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUser(userId, {
      email,
      hashedPassword,
    });
    const result: UserResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
