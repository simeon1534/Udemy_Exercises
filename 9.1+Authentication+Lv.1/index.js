import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


const db = new pg.Client({
  user: 'postgres',
  password: 'Pa$$w0rd',
  host: 'localhost',
  port: 5432,
  database: 'auth-exercise-db',
});

await db.connect();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkEmailExist = db.query("SELECT email from users WHERE email=$1",[email]);
    if ((await checkEmailExist).rows.length > 0){
      res.send('Try different email')
    } else {
      await db.query("INSERT INTO users(email, password) VALUES($1,$2)", [email,password]);
      res.render("secrets.ejs");
    }
    
  } catch (err) {
    
    console.log(err);
  }

});
  
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const emailPasswordExist = await db.query("SELECT email,password from users WHERE email = $1",[email]);
    if (emailPasswordExist.rows.length > 0) {
      const credentials = emailPasswordExist.rows[0]
      if (credentials['password'] === password) {
        res.render("secrets.ejs");
      } else {
        res.send('Wrong Password');
      }

    } else {
      res.send('Not registered');
    }
    
    
  } catch (err) {
    console.log(err);
  }
 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
