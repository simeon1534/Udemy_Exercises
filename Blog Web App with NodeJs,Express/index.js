import express from "express";
import bodyParser from "body-parser";
import indexRouter from "./routes/index_route.js";
import postRouter from "./routes/post_route.js";
import error404Router from "./routes/error404.js";
import posts from "./data.js";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('*', error404Router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });