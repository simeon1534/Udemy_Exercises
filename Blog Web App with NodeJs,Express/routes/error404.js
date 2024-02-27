import posts from "../data.js";
import express from "express";

const error404Router = express.Router();

error404Router.get('*', (req, res) => {
    res.render('error404.ejs');
  });

  export default error404Router;