import { Level } from './../node_modules/.prisma/client/index.d';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import log from "@utils/logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  log("yes");
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const top = await prisma.topic.create({
    data:{ 
      name: "child topic 2",
      subjectId: 1,
      parentTopicId: 2,
    }
  })
  const topics = await prisma.topic.findMany();
  console.log(topics);
  
}



main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
