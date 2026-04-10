export default class ShopService {
  static BASE_URL = "http://localhost:3000";

  static async getProducts() {
    return fetch(this.BASE_URL + `/product`).then((res) => {
      if (!res.ok) {
        throw "Не удалось получить товары";
      }
      return res.json();
    });
  }

  static async buyProduct(id) {
    return fetch(this.BASE_URL + `/product/${id}/purchase`, {
      method: "PATCH",
    }).then((res) => {
      if (!res.ok) {
        throw "Товар не найден";
      }
      return res.json();
    });
  }

  static async checkAdministratorRights(token) {
    return fetch(this.BASE_URL + `/adminPanel`, {
      headers: { token },
    }).then((res) => {
      if (!res.ok) {
        throw "Не удалось получить доступ к правам администратора";
      }
      return res.text();
    });
  }

  static async changeProduct(id, body) {
    return fetch(this.BASE_URL + `/product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) {
        throw "Не удалось изменить товар";
      }
      return response.json();
    });
  }

  static async deleteProduct(id) {
    return fetch(this.BASE_URL + `/product/${id}`, { method: "DELETE" }).then(
      (res) => {
        if (!res.ok) {
          throw "Не удалось удалить товар";
        }
        return res.json();
      },
    );
  }

  static async createNewProduct(newProduct) {
    return fetch(this.BASE_URL + `/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    }).then((res) => {
      if (!res.ok) {
        throw "Не удалось создать товар";
      }
      return res.json();
    });
  }
}
//юай рэндер -отвечает за отрисовку//рендер//парсить//локал сторeдж //UIRenderer 