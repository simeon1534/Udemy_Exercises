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
  database: 'permalist',
});

await db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const createTableQuery = `
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);
`;
const checkIfExistTableQuery =`
SELECT to_regclass('public.items');
`;
const selectAllQuery = `SELECT * FROM items`;

let checkIfExistTable;
try {
  const res = await db.query(checkIfExistTableQuery)
  checkIfExistTable = res['rows'][0]['to_regclass'];
} catch (err) {
  console.error(err);
}


if (!checkIfExistTable) {
  db.query(createTableQuery, (err, result) => {
    try {
      console.log('Table created successfully');
    }
    catch (err) {
      console.error(err);
    }
  
  });
};





app.get("/",async  (req, res) => {
  const getAllQuery = await db.query(selectAllQuery)
  const items = getAllQuery.rows
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  const insertQuery = {
    text: 'INSERT INTO items(title) VALUES($1)',
    values: [item],
  }

  await db.query(insertQuery);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }


});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1;", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

