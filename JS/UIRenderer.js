import ShopService from "./ShopService.js";

export default class UIRenderer {
  
  #getImageUrl(imageUrl) {
    return imageUrl.startsWith("/")
      ? `${ShopService.BASE_URL}${imageUrl}`
      : imageUrl;
  }

  #contentCard(card, product) {
    card.querySelector(".product__name").textContent = product.name;
    const img = card.querySelector(".product__image");
    img.src = this.#getImageUrl(product.imageUrl);
    img.alt = product.name;
    card
      .querySelector(".product__price")
      .appendChild(document.createTextNode(` ${product.price} рублей`));
    card
      .querySelector(".product__description")
      .appendChild(document.createTextNode(` ${product.description}`));
    card
      .querySelector(".product__category")
      .appendChild(document.createTextNode(` ${product.category}`));
    card
      .querySelector(".product__stock")
      .appendChild(document.createTextNode(` ${product.stock} штук`));
    card
      .querySelector(".product__rating")
      .appendChild(document.createTextNode(` ${product.rating}`));
  }

  render() {
    ShopService.getProducts()
      .then((res) => {
        const productsContainer = document.querySelector("#products-list");
        productsContainer.innerHTML = "";
        const template = document.querySelector("#product-template");

        res.forEach((product) => {
          const templateCardProduct = template.content.cloneNode(true);
          this.#contentCard(templateCardProduct, product);
          const buyButton =
            templateCardProduct.querySelector(".product__button");
          buyButton.dataset.id = product.id;

          buyButton.addEventListener("click", () => {
            const id = buyButton.dataset.id;
            ShopService.buyProduct(id)
              .then(() => {
                const productCardWrapper = buyButton.closest(".product");
                if (productCardWrapper) {
                  productCardWrapper.remove();
                }
              })
              .catch((err) => {
                console.error(err);
              });
          });

          productsContainer.appendChild(templateCardProduct);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  renderAdmin() {
    ShopService.getProducts()
      .then((res) => {
        const productsContainer = document.querySelector("#products-list");
        productsContainer.innerHTML = "";
        const template = document.querySelector("#product-template");
        res.forEach((product) => {
          const cardAdmin = template.content.cloneNode(true);
          this.#contentCard(cardAdmin, product);
          const buyBtn = cardAdmin.querySelector(".product__button");
          if (buyBtn) buyBtn.remove();
          const adminDiv = document.createElement("div");
          adminDiv.className = "product__adminButtons";
          const editBtn = document.createElement("button");
          editBtn.textContent = "Редактировать";
          editBtn.classList.add("product__editBtn");
          editBtn.dataset.id = product.id;
          editBtn.addEventListener("click", () => {
            alert(`Редактирование товара ${product.id}`); //сюда вставить переход на страницу редактирования товара
          });
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Удалить";
          deleteBtn.classList.add("product__deleteBtn");
          deleteBtn.dataset.id = product.id;
          deleteBtn.addEventListener("click", () => {
            alert(`Удаление товара ${product.id}`);
          });
          adminDiv.appendChild(editBtn);
          adminDiv.appendChild(deleteBtn);
          cardAdmin.querySelector(".product").appendChild(adminDiv);
          productsContainer.appendChild(cardAdmin);
        });
        const adminBtn = document.querySelector(".admin__button");
        if (adminBtn) {
          adminBtn.textContent = "Версия для пользователя";
        }
        const passwordInput = document.querySelector(".admin__password");
        if (passwordInput) passwordInput.remove();
      })
      .catch((err) => console.error(err));
  }
}
