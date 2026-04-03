import { NextFunction, Request, Response, Router } from "express";
import { BadRequestError, UnauthorizedError } from "../customError.js";
import { checkPasswordHash } from "../auth/index.js";
import { getUserByEmail } from "../db/queries/users.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
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

      res.status(200).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  },
);
