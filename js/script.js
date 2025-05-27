//toggle class active
const navbarNav = document.querySelector(".navbar-nav");

document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

const searchFrom = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
document.querySelector("#search-btn").onclick = (e) => {
  searchFrom.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

const hamburger = document.querySelector("#hamburger-menu");
const searchBtn = document.querySelector("#search-btn");
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!searchBtn.contains(e.target) && !searchFrom.contains(e.target)) {
    searchFrom.classList.remove("active");
  }
});
