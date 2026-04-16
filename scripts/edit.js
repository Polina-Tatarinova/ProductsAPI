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

const urlParameter = new URLSearchParams(window.location.search);
const productId = urlParameter.get("id");

const form = document.querySelector("#edit-form");

const name = document.querySelector("#name");
const imageUrl = document.querySelector("#imageUrl");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const category = document.querySelector("#category");
const stock = document.querySelector("#stock");
const rating = document.querySelector("#rating");

document.querySelector("#cancel-btn").addEventListener("click", () => {
  window.location.href = "../index.html"; 
});

ShopService.getProducts()
  .then((products) => {
    const product = products.find((prod) => prod.id == productId);

    name.value = product.name;
    price.value = product.price;
    description.value = product.description;
    category.value = product.category;
    stock.value = product.stock;
    imageUrl.value = product.imageUrl;
    rating.value = product.rating;
  })
  .catch((err) => {
    alert(err);
  });

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = {
    name: name.value,
    price: price.value,
    description: description.value,
    category: category.value,
    stock: stock.value,
    imageUrl: imageUrl.value,
    rating: rating.value,
  };
  ShopService.changeProduct(productId, body)
    .then(() => {
      alert("Товар успешно отредактирован");
      window.location.href = "../index.html";
    })
    .catch((err) => {
      alert(err);
    });
});
