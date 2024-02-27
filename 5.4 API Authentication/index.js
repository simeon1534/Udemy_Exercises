import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "PAROLA129parola!";
const yourPassword = "Pa$$w0rd!";
const yourAPIKey = "5e6046eb-5028-415e-94c1-a0dd30a5f810";
const yourBearerToken = "99cd0a5c-a4ee-43ed-a300-d20ba70eb84c";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/a", async (req, res) => {
  try {
    const response = await axios.get("https://secrets-api.appbrewery.com/filter?score=5&apiKey=5e6046eb-5028-415e-94c1-a0dd30a5f810");
    const result = JSON.stringify(response.data);
    
    res.render('index.ejs',{content :result});
  } catch (error) {
    console.error(error);
  }
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/random");
    const result = JSON.stringify(response.data);
    
    res.render('index.ejs',{content :result});
  } catch (error) {
    console.error(error);
  }
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", async (req, res) => {
  try {
    const result = await axios.get(
      API_URL + "/all?page=2",
      {},
      {
        auth: {
          username: yourUsername,
          password: yourPassword,
        },
      }
    );
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});


app.get("/apiKey", async (req, res) => {
  try {
    const response = await axios.get(API_URL + `/filter`,{
      params : {
        score: 5,
        apiKey: yourAPIKey,
      },
    });
    const result = JSON.stringify(response.data);
    
    res.render('index.ejs',{content :result});
  } catch (error) {
    console.error(error);
    res.render('index.ejs',{content : error});

  }

});


  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.


app.get("/bearerToken", async (req, res) => {
  try {
    const id = 42;
    const response = await axios.get(API_URL + `/secrets/${id}`,{
      headers: { 
        Authorization: `Bearer ${yourBearerToken}` 
      },
    });
    const result = JSON.stringify(response.data);
    
    res.render('index.ejs',{content :result});
  } catch (error) {
    console.error(error);
    res.render('index.ejs',{content : error});

  }

});
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
