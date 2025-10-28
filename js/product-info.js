let productData = null;
let commentsData = [];

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateCartBadge();

  const productId = localStorage.getItem("selectedProductID");
  if (productId) loadProduct(productId);
});

async function loadProduct(id) {
  const [prodRes, commRes] = await Promise.all([
    fetch(`https://japceibal.github.io/emercado-api/products/${id}.json`),
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${id}.json`)
  ]);

  productData = await prodRes.json();
  commentsData = await commRes.json();

  renderProduct(productData);
  renderComments(commentsData);
  renderRelated(productData.relatedProducts);
}

function renderProduct(product) {
  const container = document.getElementById("product-container");
  container.innerHTML = `
    <div class="col-md-6">
      <img id="main-image" src="${product.images[0]}" class="img-fluid rounded shadow mb-3" alt="${product.name}">
      <div class="d-flex flex-wrap gap-2">
        ${product.images.map(img => `<img src="${img}" class="gallery-thumb" style="width:80px; height:80px; cursor:pointer;">`).join("")}
      </div>
    </div>
    <div class="col-md-6">
      <h2>${product.name}</h2>
      <p><strong>Categoría:</strong> ${product.category}</p>
      <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
      <p><strong>Vendidos:</strong> ${product.soldCount}</p>
      <p>${product.description}</p>
      <button id="add-cart-btn" class="btn btn-success btn-lg">
        <i class="fa-solid fa-cart-shopping"></i> Agregar al carrito
      </button>
    </div>
  `;

  document.querySelectorAll(".gallery-thumb").forEach(img => {
    img.addEventListener("click", e => {
      document.getElementById("main-image").src = e.target.src;
    });
  });

  document.getElementById("add-cart-btn").addEventListener("click", () => {
    addToCart(product);
  });
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(i => i.id === product.id);

  if (existing) existing.quantity += 1;
  else cart.push({
    id: product.id,
    name: product.name,
    price: product.cost,
    currency: product.currency,
    image: product.images[0],
    quantity: 1
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  alert("Producto agregado al carrito ✅");
}

// ======== Comentarios ========
function renderComments(comments) {
  const container = document.getElementById("comments-container");
  container.innerHTML = comments.map(c => `
    <div class="card mb-3 p-3">
      <div class="d-flex justify-content-between">
        <strong>${c.user}</strong>
        <small>${new Date(c.dateTime).toLocaleString()}</small>
      </div>
      <div>${'★'.repeat(c.score)}${'☆'.repeat(5 - c.score)}</div>
      <p class="mb-0">${c.description}</p>
    </div>
  `).join("");
}

document.getElementById("rating-form").addEventListener("submit", e => {
  e.preventDefault();
  const text = document.getElementById("comment-text").value.trim();
  const rating = document.querySelector('input[name="rating"]:checked');

  if (!text || !rating) return alert("Completa todos los campos.");
  const newComment = {
    user: localStorage.getItem("user") || "Anónimo",
    description: text,
    score: parseInt(rating.value),
    dateTime: new Date().toISOString()
  };
  commentsData.unshift(newComment);
  renderComments(commentsData);
  e.target.reset();
});

// ======== Relacionados ========
function renderRelated(related) {
  const container = document.getElementById("related-container");
  container.innerHTML = related.map(r => `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card shadow-sm related-card" data-id="${r.id}">
        <img src="${r.image}" class="card-img-top" alt="${r.name}" style="height:180px; object-fit:cover;">
        <div class="card-body text-center">
          <h6>${r.name}</h6>
          <p>${r.currency} ${r.cost}</p>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".related-card").forEach(card => {
    card.addEventListener("click", () => {
      const newId = card.getAttribute("data-id");
      localStorage.setItem("selectedProductID", newId);
      loadProduct(newId);
    });
  });
}

// ======== Tema y badge ========
function initTheme() {
  const themeSwitch = document.getElementById("themeSwitch");
  const themeLabel = document.getElementById("themeLabel");
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "light";

  html.setAttribute("data-theme", savedTheme);
  themeSwitch.checked = savedTheme === "dark";
  themeLabel.textContent = savedTheme === "dark" ? "Modo Claro" : "Modo Oscuro";

  themeSwitch.addEventListener("change", () => {
    const newTheme = themeSwitch.checked ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeLabel.textContent = newTheme === "dark" ? "Modo Claro" : "Modo Oscuro";
  });
}

function updateCartBadge() {
  const saved = localStorage.getItem("cart");
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  if (!saved) badge.textContent = 0;
  else badge.textContent = JSON.parse(saved).reduce((a, b) => a + b.quantity, 0);
}
