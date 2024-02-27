import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = " https://v2.jokeapi.dev/joke";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", async (req, res) => {
    try {

        let result = await axios.get(API_URL + "/Programming" );

        while (result.data['type'] === 'single') {
            // Make another Axios GET request to get joke with setup and delivery
            result = await axios.get(API_URL + "/Programming" );
        }

        console.log(result.data);


       
        res.render("index.ejs", { setup: JSON.stringify(result.data.setup), delivery: JSON.stringify(result.data.delivery) });

        
      } catch (error) {
        console.log(error);
        res.render("index.ejs", {  error: JSON.stringify(error.response.data), setup: 'Why did the webpage go to therapy?', delivery: "Because it kept getting a 404 error, and it couldn't find itself!" });
      }

    res.render("index.ejs", );
  });
  

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });