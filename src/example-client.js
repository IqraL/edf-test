import express from "express";
import {authorRouter} from "./routes/author.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded());

const port = 3002;

app.use(authorRouter);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

