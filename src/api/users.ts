import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../customError.js";
import { hashPassword } from "../auth/index.js";
export const userRouter = Router();

userRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new BadRequestError("Missing required fields");
      }
      const hashedPassword = await hashPassword(password);
      const newUser = await createUser({
        email,
        hashedPassword,
      });
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  },
);
