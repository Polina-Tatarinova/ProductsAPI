import ShopService from "./ShopService.js";

export default class UIRenderer {
  #isAdminFlag = false;
  #productsCache = null;

  init() {
    this.#loadAdminState();
    this.#initIsAdminListener();
    this.#syncAdminUI();
    this.render();
  }

  #syncAdminUI() {
    const adminButton = document.querySelector(".admin__button");
    const passwordInput = document.querySelector(".admin__password");
    if (adminButton) {
      adminButton.textContent = this.#isAdminFlag
        ? "Вернуться в режим пользователя"
        : "Войти";
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

  #initIsAdminListener() {
    const adminButton = document.querySelector(".admin__button");
    const passwordInput = document.querySelector(".admin__password");

    adminButton.addEventListener("click", () => {
      if (this.#isAdminFlag) {
        this.#isAdminFlag = false;
        this.#saveAdminState();
        this.render();
        passwordInput.style.display = "";
        passwordInput.value = "";
        adminButton.textContent = "Войти";
      } else {
        const token = 12345;
        if (passwordInput.value == token) {
          ShopService.checkAdministratorRights(token)
            .then(() => {
              this.#isAdminFlag = true;
              this.#saveAdminState();
              this.render();
              passwordInput.style.display = "none";
              adminButton.textContent = "Вернуться в режим пользователя";
            })
            .catch(() => {
              alert("Не удалось войти");
            });
        } else {
          alert("Пароль не верен");
          passwordInput.value = "";
        }
      }
    });
  }

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
    card.querySelector(".product__price").textContent +=
      ` ${product.price} рублей`;
    card.querySelector(".product__description").textContent +=
      ` ${product.description}`;
    card.querySelector(".product__category").textContent +=
      ` ${product.category}`;
    card.querySelector(".product__stock").textContent +=
      ` ${product.stock} штук`;
    card.querySelector(".product__rating").textContent += ` ${product.rating}`;
  }

  #renderProducts() {
    const products = this.#productsCache;
    if (!products) return;

    const productsContainer = document.querySelector("#products-list");
    if (!productsContainer) return;
    productsContainer.innerHTML = "";
    const template = document.querySelector("#product-template");
    if (!template) return;

    products.forEach((product) => {
      const card = template.content.cloneNode(true);
      this.#contentCard(card, product);
      const buyButton = card.querySelector(".product__button");

      if (this.#isAdminFlag) {
        if (buyButton) buyButton.remove();
        const adminBtnEdit = document.createElement("button");
        adminBtnEdit.textContent = "Редактировать";
        adminBtnEdit.classList.add("product__buttonEdit");
        adminBtnEdit.addEventListener("click", () => {
          window.location.href = `../editProduct.html?id=${product.id}`;
        });
        const adminBtnDelete = document.createElement("button");
        adminBtnDelete.textContent = "Удалить";
        adminBtnDelete.classList.add("product__buttonDelete");
        adminBtnDelete.addEventListener("click", () => {
          ShopService.deleteProduct(product.id)
            .then(() => {
              this.#productsCache = null;
              this.render();
            })
            .catch(() => {
              alert("Не удалось удалить товар");
            });
        });

        card.querySelector(".product").append(adminBtnEdit, adminBtnDelete);
        productsContainer.appendChild(card);
      } else {
        buyButton.addEventListener("click", () => {
          ShopService.buyProduct(product.id)
            .then(() => {
              this.#productsCache = null;
              this.render();
            })
            .catch(() => {
              alert("Не удалось приобрести товар");
            });
        });
        productsContainer.appendChild(card);
      }
    });
    this.#initAddButton();
  }

  render(forceRefresh = false) {
    if (!forceRefresh && this.#productsCache) {
      this.#renderProducts();
      return;
    }
    ShopService.getProducts()
      .then((res) => {
        this.#productsCache = res;
        this.#renderProducts();
      })
      .catch(() => {
        alert("Не удалось получить данные");
      });
  }
}
