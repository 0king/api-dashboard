import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";
import s3 from "s3-client";

export default async function uploadToS3(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const file = req.file!;

  // Put an object into an Amazon S3 bucket.
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.fileKeyName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  //   // Read the object.
  //   const { Body } = await s3.send(
  //     new GetObjectCommand({
  //         Bucket: process.env.AWS_REGION,
  //         Key: req.file.originalname,
  //     }),
  //   );

  next();
}
