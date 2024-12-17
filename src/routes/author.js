import express from "express";
import {byAuthor} from './logic/byAuthor.js'

const authorRouter = express.Router();

authorRouter.get("/by-author", async (req, res) => byAuthor(req, res));

export { authorRouter };
