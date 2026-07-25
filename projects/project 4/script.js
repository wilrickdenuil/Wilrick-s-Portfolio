// 1. Class (model van een product)
class CreateProduct {
  constructor(category, id, name, price, color, schuim) {
    this.category = category;
    this.id = id;
    this.name = name;
    this.price = price;
    this.color = color;
    this.extra = schuim;
  }
}

const products = {
  "hot-coffee": [],
  size: [],
  extras: [],
};

function addProduct(category, id, name, price, color, schuim) {
  if (!products[category]) {
    products[category] = [];
  }

  const product = new CreateProduct(category, id, name, price, color, schuim);
  products[category].push(product);
}

// Hot Coffee
addProduct("hot-coffee", 1, "espresso", 2.8, "#3B2416", "no");
addProduct("hot-coffee", 2, "americano", 3.2, "#5A3A22", "no");
addProduct("hot-coffee", 3, "koffie", 2.6, "#6F4E37", "no");
addProduct("hot-coffee", 4, "cappuccino", 3.9, "#8B5E3C", "yes");
addProduct("hot-coffee", 5, "latte", 4.2, "#A56B46", "yes");
addProduct("hot-coffee", 6, "flat-white", 4.1, "#7A4A2A", "yes");
addProduct("hot-coffee", 7, "latte-macchiato", 4.5, "#B37A4C", "yes");
addProduct("hot-coffee", 8, "mocha", 4.8, "#5C3A2E", "yes");

// Sizes
addProduct("size", 12, "small", 0.0, null, "no");
addProduct("size", 13, "medium", 0.5, null, "no");
addProduct("size", 14, "large", 1.0, null, "no");

// Extras
addProduct("extras", 15, "extra-shot", 0.8, null, "no");
addProduct("extras", 16, "haver-melk", 0.6, null, "no");
addProduct("extras", 17, "smaak-shot", 0.7, null, "no");
addProduct("extras", 18, "slagroom", 0.5, null, "yes");
addProduct("extras", 19, "sauzen", 0.6, null, "no");

function formatCurrency(value) {
  return `€${value.toFixed(2)}`;
}

function formatLabel(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSelectedProducts(category) {
  if (category === "extras") {
    const checkedExtras = Array.from(
      document.querySelectorAll('input[name="extras"]:checked'),
    ).map((input) => input.value);

    return checkedExtras
      .map((value) =>
        products[category].find((product) => product.name === value),
      )
      .filter(Boolean);
  }

  const selectedInput = document.querySelector(
    `input[name="${category}"]:checked`,
  );

  if (!selectedInput) {
    return [];
  }

  const product = products[category].find(
    (item) => item.name === selectedInput.value,
  );

  return product ? [product] : [];
}

function updatePreview() {
  const selectedCoffee = document.querySelector(
    'input[name="hot-coffee"]:checked',
  );
  const selectedSize = document.querySelector('input[name="size"]:checked');
  const coffeeFill = document.querySelector(".koffie-vulling");
  const coffeeFoam = document.querySelector(".koffie-schuim");

  if (!coffeeFill || !coffeeFoam) {
    return;
  }

  let fillHeight = "0%";

  if (!selectedCoffee) {
    fillHeight = "0%";
  } else if (selectedSize) {
    if (selectedSize.value === "small") {
      fillHeight = "45%";
    } else if (selectedSize.value === "medium") {
      fillHeight = "60%";
    } else if (selectedSize.value === "large") {
      fillHeight = "75%";
    }
  } else {
    fillHeight = "60%";
  }

  coffeeFill.style.height = fillHeight;

  const fillPercent = parseFloat(fillHeight);
  const foamHeight =
    !selectedCoffee || fillPercent <= 0
      ? "0%"
      : `${Math.min(100, fillPercent + 8)}%`;
  coffeeFoam.style.height = foamHeight;

  if (!selectedCoffee) {
    coffeeFill.style.background = "transparent";
    coffeeFoam.classList.remove("active");
    return;
  }

  const product = products["hot-coffee"].find(
    (item) => item.name === selectedCoffee.value,
  );

  if (product) {
    coffeeFill.style.background = product.color || "#6f4e37";
    if (product.extra === "yes") {
      coffeeFoam.classList.add("active");
    } else {
      coffeeFoam.classList.remove("active");
    }
  }
}

function renderSummary() {
  const orderItems = document.getElementById("order-items");
  const subtotalEl = document.querySelector(".subtotal");
  const taxEl = document.querySelector(".tax");
  const totalEl = document.querySelector(".total");

  if (!orderItems || !subtotalEl || !taxEl || !totalEl) {
    return;
  }

  const selectedItems = [
    ...getSelectedProducts("hot-coffee"),
    ...getSelectedProducts("size"),
    ...getSelectedProducts("extras"),
  ];

  orderItems.innerHTML = "";

  if (selectedItems.length === 0) {
    orderItems.innerHTML = `
      <div class="item-row">
        <h4 class="order-label">Geen koffie geselecteerd</h4>
        <span>€0.00</span>
      </div>
    `;
  } else {
    selectedItems.forEach((item) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <h4 class="order-label">${formatLabel(item.name)}</h4>
        <span>${formatCurrency(item.price)}</span>
      `;
      orderItems.appendChild(row);
    });
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.09;
  const total = subtotal + tax;

  subtotalEl.textContent = formatCurrency(subtotal);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(total);

  updatePreview();
}

document
  .querySelectorAll(
    'input[name="hot-coffee"], input[name="size"], input[name="extras"]',
  )
  .forEach((input) => {
    input.addEventListener("change", renderSummary);
  });

renderSummary();
