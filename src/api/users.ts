import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../customError.js";
export const userRouter = Router();

userRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new BadRequestError("Missing required fields");
      }
      const newUser = await createUser({ email });
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
