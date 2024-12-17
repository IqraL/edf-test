import express from "express";
import { BookSearchApiClient } from "../BookSearchApiClient.js";
const authorRouter = express.Router();

authorRouter.get("/by-author", async (req, res) => {
  try {
    const { limit, author, format } = req.query;
    const client = new BookSearchApiClient(format);
    const booksByAuthor = await client.getBooksByAuthor(author, limit);
    res.send(booksByAuthor);
  } catch (error) {
    console.log(error);
    res.send([]);
  }
});

export { authorRouter };
