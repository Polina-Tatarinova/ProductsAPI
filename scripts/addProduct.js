import ShopService from "./ShopService.js";

function isAdminSessionValid() {
  const saved = localStorage.getItem("adminState");
  if (!saved) return false;
  const data = JSON.parse(saved);
  return data.expired > Date.now() && data.isAdmin === true;
}
if (!isAdminSessionValid()) {
  alert("Сессия администратора истекла. Войдите заново.");
  window.location.href = "../index.html";
}

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const stockInput = document.getElementById("stock");
const imageUrlInput = document.getElementById("imageUrl");
const ratingInput = document.getElementById("rating");

const form = document.getElementById("add-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newProduct = {
    name: nameInput.value,
    price: priceInput.value,
    description: descriptionInput.value,
    category: categoryInput.value,
    stock: stockInput.value,
    imageUrl: imageUrlInput.value,
    rating: ratingInput.value,
  };
  ShopService.createNewProduct(newProduct)
    .then(() => {
      alert("Товар успешно создан!");
      window.location.href = "../index.html";
    })
    .catch((err) => {
      alert(err);
    });
});

document.querySelector("#cancel-btn").addEventListener("click", () => {
  window.location.href = "../index.html"; 
});
