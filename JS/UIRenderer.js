import ShopService from "./ShopService.js";

export default class UIRenderer {
  constructor() {
    this.#loadAdminState();
    this.#initIsAminLictener();
    this.#syncAdminUI();
    this.render();
  }

  #syncAdminUI() {//подсказал сделать дипсик поскольку были трабля с тем что при перезагрузке флаги не всегда 
  // меняются + идёт смешивание навешиваемых слушателей событий
    const adminButton = document.querySelector(".admin__button");
    const passwordInput = document.querySelector(".admin__password");
    if (adminButton) {
      adminButton.textContent = this.#isAdminFlag
        ? "Вернуться в режим пользователя"
        : "Права администратора";
    }
    if (passwordInput) {
      passwordInput.style.display = this.#isAdminFlag ? "none" : "";
    }
  }

  #saveAdminState() {
    const adminData = {
      isAdmin: this.#isAdminFlag,
      expired: Date.now() + 3600000,
    };
    localStorage.setItem("adminState", JSON.stringify(adminData));
  }

  #loadAdminState() {
    const saved = localStorage.getItem("adminState");
    if (saved) {
      const adminData = JSON.parse(saved);
      if (adminData.expired > Date.now() && adminData.isAdmin === true) {
        this.#isAdminFlag = true;
        return;
      }
      localStorage.removeItem("adminState");
    }
    this.#isAdminFlag = false;
  }

  #initAddButton() {
    const addBtn = document.querySelector("#add-product-btn");
    if (this.#isAdminFlag) {
      addBtn.style.display = "block";
      addBtn.addEventListener("click", () => {
        window.location.href = `../addProduct.html`;
      });
    } else {
      addBtn.style.display = "none";
    }
  }

  #initIsAminLictener() {
    const adminButton = document.querySelector(".admin__button");
    const passwordInput = document.querySelector(".admin__password");

    adminButton.addEventListener("click", () => {
      if (this.#isAdminFlag) {
        this.#isAdminFlag = false;
        this.#saveAdminState();
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
              this.#saveAdminState();
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
              ShopService.deleteProduct(product.id)
                .then(() => {
                  const productDelete = adminBtnDelete.closest(".product");
                  productDelete.remove();
                })
                .catch((err) => {
                  console.error("Ошибка удаления:", err);
                  alert("Не удалось удалить товар");
                });
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
        this.#initAddButton();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
