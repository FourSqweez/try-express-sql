const submitData = async () => {
  let firstNameDOM = document.querySelector("input[name=firstname]");
  let lastNameDOM = document.querySelector("input[name=lastname]");
  let ageDOM = document.querySelector("input[name=age]");

  let genderDOM = document.querySelector("input[name=gender]:checked");
  let interestDOMs = document.querySelectorAll("input[name=interest]:checked");

  let descriptionDOM = document.querySelector("textarea[name=description]");

  let messageDOM = document.getElementById("message");
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

  console.log("submit data", userData);
  try {
    const response = await axios.post("http://localhost:8000/user", userData);
    console.log("response", response);
    messageDOM.innerHTML = "Submitted successfully";
    messageDOM.className = "message success";
  } catch (error) {
    if (error.response) messageDOM.innerHTML = "Submitted failed";
    messageDOM.className = "message error";
    console.log("Error submitting data:", error.response.data.message);
  }
};
