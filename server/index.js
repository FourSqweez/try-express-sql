const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mysql = require("mysql2/promise");
const cors = require("cors");

app.use(bodyparser.json());
app.use(cors());

const port = 8000;
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

const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("First name is required");
  }
  if (!userData.lastname) {
    errors.push("Last name is required");
  }
  if (!userData.age) {
    errors.push("Age is required");
  }
  if (!userData.gender) {
    errors.push("Gender is required");
  }
  if (!userData.interests) {
    errors.push("Interest is required");
  }
  if (!userData.description) {
    errors.push("Description is required");
  }

  return errors;
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

    const errors = validateData(user);
    console.log("error : ", errors);
    if (errors.length > 0) {
      throw {
        message: "Please fill in the required fields",
        errors,
      };
    }
    const result = await conn.query("INSERT INTO users SET ?", user);

    res.json({
      message: "add ok",
      data: result[0],
    });
  } catch (error) {
    const errorMessage = error.message || "something went wrong";
    const errors = error.errors || [];
    console.log("error ", error);
    res.status(500).json({
      message: errorMessage,
      errors,
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
app.put("/user/:id", async (req, res) => {
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
app.delete("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await conn.query("DELETE from users WHERE id = ?", id);

    res.json({
      message: "delete ok",
      data: result[0],
    });
  } catch (error) {
    console.log("error message", error.message);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.listen(port, async (req, res) => {
  await initMySQL();
  console.log("http server run at ", port);
});
