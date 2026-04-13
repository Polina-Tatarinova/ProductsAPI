import ShopService from "./ShopService.js";

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
      alert("Ошибка создания товара");
      console.error(err);
    });
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  window.location.href = "../index.html"; 
});
