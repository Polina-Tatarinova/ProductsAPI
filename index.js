const API_PRODUCTS = "http://localhost:3000/product";
const API_CART = "http://localhost:3000/cart";

let globalProduct = [];

function incCart(cartId, productId) {
  console.log("incCart", cartId, productId);
  fetch(API_CART)
    .then((res) => res.json())
    .then((cartData) => {
      const item = cartData.find((i) => i.id == cartId);
      if (!item) return;
      fetch(`${API_CART}/${cartId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      })
        .then(() => {
          const product = globalProduct.find((p) => p.id == productId);
          if (product && product.stock > 0) {
            fetch(`${API_PRODUCTS}/${productId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stock: product.stock - 1 }),
            })
              .then(() => {
                product.stock--;
                const card = document.querySelector(
                  `div[data-product-id='${productId}']`,
                );
                if (card)
                  card.textContent = `${product.name}, цена: ${product.price}₽, остаток: ${product.stock}`;
                updateCartDispley();
              })
              .catch((err) => console.error(err));
          } else {
            updateCartDispley();
          }
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}

function decCart(cartId, productId) {
  console.log("decCart", cartId, productId);
  fetch(API_CART)
    .then((res) => res.json())
    .then((cartData) => {
      const item = cartData.find((i) => i.id == cartId);
      if (!item) return;
      if (item.quantity > 1) {
        fetch(`${API_CART}/${cartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        })
          .then(() => {
            const product = globalProduct.find((p) => p.id == productId);
            if (product) {
              fetch(`${API_PRODUCTS}/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: product.stock + 1 }),
              })
                .then(() => {
                  product.stock++;
                  const card = document.querySelector(
                    `div[data-product-id='${productId}']`,
                  );
                  if (card)
                    card.textContent = `${product.name}, цена: ${product.price}₽, остаток: ${product.stock}`;
                  updateCartDispley();
                })
                .catch((err) => console.error(err));
            } else {
              updateCartDispley();
            }
          })
          .catch((err) => console.error(err));
      } else {
        fetch(`${API_CART}/${cartId}`, { method: "DELETE" })
          .then(() => {
            const product = globalProduct.find((p) => p.id == productId);
            if (product) {
              fetch(`${API_PRODUCTS}/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: product.stock + 1 }),
              })
                .then(() => {
                  product.stock++;
                  const card = document.querySelector(
                    `div[data-product-id='${productId}']`,
                  );
                  if (card)
                    card.textContent = `${product.name}, цена: ${product.price}₽, остаток: ${product.stock}`;
                  updateCartDispley();
                })
                .catch((err) => console.error(err));
            } else {
              updateCartDispley();
            }
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
}

function delCart(cartId, productId) {
  console.log("delCart", cartId, productId);
  fetch(API_CART)
    .then((res) => res.json())
    .then((cartData) => {
      const item = cartData.find((i) => i.id == cartId);
      if (!item) return;
      const product = globalProduct.find((p) => p.id == productId);
      if (product) {
        fetch(`${API_PRODUCTS}/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: product.stock + item.quantity }),
        })
          .then(() => {
            product.stock += item.quantity;
            const card = document.querySelector(
              `div[data-product-id='${productId}']`,
            );
            if (card)
              card.textContent = `${product.name}, цена: ${product.price}₽, остаток: ${product.stock}`;
            fetch(`${API_CART}/${cartId}`, { method: "DELETE" })
              .then(() => updateCartDispley())
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      } else {
        fetch(`${API_CART}/${cartId}`, { method: "DELETE" })
          .then(() => updateCartDispley())
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
}

function updateCartDispley() {
  fetch(API_CART)
    .then((res) => res.json())
    .then((cart) => {
      const cartContener = document.getElementById("cart-container");
      const cartTotalDiv = document.getElementById("cart-total");
      if (cart.length === 0) {
        cartContener.innerHTML = "Корзина пуста";
        cartTotalDiv.innerHTML = "";
        return;
      }
      let html = "<ul>";
      let total = 0;
      cart.forEach((item) => {
        const sum = item.price * item.quantity;
        total += sum;
        html += `
          <li>
            ${item.name} — ${item.quantity} шт. × ${item.price}₽ = ${sum}₽
            <button onclick="incCart('${item.id}', ${item.productId})">+</button>
            <button onclick="decCart('${item.id}', ${item.productId})">-</button>
            <button onclick="delCart('${item.id}', ${item.productId})">Удалить</button>
          </li>
        `;
      });
      html += "</ul>";
      cartContener.innerHTML = html;
      cartTotalDiv.innerHTML = `Общая сумма: ${total}₽`;
    })
    .catch((err) => console.error("Ошибка обновления корзины:", err));
}

fetch(API_PRODUCTS, {
  method: "GET",
  headers: { "Content-type": "application/json; charset=UTF-8" },
})
  .then((response) => {
    if (!response.ok) throw new Error("Error occurred!");
    return response.json();
  })
  .then((products) => {
    console.log("Товары загружены, количество:", products.length);
    globalProduct = products;
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    products.forEach((product) => {
      if (product.name && product.price !== undefined) {
        const card = document.createElement("div");
        card.setAttribute("data-product-id", product.id);
        card.textContent = `${product.name}, цена:${product.price}₽, (остаток: ${product.stock ?? 0})`;

        const buttonAdd = document.createElement("button");
        buttonAdd.textContent = "Добавить товар";
        buttonAdd.style.padding = "6px 12px";
        buttonAdd.style.marginLeft = "10px";

        buttonAdd.addEventListener("click", () => {
          if (product.stock <= 0) {
            alert("Товар закончился!");
            return;
          }
          console.log("Добавляем товар, остаток до:", product.stock);
          fetch(`${API_PRODUCTS}/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: product.stock - 1 }),
          })
            .then((stockResponce) => {
              if (!stockResponce.ok)
                throw new Error("Не удалось обновить остаток");
              return stockResponce.json();
            })
            .then((updatedProdct) => {
              product.stock = updatedProdct.stock;
              card.textContent = `${product.name}, цена: ${product.price}₽, остаток: ${product.stock}`;
              fetch(API_CART)
                .then((res) => res.json())
                .then((cart) => {
                  const existinItem = cart.find(
                    (item) => item.productId === product.id,
                  );
                  if (existinItem) {
                    fetch(`${API_CART}/${existinItem.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        quantity: existinItem.quantity + 1,
                      }),
                    })
                      .then(() => {
                        alert(`Товар "${product.name}" добавлен в корзину!`);
                        updateCartDispley();
                      })
                      .catch((err) => console.error(err));
                  } else {
                    fetch(API_CART, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                      }),
                    })
                      .then(() => {
                        alert(`Товар "${product.name}" добавлен в корзину!`);
                        updateCartDispley();
                      })
                      .catch((err) => console.error(err));
                  }
                })
                .catch((err) => console.error(err));
            })
            .catch((error) => {
              console.error("Ошибка при добавлении:", error);
              alert("Не удалось добавить товар. Проверьте сервер.");
            });
        });

        card.appendChild(buttonAdd);
        container.appendChild(card);
      }
    });
    updateCartDispley();
  })
  .catch((err) => console.log(err));

document.getElementById("clear-cart-btn").addEventListener("click", () => {
  console.log("Очистка корзины");
  fetch(API_CART)
    .then((res) => res.json())
    .then((cart) => {
      const promises = [];
      cart.forEach((item) => {
        const product = globalProduct.find((p) => p.id == item.productId);
        if (product) {
          promises.push(
            fetch(`${API_PRODUCTS}/${product.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stock: product.stock + item.quantity }),
            }).then(() => {
              product.stock += item.quantity;
              const card = document.querySelector(
                `div[data-product-id='${product.id}']`,
              );
              if (card) {
                card.textContent = `${product.name}, цена: ${product.price}₽, остаток: ${product.stock}`;
              }
            }),
          );
        }
        promises.push(fetch(`${API_CART}/${item.id}`, { method: "DELETE" }));
      });
      Promise.all(promises)
        .then(() => {
          updateCartDispley();
          alert("Корзина очищена, остатки восстановлены");
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  console.log("Оформление заказа");
  fetch(API_CART)
    .then((res) => res.json())
    .then((cart) => {
      if (cart.length === 0) {
        alert("Корзина пуста");
        return;
      }
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      };
      let orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      const deletePromises = cart.map((item) =>
        fetch(`${API_CART}/${item.id}`, { method: "DELETE" }),
      );
      Promise.all(deletePromises)
        .then(() => {
          updateCartDispley();
          const ordersContainer = document.getElementById("orders-container");
          if (orders.length === 0) {
            ordersContainer.innerHTML = "Нет оформленных заказов";
          } else {
            let html = "";
            orders.forEach((order) => {
              html += `<div><strong>Заказ #${order.id}</strong> (${order.date})<br>Сумма: ${order.total}₽<br><ul>`;
              order.items.forEach((it) => {
                html += `<li>${it.name} — ${it.quantity} шт. × ${it.price}₽</li>`;
              });
              html += `</ul></div><hr>`;
            });
            ordersContainer.innerHTML = html;
          }
          alert(`Заказ оформлен на сумму ${total}₽`);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

document.getElementById("clear-history-btn").addEventListener("click", () => {
  localStorage.removeItem("orders");
  document.getElementById("orders-container").innerHTML =
    "Нет оформленных заказов";
  alert("История заказов очищена");
});

window.addEventListener("load", () => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const ordersContainer = document.getElementById("orders-container");
  if (orders.length === 0) {
    ordersContainer.innerHTML = "Нет оформленных заказов";
  } else {
    let html = "";
    orders.forEach((order) => {
      html += `<div><strong>Заказ #${order.id}</strong> (${order.date})<br>Сумма: ${order.total}₽<br><ul>`;
      order.items.forEach((it) => {
        html += `<li>${it.name} — ${it.quantity} шт. × ${it.price}₽</li>`;
      });
      html += `</ul></div><hr>`;
    });
    ordersContainer.innerHTML = html;
  }
});
