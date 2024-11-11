const basket = [
  {
    id: 1,
    title: "Waffle",
    name: "Waffle with Berries",
    price: 6.5,
    image: "assets/images/waffle-img.svg",
    quantity: 0,
  },
  {
    id: 2,
    title: "Crème Brûlée",
    name: "Vanilla Bean Crème Brûlée",
    price: 7.0,
    image: "assets/images/vanilla-bean-img.svg",
    quantity: 0,
  },
  {
    id: 3,
    title: "Macaron",
    name: "Macaron Mix of Five",
    price: 8.0,
    image: "assets/images/macaron-img.svg",
    quantity: 0,
  },
  {
    id: 4,
    title: "Tiramisu",
    name: "Classic Tiramisu",
    price: 5.5,
    image: "assets/images/tiramisu-img.svg",
    quantity: 0,
  },
  {
    id: 5,
    title: "Baklava",
    name: "Pistachio Baklava",
    price: 4.0,
    image: "assets/images/baklava-img.svg",
    quantity: 0,
  },
  {
    id: 6,
    title: "Pie",
    name: "Lemon Meringue Pie",
    price: 5.0,
    image: "assets/images/lemon-img.svg",
    quantity: 0,
  },
  {
    id: 7,
    title: "Cake",
    name: "Red Velvet Cake",
    price: 4.5,
    image: "assets/images/red-velvet-img.svg",
    quantity: 0,
  },
  {
    id: 8,
    title: "Brownie",
    name: "Salted Caramel Brownie",
    price: 5.5,
    image: "assets/images/brownie-img.svg",
    quantity: 0,
  },
  {
    id: 9,
    title: "Panna Cotta",
    name: "Vanilla Panna Cotta",
    price: 6.5,
    image: "assets/images/panna-cotta-img.svg",
    quantity: 0,
  },
];

const emptyCart = document.querySelector(".emptyCart");
const productList = document.querySelector(".productList");
const orderList = document.querySelector(".orders");
const cartCount = document.querySelector(".totalCartText");
const fullBasket = document.querySelector(".fullBasket");
const confirmBtn = document.querySelector(".confirmBtn");
const orders = [];
let totalQuantity = 0;
let totalPrice = 0;

function renderOrders() {
  orderList.innerHTML = "";
  for (const order of orders) {
    if (order.quantity > 0) {
      emptyCart.classList.add("none");
      orderList.innerHTML += `
      <li>
        <div class="orderLi">
          <h6>${order.name}</h6>    
          <p class="orderTexts">
            <span class="orderQuantity">${order.quantity}x </span>
            <span class="orderPrice">@ $${order.price.toFixed(2)}</span>
            <span class="orderQuantityPrice"> $${(
              order.quantity * order.price
            ).toFixed(2)}</span>
          </p>
        </div>
        <button class="orderDeleteBtn" data-id="${
          order.id
        }"><img src="assets/images/order-delete-btn.svg" alt="Order Delete Buton"></button>
      </li>`;
    }
  }
  calculateTotalPrice();

  orderList.innerHTML += `
    <li class="total-price">
      <h4>Order Total</h4>
      <p>$${totalPrice.toFixed(2)}</p>
    </li>
    `;

  const orderDeleteBtns = document.querySelectorAll(".orderDeleteBtn");
  for (const btn of orderDeleteBtns) {
    btn.addEventListener("click", removeOrder);
  }
}

function listProducts() {
  productList.innerHTML = "";
  for (const product of basket) {
    productList.innerHTML += `
    <li class="product" data-id="${product.id}" >
        <img class="productImg" src="${product.image}" alt="${product.title}">
          ${
            product.quantity === 0
              ? `<button class="addToCartBtn" data-id="${product.id}"><img src="assets/images/basket-img.svg" alt="Basket Image">Add to Cart</button>`
              : `<div class="productsBtns"><button class="removeBtn" data-id="${product.id}"><img src="assets/images/minus-icon.svg" alt=""></button><span class="quantityText">${product.quantity}</span><button class="addBtn" data-id="${product.id}"><img src="assets/images/plus-icon.svg" alt=""></button></div>`
          }
        <div class="productText">
          <p class="productTitle">${product.title}</p>
          <p class="productName">${product.name}</p>
          <p class="productPrice">$${product.price.toFixed(2)}</p>
        </div>
    </li>
    `;
  }

  const addToCartBtns = document.querySelectorAll(".addToCartBtn");
  for (const btn of addToCartBtns) {
    btn.addEventListener("click", addToCartAndShowButtons);
  }

  const addBtns = document.querySelectorAll(".addBtn");
  for (const btn of addBtns) {
    btn.addEventListener("click", addToCard);
  }

  const removeBtns = document.querySelectorAll(".removeBtn");
  for (const btn of removeBtns) {
    btn.addEventListener("click", removeFromCard);
  }
}

listProducts();

function removeOrder() {
  const productId = parseInt(this.dataset.id);

  const orderIndex = orders.findIndex((order) => order.id === productId);
  if (orderIndex > -1) {
    const order = orders[orderIndex];
    totalQuantity -= order.quantity;
    orders.splice(orderIndex, 1);
  }

  const product = basket.find((product) => product.id === productId);
  if (product) {
    product.quantity = 0;
  }
  if (orders.length === 0) {
    emptyCart.classList.remove("none");
    orderList.classList.add("none");
    fullBasket.classList.add("none");
  } else {
    emptyCart.classList.add("none");
    orderList.classList.remove("none");
    fullBasket.classList.remove("none");
    renderOrders();
  }

  this.parentElement.remove();
  listProducts();
  calculateTotalPrice();
  updateCartCount();
}

function addToCard() {
  const productId = this.dataset.id;
  const product = basket.find((x) => x.id == productId);

  if (product) {
    product.quantity++;
    totalQuantity++;
    const addedOrder = orders.find((order) => order.name === product.name);
    if (addedOrder) {
      addedOrder.quantity = product.quantity;
    } else {
      orders.push({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
      });
    }

    emptyCart.classList.add("none");
    orderList.classList.remove("none");
    fullBasket.classList.remove("none");

    listProducts();
    renderOrders();
    updateCartCount();
    calculateTotalPrice();
  }
}

function removeFromCard() {
  const productId = this.dataset.id;
  const product = basket.find((x) => x.id == productId);

  if (product) {
    if (product.quantity > 0) {
      product.quantity--;
      totalQuantity--;
      const removedOrder = orders.find((order) => order.id === product.id);
      if (removedOrder) {
        removedOrder.quantity = product.quantity;
        if (removedOrder.quantity === 0) {
          const index = orders.indexOf(removedOrder);
          if (index > -1) {
            orders.splice(index, 1)
          };
        }
      }
      listProducts();
      renderOrders();
      updateCartCount();
      calculateTotalPrice();
    } else if (product.quantity === 0) {
      emptyCart.classList.remove("none");
      orderList.classList.add("none");
      fullBasket.classList.add("none");
    }
  }
}

function addToCartAndShowButtons() {
  const productId = this.dataset.id;
  const product = basket.find((x) => x.id == productId);
  const productImg = document.querySelector(
    `.product[data-id="${productId}"] .productImg`
  );
  if (product) {
    productImg.classList.add("bordered");
    console.log(productImg.classList);
    product.quantity = 1;
    totalQuantity++;
    orders.push({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      image: product.image,
    });

    emptyCart.classList.add("none");
    orderList.classList.remove("none");
    fullBasket.classList.remove("none");

    listProducts();
    renderOrders();
    updateCartCount();
    calculateTotalPrice();
  }
}

function updateCartCount() {
  cartCount.textContent = totalQuantity;
}

function calculateTotalPrice() {
  totalQuantity = 0;
  totalPrice = 0;
  for (const item of basket) {
    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.price;
  }
  const totalPriceElement = document.querySelector(".total-price p");
  if (totalPriceElement) {
    totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
  }
}

confirmBtn.addEventListener("click", function () {
  const overlay = document.querySelector(".overlay");
  const orderProducts = document.querySelector(".orderProducts");
  orderProducts.innerHTML = "";
  for (const order of orders) {
    if (order.quantity > 0) {
      emptyCart.classList.add("none");
      orderProducts.innerHTML += `
        <li>
          <div class="orderProductsInner">
             <img class="productOrderImg" src="${order.image}" alt="${
        order.title
      }">
            <div class="orderLi">
              <h6>${order.name}</h6>    
              <p class="orderTexts">
                <span class="orderQuantity">${order.quantity}x </span>
                <span class="orderPrice">@ $${order.price.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <p class="orderQuantityPrice"> $${(
            order.quantity * order.price
          ).toFixed(2)}</p>
        </li>
        `;
    }
  }
  orderProducts.innerHTML += `<li class="total-price">
      <h4>Order Total</h4>
      <p>$${totalPrice.toFixed(2)}</p>
    </li>`;
  overlay.style.display = "flex";
});

const newOrderBtn = document.querySelector(".newOrderBtn");

newOrderBtn.addEventListener("click", function () {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "none";
});
