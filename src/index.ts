import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import log from "@utils/logger";
import helmet from "helmet";
import routes from 'routes/routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// set security HTTP headers
app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse json request body
app.use(express.json());

app.use(express.static('public'));

app.use('/', routes);

// app.get("/", (req: Request, res: Response) => {
//   log("yes");
//   res.send("Express + TypeScript Server");
// });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
