import ShopService from "./ShopService.js";

export default class UIRenderer {
  #getImageUrl(imageUrl) {
    return imageUrl.startsWith("/")
      ? `${ShopService.BASE_URL}${imageUrl}`
      : imageUrl;
  }

  renderAdmin() {

  }

  render() {
    ShopService.getProducts()
      .then((res) => {
        const productsContainer = document.querySelector("#products-list");
        productsContainer.innerHTML = "";
        const template = document.querySelector("#product-template");
        res.forEach((product) => {
          const templateCardProduct = template.content.cloneNode(true);
          templateCardProduct.querySelector(".product__name").textContent =
            product.name;
          const imgProduct =
            templateCardProduct.querySelector(".product__image");
          imgProduct.src = this.#getImageUrl(product.imageUrl);
          imgProduct.alt = product.name;
          const priceLi = templateCardProduct.querySelector(".product__price");
          priceLi.appendChild(
            document.createTextNode(` ${product.price} рублей`),
          );
          const descLi = templateCardProduct.querySelector(
            ".product__description",
          );
          descLi.appendChild(
            document.createTextNode(` ${product.description}`),
          );
          const categoryLi =
            templateCardProduct.querySelector(".product__category");
          categoryLi.appendChild(
            document.createTextNode(` ${product.category}`),
          );
          const stockLi = templateCardProduct.querySelector(".product__stock");
          stockLi.appendChild(
            document.createTextNode(` ${product.stock} штук`),
          );
          const ratingLi =
            templateCardProduct.querySelector(".product__rating");
          ratingLi.appendChild(document.createTextNode(` ${product.rating}`));

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
}
