import express from "express";

declare global {
  namespace Express {
    interface Request {
      fileKeyName?: string
      //file: any;
    }
  }

  namespace PrismaJson {
    type MediaType = { id: string, w: number, h: number}
  }
}