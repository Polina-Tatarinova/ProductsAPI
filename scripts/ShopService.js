export default class ShopService {
  static BASE_URL = "http://localhost:3000";

  static async #checkResponseStatus(res, asJson = true) {
    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage =
        errorData?.errorMessage || `Ошибка: ${res.status} ${res.statusText}`;
      throw errorMessage;
    }
    return asJson ? res.json() : res.text();
  }

  static async getProducts() {
    const res = await fetch(this.BASE_URL + `/product`);
    return this.#checkResponseStatus(res);
  }

  static async buyProduct(id) {
    const res = await fetch(this.BASE_URL + `/product/${id}/purchase`, {
      method: "PATCH",
    });
    return this.#checkResponseStatus(res);
  }

  static async checkAdministratorRights(token) {
    const res = await fetch(this.BASE_URL + `/adminPanel`, {
      headers: { token },
    });
    return this.#checkResponseStatus(res, false);
  }

  static async changeProduct(id, body) {
    const res = await fetch(this.BASE_URL + `/product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return this.#checkResponseStatus(res);
  }

  static async deleteProduct(id) {
    const res = await fetch(this.BASE_URL + `/product/${id}`, {
      method: "DELETE",
    });
    return this.#checkResponseStatus(res);
  }

  static async createNewProduct(newProduct) {
    const res = await fetch(this.BASE_URL + `/product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    return this.#checkResponseStatus(res);
  }
}
