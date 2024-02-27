import posts from "../data.js";
import express from "express";

const indexRouter = express.Router();
let index = 0;

indexRouter.get('/', (req, res) => {
    res.render('index.ejs', {posts: posts});
});

indexRouter.post('/', (req, res) => {
    let title = req.body["title"];
    let content = req.body["content"];
 
    posts[index]={"title": title, "content": content};
    index = index +1
    res.render('index.ejs',{posts: posts});
});



export default indexRouter;