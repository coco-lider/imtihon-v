const userContainer = document.querySelector(".users-container");
const savedContainer = document.querySelector(".saved-container");
const searchInput = document.getElementById("search");
const genderFilter = document.getElementById("user-filter");
const showMoreBtn = document.getElementById("show-more");

let allUsers = [];
let savedUsers = [];
let page = 1;

function getUsers(pageNum) {
  let h1 = document.createElement('h1');
  h1.textContent = 'Loading...'
  userContainer.appendChild(h1)
  fetch("https://randomuser.me/api/?results=10&page=" + pageNum)
    .then((res) => res.json())  
    .then((data) => {
      allUsers = allUsers.concat(data.results);
      renderUsers(allUsers);
      h1.style.display = 'none'
    });
}

function renderUsers(users) {
  userContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    userContainer.innerHTML += `
      <div class="user-info">
        <img src="${user.picture.large}">
        <h1 class="user-name">${user.name.first} ${user.name.last}</h1>
        <p class="user-bi">${user.email} | ${user.gender} | ${user.location.city}</p>
        <button class="save-btn" onclick="saveUser(${i})">Save</button>
      </div>
    `;
  }
}

function renderSavedUsers() {
  savedContainer.innerHTML = "";
  for (let i = 0; i < savedUsers.length; i++) {
    let user = savedUsers[i];
    savedContainer.innerHTML += `
      <div class="user-info">
        <img src="${user.picture.large}">
        <h1>${user.name.first} ${user.name.last}</h1>
        <p>${user.email} | ${user.gender} | ${user.location.city}</p>
        <button class="delete-btn" onclick="deleteUser(${i})">Delete</button>
      </div>
    `;
  }
}

function saveUser(index) {
  let user = allUsers[index];
  let alreadySaved = savedUsers.find((u) => u.login.uuid === user.login.uuid);
  if (!alreadySaved) {
    savedUsers.push(user);
    renderSavedUsers();
  }
}

function deleteUser(index) {
  savedUsers.splice(index, 1);
  renderSavedUsers();
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = allUsers.filter(
    (user) =>
      user.name.first.toLowerCase().includes(keyword) ||
      user.name.last.toLowerCase().includes(keyword)
  );
  renderUsers(filtered);
});

genderFilter.addEventListener("change", () => {
  const value = genderFilter.value.toLowerCase();
  if (value === "all") {
    renderUsers(allUsers);
  } else {
    const filtered = allUsers.filter(
      (user) => user.gender.toLowerCase() === value
    );
    renderUsers(filtered);
  }
});

showMoreBtn.addEventListener("click", () => {
  page++;
  getUsers(page);
  h1
});

document.addEventListener("DOMContentLoaded", () => {
  getUsers(page);
});
