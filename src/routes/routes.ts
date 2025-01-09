import express, { Request, Response } from "express";
import prisma from "../db-client";
import multer from "multer";
import sizeOf from "image-size";
import compressImage from "middlewares/compress-image";
import uploadToS3 from "middlewares/s3-upload";
import generateKeyName from "middlewares/generate-fileKeyName";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imagePipeline = [
  upload.single("image"),
  generateKeyName,
  compressImage,
  uploadToS3,
];

router.get("/levels", async (req, res) => {
  const levels = await prisma.level.findMany();
  res.json(levels);
});

router.post("/levels", imagePipeline, async (req: Request, res: Response) => {
  // TODO generate responsive images srcset

    // const sizes = [
    //     { width: 480, suffix: 'sm' },
    //     { width: 800, suffix: 'md' },
    //     { width: 1280, suffix: 'xl' },
    //   ];
    //   Promise.all(
    //     sizes.map(({ width, suffix }) => (
    //       sharp(filePath).resize(width).toFile(`${dir}/${basename}-${suffix}.${ext}`)
    //     ))
    //   ).then(() => {
    //     console.log('Image resize succeeded!');

  const dimensions = sizeOf(req.file!.buffer);

  const level = await prisma.level.create({
    data: {
      id: Number(req.body.id),
      name: `Level ${req.body.id}`,
      media: {
        id: req.fileKeyName,
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
      where: {
        levelId: {
          equals: Number(req.query.level),
        },
      },
    });
    res.json(subjects);
    return
  }
  const subjects = await prisma.subject.findMany();
  res.json(subjects);
});

router.post("/subjects", async (req, res) => {  
  // TODO generate responsive images srcset

  const dimensions = sizeOf(req.file!.buffer);

  const subject = await prisma.subject.create({
    data: {
      name: req.body.name,
      levelId: Number(req.body.level),
      media: {
        id: req.fileKeyName,
        w: dimensions.width,
        h: dimensions.height,
      },
    },
  });

  res.json(subject);
});


router.delete("/subjects", async (req, res) => {
  const subject = await prisma.subject.delete({
    where: {
      id: Number(req.body.subject),
    },
  });
  res.json(subject);
});

router.get("/topics", async (req: Request, res: Response) => {
  if (req.query.subject) {
    const topics = await prisma.topic.findMany({
      where: { 
        subjectId: Number(req.query.subject)
      },
    });
    res.json(topics);
    return
  }
  const topics = await prisma.topic.findMany();
  res.json(topics);
});

router.post("/topics", imagePipeline, async (req: Request, res: Response) => {
  // TODO generate responsive images srcset
  const dimensions = sizeOf(req.file!.buffer);

  const topic = await prisma.topic.create({
    data: {
      name: req.body.name,
      parentTopicId: req.body.parentTopic || null,
      subjectId: Number(req.body.subject),
      media: {
        id: req.fileKeyName,
        w: dimensions.width,
        h: dimensions.height,
      },
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
    return
  }
  const questions = await prisma.question.findMany();
  res.json(questions);
});

router.post("/questions", imagePipeline, async (req: Request, res: Response) => {
  // TODO generate responsive images srcset
  const dimensions = sizeOf(req.file!.buffer);
  
  const question = await prisma.question.create({
    data: {
      title: req.body.title,
      minutes: req.body.minutes,
      order: req.body.order,
      authorId: req.body.author,
      content: req.body.content,
      topicId: Number(req.body.topic),
      type: req.body.type,
      media: [
        {
          id: req.fileKeyName,
          w: dimensions.width,
          h: dimensions.height,
        }
      ],
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
