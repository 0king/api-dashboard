import express from "express";
import prisma from "../db-client";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import sizeOf from "image-size";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

router.get("/levels", async (req, res) => {
  const levels = await prisma.level.findMany();
  res.json(levels);
});

router.post("/levels", upload.single("image"), async (req, res) => {
  // compress image
  // TODO generate responsive images srcset
  // generate thumbnail
  // upload to s3
  // get url
  //then save in db

  // console.log(req.body);
  // console.log(req.file);

  // const sizes = [
  //     { width: 480, suffix: 'sm' },
  //     { width: 800, suffix: 'md' },
  //     { width: 1080, suffix: 'lg' },
  //     { width: 1280, suffix: 'xl' },
  //     { width: 1600, suffix: 'xxl' }
  //   ];
  //   Promise.all(
  //     sizes.map(({ width, suffix }) => (
  //       sharp(filePath).resize(width).toFile(`${dir}/${basename}-${suffix}.${ext}`)
  //     ))
  //   ).then(() => {
  //     console.log('Image resize succeeded!');
  //   }).catch((err) => {
  //     console.error(`Image resize failed with error: ${err}`);
  //   });

  if (!req.file) {
    throw new Error("File not found");
  }

  const time = new Date().toISOString();
  const keyName = time + "-" + req.file.originalname;

  // Put an object into an Amazon S3 bucket.
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: keyName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    })
  );

  //   // Read the object.
  //   const { Body } = await s3.send(
  //     new GetObjectCommand({
  //         Bucket: process.env.AWS_REGION,
  //         Key: req.file.originalname,
  //     }),
  //   );

  const dimensions = sizeOf(req.file.buffer);

  const level = await prisma.level.create({
    data: {
      id: Number(req.body.id),
      name: `Level ${req.body.id}`,
      media: {
        name: keyName,
        w: dimensions.width,
        h: dimensions.height,
      },
    },
  });

  res.json(level);
});

router.delete("/levels", async (req, res) => {
  const level = await prisma.level.delete({
    where: { id: Number(req.body.id) },
  });
  res.json(level);
});

router.get("/subjects", async (req, res) => {
  if (req.query.level) {
    const subjects = await prisma.subject.findMany({
      where: { levelId: Number(req.query.level) },
    });
    res.json(subjects);
  }
  const subjects = await prisma.subject.findMany();
  res.json(subjects);
});

// router.get('/subjects/:subjectId', async (req, res) => {
//     const subject = await dbClient.subject.findUnique({
//         where: { id: Number(req.params.subjectId) }
//     });
//     res.json(subject);
// });

router.post("/subjects", async (req, res) => {
  const subject = await prisma.subject.create({
    data: {
      name: req.body.name,
      levelId: Number(req.body.level),
    },
  });
  res.json(subject);
});

router.delete("/subjects", async (req, res) => {
  const subject = await prisma.subject.delete({
    where: {
      id: Number(req.body.subject),
      levelId: Number(req.body.level),
    },
  });
  res.json(subject);
});

router.get("/topics", async (req, res) => {
  if (req.query.subject) {
    const topics = await prisma.topic.findMany({
      where: { subjectId: Number(req.query.subject) },
    });
    res.json(topics);
  }
  const topics = await prisma.topic.findMany();
  res.json(topics);
});

router.post("/topics", async (req, res) => {
  const topic = await prisma.topic.create({
    data: {
      name: req.body.name,
      parentTopicId: req.body.parentTopic || null,
      subjectId: Number(req.body.subject),
    },
  });
  res.json(topic);
});

router.delete("/topics", async (req, res) => {
  const topic = await prisma.topic.delete({
    where: { id: Number(req.body.topic) },
  });
  res.json(topic);
});

router.get("/questions", async (req, res) => {
  if (req.query.topic) {
    const questions = await prisma.question.findMany({
      where: { topicId: Number(req.query.topic) },
    });
    res.json(questions);
  }
  const questions = await prisma.question.findMany();
  res.json(questions);
});

router.post("/questions", async (req, res) => {
  const question = await prisma.question.create({
    data: {
      title: req.body.title,
      minutes: req.body.minutes,
      order: req.body.order,
      authorId: req.body.author,
      content: req.body.content,
      topicId: Number(req.body.topic),
      type: req.body.type,
      media: req.body.media,
    },
  });
  res.json(question);
});

router.put("/questions", async (req, res) => {
  const question = await prisma.question.update({
    where: { id: req.body.question },
    data: req.body,
  });
  res.json(question);
});

router.delete("/questions", async (req, res) => {
  const question = await prisma.question.delete({
    where: { id: req.body.question },
  });
  res.json(question);
});

export default router;
