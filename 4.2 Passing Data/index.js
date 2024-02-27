import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  let letters = req.body['fName'] + req.body['lName'];
  let number_of_letters = letters.length;
  console.log(number_of_letters);
  res.render("index.ejs", {number_of_letters: number_of_letters});

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
