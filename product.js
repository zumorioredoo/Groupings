          const cartDialog = document.getElementById("cartDialog");
          const cartItemsElement = document.getElementById("cartItems");
          const cartCount = document.getElementById("cartCount");
          const cartTotal = document.getElementById("cartTotal");
          const cart = new Map();
          const products = new Map(
              [...document.querySelectorAll(".product-card")].map((card) => [card.dataset.productId, {
                  name: card.dataset.name,
                  price: Number(card.dataset.price),
              }]),
          );

          try {
              const savedCart = JSON.parse(localStorage.getItem("mochara-cart") || "{}");
              for (const [id, quantity] of Object.entries(savedCart)) {
                  if (products.has(id) && Number.isInteger(quantity) && quantity > 0) {
                      cart.set(id, quantity);
                  }
              }
          } catch {
              try {
                  localStorage.removeItem("mochara-cart");
              } catch {
              }
          }

          function createQuantityButton(symbol, action, id) {
              const button = document.createElement("button");
              button.type = "button";
              button.className = "quantity-button";
              button.textContent = symbol;
              button.setAttribute("aria-label", `${action} ${products.get(id).name}`);
              button.dataset.cartAction = action;
              button.dataset.productId = id;
              return button;
          }

          function renderCart() {
              cartItemsElement.replaceChildren();
              let itemCount = 0;
              let total = 0;

              for (const [id, quantity] of cart) {
                  const product = products.get(id);
                  itemCount += quantity;
                  total += product.price * quantity;

                  const row = document.createElement("article");
                  row.className = "cart-item";
                  const details = document.createElement("div");
                  const name = document.createElement("h3");
                  name.textContent = product.name;
                  const price = document.createElement("p");
                  price.textContent = `$${product.price} · 12 oz`;
                  details.append(name, price);

                  const controls = document.createElement("div");
                  controls.className = "quantity-controls";
                  controls.setAttribute("aria-label", `${product.name} quantity`);
                  controls.append(
                      createQuantityButton("−", "Decrease", id),
                      Object.assign(document.createElement("span"), { textContent: quantity }),
                      createQuantityButton("+", "Increase", id),
                  );
                  row.append(details, controls);
                  cartItemsElement.append(row);
              }

              if (cart.size === 0) {
                  const emptyMessage = document.createElement("p");
                  emptyMessage.className = "cart-empty";
                  emptyMessage.textContent = "Your cart is empty. Add a bag of beans to get started.";
                  cartItemsElement.append(emptyMessage);
              }

              cartCount.textContent = itemCount;
              cartTotal.textContent = `$${total}`;
              try {
                  localStorage.setItem("mochara-cart", JSON.stringify(Object.fromEntries(cart)));
              } catch {
              }
          }

          document.getElementById("openCartButton").addEventListener("click", () => cartDialog.showModal());
          document.getElementById("closeCartButton").addEventListener("click", () => cartDialog.close());

          document.querySelectorAll(".add-to-cart").forEach((button) => {
              button.addEventListener("click", () => {
                  const id = button.closest(".product-card").dataset.productId;
                  cart.set(id, (cart.get(id) || 0) + 1);
                  renderCart();
                  button.textContent = "Added";
                  window.setTimeout(() => { button.textContent = "Add to cart"; }, 900);
              });
          });

          cartItemsElement.addEventListener("click", (event) => {
              const button = event.target.closest("[data-cart-action]");
              if (!button) return;

              const id = button.dataset.productId;
              const quantity = cart.get(id) + (button.dataset.cartAction === "Increase" ? 1 : -1);
              if (quantity > 0) cart.set(id, quantity);
              else cart.delete(id);
              renderCart();
          });

          renderCart();
