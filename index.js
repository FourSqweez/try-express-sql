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
      throw {
        message: "Please fill in the required fields",
        errors,
      };
    }

    const response = await axios.post("http://localhost:8000/user", userData);
    console.log("response", response.data);
    messageDOM.innerHTML = "Submitted successfully";
    messageDOM.className = "message success";
  } catch (error) {
    // if (error.response) {
    //   console.log("Error submitting data:", error.response.data.message);
    // }

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
