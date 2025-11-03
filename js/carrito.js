// ==========================
// cart.js - Carrito global
// ==========================

let cart = [];

// Verificar usuario
function autenticado() {
  return localStorage.getItem('user') !== null;
}
if (!autenticado()) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded",()=>{
    let user = localStorage.getItem("user");

    document.getElementById("sesion").textContent = user;
    document.getElementById("perfil").addEventListener("click", function() {
        window.location = "my-profile.html"});
    document.getElementById("cerrarsesion").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location = "login.html"
    });

    
})

function toggleThemeCheckbox() {
    const checkbox = document.getElementById('themeSwitch');
    const html = document.documentElement;
    
    // Si está marcado = modo oscuro, si no = modo claro
    if (checkbox.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Cargar estado al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const checkbox = document.getElementById('themeSwitch');
    
    // Marcar o desmarcar según el tema guardado
    checkbox.checked = (savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Cargar carrito desde localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  cart = savedCart ? JSON.parse(savedCart) : [];
}
window.loadCart = loadCart;

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
window.saveCart = saveCart;

// Actualizar badge
function updateCartBadge() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = totalItems;
}
window.updateCartBadge = updateCartBadge;

// Mensajes
function mostrarMensaje(mensaje, tipo = 'info') {
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) existingAlert.remove();

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo} alert-dismissible fade show mt-3`;
  alertDiv.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  const container = document.querySelector('main .container');
  if (container) container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => { if (alertDiv.parentNode) alertDiv.remove(); }, 5000);
}
window.mostrarMensaje = mostrarMensaje;

// Agregar producto
function addToCart(product) {
  if (!product || !product.id) return;

  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.images ? product.images[0] : product.image || '',
      price: product.cost,
      currency: product.currency,
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  mostrarMensaje('Producto agregado al carrito', 'success');
}
window.addToCart = addToCart;

// Eliminar producto
function removeFromCart(productId) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCartPage();
    mostrarMensaje('Producto eliminado del carrito', 'info');
  }
}
window.removeFromCart = removeFromCart;

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart();
    updateCartBadge();
    renderCartPage();
  }
}
window.updateQuantity = updateQuantity;

// ==========================
// Renderizar página de carrito
// ==========================

function renderCartPage() {
  const container = document.getElementById('cart-container');
  const totalElement = document.getElementById('cart-total');
  const itemsCountElement = document.getElementById('cart-items-count');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
        <div class="empty-cart card">
          <div class="card-body text-center">
            <i class="fa fa-shopping-cart fa-4x text-muted mb-3"></i>
            <h3 class="text-muted">Tu carrito está vacío</h3>
            <a href="categories.html" class="btn btn-primary mt-3">
              <i class="fa fa-shopping-bag"></i> Ir de Compras
            </a>
          </div>
        </div>
      `;
    if (totalElement) totalElement.textContent = '0';
    if (itemsCountElement) itemsCountElement.textContent = '0 productos';
    return;
  }

  let totalUSD = 0;
  let totalItems = 0;
  container.innerHTML = '';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalItems += item.quantity;
    if (item.currency === "USD") totalUSD += itemTotal;
    else totalUSD += itemTotal / 40; // convertir pesos a dólares

    container.innerHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-2">
                <img src="${item.image}" class="cart-item-image img-thumbnail" alt="${item.name}">
              </div>
              <div class="col-md-4">
                <h5 class="card-title">${item.name}</h5>
                <p class="text-muted mb-0">${item.currency} ${item.price}</p>
              </div>
              <div class="col-md-3">
                <div class="quantity-controls">
                  <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fa fa-minus"></i>
                  </button>
                  <span class="mx-3 fw-bold">${item.quantity}</span>
                  <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-2 text-center">
                <h5 class="text-primary">${item.currency} ${(itemTotal).toLocaleString('es-UY', {minimumFractionDigits:2})}</h5>
              </div>
              <div class="col-md-1 text-center">
                <button class="btn btn-outline-danger" onclick="removeFromCart(${item.id})">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
  });

  // Mostrar total según moneda elegida
  updateDisplayedTotal(totalUSD, totalItems);
}
window.renderCartPage = renderCartPage;

// ==========================
// Mostrar total en USD o UYU
// ==========================
const exchangeRate = 40;

function updateDisplayedTotal(totalUSD, totalItems) {
  const currencySelect = document.getElementById("currency-select");
  const totalElement = document.getElementById("cart-total");
  const itemsCountElement = document.getElementById("cart-items-count");

  if (!currencySelect || !totalElement) return;

  const selectedCurrency = currencySelect.value;
  let displayedTotal;

  if (selectedCurrency === "USD") {
    displayedTotal = totalUSD;
    totalElement.textContent = `USD ${displayedTotal.toLocaleString('es-UY', {minimumFractionDigits:2})}`;
  } else {
    displayedTotal = totalUSD * exchangeRate;
    totalElement.textContent = `UYU ${displayedTotal.toLocaleString('es-UY', {minimumFractionDigits:2})}`;
  }

  if (itemsCountElement)
    itemsCountElement.textContent = `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;
}

// Detectar cambio de moneda
document.addEventListener("change", e => {
  if (e.target && e.target.id === "currency-select") {
    renderCartPage();
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartBadge();
  renderCartPage();
});


