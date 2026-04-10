import ShopService from "./ShopService.js";

export default class UIRenderer {
    getImageUrl(imageUrl) {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `http://localhost:3000${imageUrl}`;
    return `http://localhost:3000/${imageUrl}`;
    }
  
    render() {
    ShopService.getProducts()
      .then((res) => {
        const productsContainer = document.querySelector(
          "#products__containers",
        );
        productsContainer.innerHTML = "";
        const template = document.querySelector(".product__container");
        res.forEach((product) => {
          const templateCardProduct = template.content.cloneNode(true);
          templateCardProduct.querySelector(".product__name").textContent =
            product.name;
         const imgProduct =
           templateCardProduct.querySelector(".product__picture");
         imgProduct.src = this.getImageUrl(product.imageUrl)
         imgProduct.alt = product.name
          templateCardProduct.querySelector(".product__price").innerHTML =
            `<b>Цена:</b> ${product.price} рублей`;
          templateCardProduct.querySelector(
            ".product__description",
          ).innerHTML = `<b>Характеристикa:</b> ${product.description}`;
          templateCardProduct.querySelector(".product__category").innerHTML = `<b>Категория:</b> ${product.category}`;
          templateCardProduct.querySelector(".product__stock").innerHTML = `<b>Остаток на складе:</b> ${product.stock}`;
          templateCardProduct.querySelector(".product__rating").innerHTML = `<b>ейтинг:</b>Р ${product.rating}`
            product.rating;
     
            productsContainer.appendChild(templateCardProduct);

        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}