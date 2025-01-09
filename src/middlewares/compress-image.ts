import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export default async function compressImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    res.status(400).json({ error: "Media File not found" });
    throw new Error("Media File not found");
  }

  //compress image using sharp
  const compressedImageBuffer = await sharp(req.file.buffer)
    .resize(1280, null, {
      withoutEnlargement: true,
    })
    .webp({
      quality: 50,
    })
    .toBuffer();

  //change to compressed file
  req.file.buffer = compressedImageBuffer;

  next();
}
