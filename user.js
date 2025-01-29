const BASE_URL = "http://localhost:8000";

window.onload = async () => {
  console.log("on load");
  await loadData();
};

const loadData = async () => {
  // 1. Load all the user from the API
  const response = await axios.get(`${BASE_URL}/users`);
  console.log(response.data);

  // 2. Put the data into the html
  const userDom = document.getElementById("user");

  let htmlData = "<div>";
  for (let i = 0; i < response.data.length; i++) {
    let user = response.data[i];
    htmlData += `
    <div>
   ${user.id} ${user.firstname} ${user.lastname}
    <a href='index.html?id=${user.id}'><button>Edit</button></a>
    <button class='delete' data-id='${user.id}'>Delete</button>
    </div>
    
    `;
  }
  htmlData += "</div>";
  userDom.innerHTML = htmlData;

  // button click event
  const deleteDOMs = document.getElementsByClassName("delete");

  for (let i = 0; i < deleteDOMs.length; i++) {
    deleteDOMs[i].addEventListener("click", async (event) => {
      const userId = event.target.dataset.id;
      try {
        await axios.delete(`${BASE_URL}/user/${userId}`);
        loadData(); // recursive function
      } catch (error) {
        console.log(error);
      }
    });
  }
};
