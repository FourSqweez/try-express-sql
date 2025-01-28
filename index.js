const express = require("express");
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.json());

const port = 8000;

let users = [];
let counter = 1;

// path = GET /users
app.get("/users", (req, res) => {
  const filterUsers = users.map((user) => {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullname: user.firstname + " " + user.lastname,
    };
  });
  res.json(filterUsers);
});

// path = POST /user
app.post("/user", (req, res) => {
  let user = req.body;
  user.id = counter;
  counter += 1;
  console.log("user : ", user);
  users.push(user);
  res.json({
    message: "add ok",
    user: user,
  });
});

// get user by id
app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  let selectedIndex = users.findIndex((user) => user.id == id);
  res.json(users[selectedIndex]);
});

// path = PUT /user/:id
app.patch("/user/:id", (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;

  // find user from id
  let selectedIndex = users.findIndex((user) => user.id == id);

  // update the user
  if (updateUser.firstname) {
    users[selectedIndex].firstname = updateUser.firstname;
  }
  if (updateUser.lastname) {
    users[selectedIndex].lastname = updateUser.lastname;
  }

  // put the new update user to the same user
  res.json({
    message: "update user complete!",
    data: {
      user: updateUser,
      indexUpdate: selectedIndex,
    },
  });
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

app.listen(port, (req, res) => {
  console.log("http server run at ", port);
});
