const BASE_URL = "http://localhost:8000";
let mode = "CREATE"; // CREATE or EDIT
let selectedUserId = "";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log("id", id);
  if (id) {
    mode = "EDIT";
    selectedUserId = id;

    // 1. load user data
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      const user = response.data;

      // 2. put the old data into the form
      let firstNameDOM = document.querySelector("input[name=firstname]");
      let lastNameDOM = document.querySelector("input[name=lastname]");
      let ageDOM = document.querySelector("input[name=age]");
      let descriptionDOM = document.querySelector("textarea[name=description]");

      firstNameDOM.value = user.firstname;
      lastNameDOM.value = user.lastname;
      ageDOM.value = user.age;
      descriptionDOM.value = user.description;

      let genderDOMs = document.querySelectorAll("input[name=gender]");
      for (let i = 0; i < genderDOMs.length; i++) {
        if (genderDOMs[i].value == user.gender) {
          genderDOMs[i].checked = true;
        }
      }

      let interestDOMs = document.querySelectorAll("input[name=interest]");
      for (let i = 0; i < interestDOMs.length; i++) {
        if (user.interests.includes(interestDOMs[i].value)) {
          interestDOMs[i].checked = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
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

const submitData = async () => {
  let firstNameDOM = document.querySelector("input[name=firstname]");
  let lastNameDOM = document.querySelector("input[name=lastname]");
  let ageDOM = document.querySelector("input[name=age]");

  let genderDOM = document.querySelector("input[name=gender]:checked") || {};
  let interestDOMs =
    document.querySelectorAll("input[name=interest]:checked") || {};

  let descriptionDOM = document.querySelector("textarea[name=description]");

  let messageDOM = document.getElementById("message");

  try {
    let interest = "";

    for (let i = 0; i < interestDOMs.length; i++) {
      interest += interestDOMs[i].value;
      if (i != interestDOMs.length - 1) {
        interest += ", ";
      }
    }

    let userData = {
      firstname: firstNameDOM.value,
      lastname: lastNameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      description: descriptionDOM.value,
      interests: interest,
    };

    const errors = validateData(userData);
    if (errors.length > 0) {
      // error from client
      throw {
        message: "Please fill in the required fields",
        errors,
      };
      // after trowing error, the code below will not be executed
      // it will go to catch block
      // which means it will not send request to server
    }

    let message = "Create new user successfully";

    if (mode === "CREATE") {
      // create new user
      const response = await axios.post(`${BASE_URL}/user`, userData);
      console.log("response", response);
    } else {
      // edit user
      const response = await axios.put(
        `${BASE_URL}/user/${selectedUserId}`,
        userData
      );
      message = "Edit user successfully";
      console.log("response", response);
    }

    messageDOM.innerHTML = message;
    messageDOM.className = "message success";
  } catch (error) {
    if (error.response) {
      // error from server
      console.log("Error submitting data:", error.response);
      error.message = error.response.data.message;
      error.errors = error.response.data.errors;
    }

    let htmlData = "<div>";
    htmlData += `<div>${error.message}</div>`;
    htmlData += "<ul>";
    for (let i = 0; i < error.errors.length; i++) {
      htmlData += `<li>${error.errors[i]}</li>`;
    }
    htmlData += "</ul>";
    htmlData += "</div>";

    messageDOM.innerHTML = htmlData;
    messageDOM.className = "message error";
  }
};
