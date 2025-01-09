import { NextFunction, Request, Response } from "express";

export default async function generateKeyName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
  const time = new Date().getTime();
  const fileKeyName = time + "-" + req.file!.originalname;
  req.fileKeyName = fileKeyName;

  next();
}
