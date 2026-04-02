import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../customError.js";
import { Router } from "express";

export const userRouter = Router();

type body = {
  body: string;
};

type response = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
