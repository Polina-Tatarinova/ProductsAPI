import ShopService from "./ShopService.js";

export default class UIRenderer {

constructor(){
  this.#initIsAminLictener()
}
  #initIsAminLictener(){
       const adminButton = document.querySelector(".admin__button");
        const passwordInput = document.querySelector(".admin__password");
        
        adminButton.addEventListener("click", () => {
          if (this.#isAdminFlag) {
            this.#isAdminFlag = false;
            this.render();
            passwordInput.style.display = "";
            passwordInput.value = "";
            adminButton.textContent = "Права администратора";
          } else {
            const token = 12345;
            if (passwordInput.value == token) {
              console.log("вход в админ панель");
              ShopService.checkAdministratorRights(token)
                .then((res) => {
                  console.log(res);
                  this.#isAdminFlag = true;
                  this.render();
                  passwordInput.style.display = "none";
                  adminButton.textContent = "Вернуться в режим пользователя";
                })
                .catch((err) => {
                  console.error(err);
                });
            } else {
              alert("Пароль не верен");
              passwordInput.value = "";
            }
          }
        });
  }
  #isAdminFlag = false;

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
          if (this.#isAdminFlag) {
            if (buyButton) {
              buyButton.remove();
            }
            const adminBtnEdit = document.createElement("button");
            adminBtnEdit.textContent = "Редактировать";
            adminBtnEdit.classList.add("product__buttonEdit");
            adminBtnEdit.dataset.id = product.id;
            adminBtnEdit.addEventListener("click", () => {
              console.log(`Редактирование товара ${product.id}`);
              window.location.href = `../indexEdit.html?id=${product.id}`;
            });
            const adminBtnDelete = document.createElement("button");
            adminBtnDelete.textContent = "Удалить";
            adminBtnDelete.classList.add("product__buttonDelete");
            adminBtnDelete.dataset.id = product.id;
            adminBtnDelete.addEventListener("click", () => {
              console.log(`Удаление товара ${product.id}`);
            });

            templateCardProduct.querySelector(".product").append(adminBtnEdit);
            templateCardProduct
              .querySelector(".product")
              .append(adminBtnDelete);
            productsContainer.appendChild(templateCardProduct);
          } else {
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
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
