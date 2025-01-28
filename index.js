const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mysql = require("mysql2/promise");

app.use(bodyparser.json());

const port = 8000;

let users = [];
let counter = 1;
let conn = null;

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorial",
    port: 8889,
  });
};

// Route handler for getting all users from database
app.get("/testdb", async (req, res) => {
  try {
    const results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// path = GET /users
app.get("/users", async (req, res) => {
  const results = await conn.query("SELECT * FROM users");
  console.log("results", results);
  res.json(results[0]);
});

// path = POST /user
app.post("/user", async (req, res) => {
  try {
    let user = req.body;
    const result = await conn.query("INSERT INTO users SET ?", user);

    res.json({
      message: "add ok",
      data: result[0],
    });
  } catch (error) {
    console.log("error message", error.message);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

// get user by id
app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("SELECT * FROM users WHERE id = ?", id);

    if (results[0].length === 0) {
      throw { statusCode: 404, message: "User not found" };
    }
    res.json(results[0][0]);
  } catch (error) {
    console.log("error message", error.message);
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: "something went wrong",
    });
  }
});

// path = PUT /user/:id
app.put("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body;
    const result = await conn.query("UPDATE users SET ? WHERE id = ?", [
      updateUser,
      id,
    ]);

    res.json({
      message: "update ok",
      data: result[0],
    });
  } catch (error) {
    console.log("error message", error.message);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

// path DELETE/users/:id
app.delete("/user/:id", (req, res) => {
  let id = req.params.id;
  let selectedIndex = users.findIndex((user) => user.id == id);

  users.splice(selectedIndex, 1);

  res.json({
    message: "delete complete!",
    indexDeleted: selectedIndex,
  });
});

app.listen(port, async (req, res) => {
  await initMySQL();
  console.log("http server run at ", port);
});
