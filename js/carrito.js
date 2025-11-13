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

// Modo claro y oscuro - Inicio
function modonoche() {
    const checkbox = document.getElementById('interruptor');
    const html = document.documentElement;
    
    // Si está marcado = modo oscuro, si no = modo claro
    if (checkbox.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('modo', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('modo', 'light');
    }
}

// Cargar estado al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('modo') || 'light';
    const checkbox = document.getElementById('interruptor');
    
    // Marcar o desmarcar según el tema guardado
    checkbox.checked = (savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Modo claro y oscuro - Fin

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
const existingAlert = document.querySelector('.custom-global-alert');
  if (existingAlert) existingAlert.remove();

  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo} alert-dismissible fade show custom-global-alert`;
  alertDiv.setAttribute('role', 'alert');

 
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '20px';
  alertDiv.style.left = '50%';
  alertDiv.style.transform = 'translateX(-50%)';
  alertDiv.style.zIndex = '2100';
  alertDiv.style.minWidth = '280px';
  alertDiv.style.maxWidth = '90%';
  alertDiv.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';

  alertDiv.innerHTML = `
    <div style="padding-right: 40px;">${mensaje}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" 
            style="position:absolute;right:8px;top:6px;"></button>
  `;

  document.body.appendChild(alertDiv);

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
    
    // Si el carrito quedó vacío, refrescar la página
    if (cart.length === 0) {
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      renderCartPage();
      mostrarMensaje('Producto eliminado del carrito', 'info');
    }
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
// CALCULAR TOTAL CON ENVÍO
// ==========================
function calcularTotalConEnvio() {
  // Calcular subtotal en USD
  let subtotalUSD = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    if (item.currency === "USD") {
      subtotalUSD += itemTotal;
    } else {
      subtotalUSD += itemTotal / 40; // convertir pesos a dólares
    }
  });

  // Obtener porcentaje de envío
  const tipoEnvioSelect = document.getElementById('TipoDeEnvio');
  let porcentajeEnvio = 0;
  let porcentajeDisplay = 0;
  
  if (tipoEnvioSelect) {
    const tipoEnvio = tipoEnvioSelect.value;
    switch(tipoEnvio) {
      case 'standard':
        porcentajeEnvio = 0.05; // 5%
        porcentajeDisplay = 5;
        break;
      case 'express':
        porcentajeEnvio = 0.07; // 7%
        porcentajeDisplay = 7;
        break;
      case 'premium':
        porcentajeEnvio = 0.15; // 15%
        porcentajeDisplay = 15;
        break;
    }
  }

  // Calcular costo de envío
  const costoEnvio = subtotalUSD * porcentajeEnvio;
  
  // Total final
  const totalFinal = subtotalUSD + costoEnvio;

  return {
    subtotal: subtotalUSD,
    costoEnvio: costoEnvio,
    total: totalFinal,
    porcentaje: porcentajeDisplay
  };
}

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

  let totalItems = 0;
  container.innerHTML = '';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalItems += item.quantity;

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

  // Actualizar total con envío
  updateDisplayedTotal(totalItems);
}
window.renderCartPage = renderCartPage;

// ==========================
// Mostrar total en USD o UYU con envío
// ==========================
const exchangeRate = 40;

function updateDisplayedTotal(totalItems) {
  const currencySelect = document.getElementById("currency-select");
  const totalElement = document.getElementById("cart-total");
  const itemsCountElement = document.getElementById("cart-items-count");

  if (!currencySelect || !totalElement) return;

  // Calcular totales con envío
  const totales = calcularTotalConEnvio();
  
  const selectedCurrency = currencySelect.value;
  let displayedSubtotal, displayedEnvio, displayedTotal;

  if (selectedCurrency === "USD") {
    displayedSubtotal = totales.subtotal;
    displayedEnvio = totales.costoEnvio;
    displayedTotal = totales.total;
    
    totalElement.innerHTML = `
      <div class="d-flex flex-column">
        <div><small class="text-muted">Subtotal: USD ${displayedSubtotal.toLocaleString('es-UY', {minimumFractionDigits:2})}</small></div>
        <div><small class="text-muted">Envío (${totales.porcentaje}%): USD ${displayedEnvio.toLocaleString('es-UY', {minimumFractionDigits:2})}</small></div>
        <div class="mt-1"><strong>USD ${displayedTotal.toLocaleString('es-UY', {minimumFractionDigits:2})}</strong></div>
      </div>
    `;
  } else {
    displayedSubtotal = totales.subtotal * exchangeRate;
    displayedEnvio = totales.costoEnvio * exchangeRate;
    displayedTotal = totales.total * exchangeRate;
    
    totalElement.innerHTML = `
      <div class="d-flex flex-column">
        <div><small class="text-muted">Subtotal: UYU ${displayedSubtotal.toLocaleString('es-UY', {minimumFractionDigits:2})}</small></div>
        <div><small class="text-muted">Envío (${totales.porcentaje}%): UYU ${displayedEnvio.toLocaleString('es-UY', {minimumFractionDigits:2})}</small></div>
        <div class="mt-1"><strong>UYU ${displayedTotal.toLocaleString('es-UY', {minimumFractionDigits:2})}</strong></div>
      </div>
    `;
  }

  if (itemsCountElement)
    itemsCountElement.textContent = `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;
}

// Detectar cambio de moneda
document.addEventListener("change", e => {
  if (e.target && e.target.id === "currency-select") {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateDisplayedTotal(totalItems);
  }
});

// Detectar cambio de tipo de envío
document.addEventListener("change", e => {
  if (e.target && e.target.id === "TipoDeEnvio") {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateDisplayedTotal(totalItems);
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartBadge();
  renderCartPage();
});

// DIRECCIÓN DE ENVÍO

// Cargar dirección guardada
function cargarDireccionGuardada() {
  const direccionGuardada = localStorage.getItem('direccion_envio');
  if (direccionGuardada) {
    const direccion = JSON.parse(direccionGuardada);
    const deptoInput = document.getElementById('departamento');
    const localidadInput = document.getElementById('localidad');
    const calleInput = document.getElementById('calle');
    const numeroInput = document.getElementById('numero');
    const esquinaInput = document.getElementById('esquina');
    
    if (deptoInput) deptoInput.value = direccion.departamento || '';
    if (localidadInput) localidadInput.value = direccion.localidad || '';
    if (calleInput) calleInput.value = direccion.calle || '';
    if (numeroInput) numeroInput.value = direccion.numero || '';
    if (esquinaInput) esquinaInput.value = direccion.esquina || '';
  }
}

// Validar dirección de envío
function validarDireccion() {
  const deptoInput = document.getElementById('departamento');
  const localidadInput = document.getElementById('localidad');
  const calleInput = document.getElementById('calle');
  const numeroInput = document.getElementById('numero');
  
  if (!deptoInput || !localidadInput || !calleInput || !numeroInput) {
    return false;
  }
  
  const departamento = deptoInput.value.trim();
  const localidad = localidadInput.value.trim();
  const calle = calleInput.value.trim();
  const numero = numeroInput.value.trim();
  
  const shippingForm = document.getElementById('shipping-form');
  
  if (shippingForm) {
    // Resetear validación
    shippingForm.classList.remove('was-validated');
  }
  
  // Verificar campos vacíos
  if (!departamento || !localidad || !calle || !numero) {
    if (shippingForm) {
      shippingForm.classList.add('was-validated');
    }
    mostrarMensaje('Por favor completá todos los campos obligatorios de la dirección de envío', 'warning');
    
    // Hacer scroll hacia el formulario
    const shippingSection = document.getElementById('shipping-section');
    if (shippingSection) {
      shippingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return false;
  }
  
  return true;
}

// Guardar dirección en localStorage
function guardarDireccion() {
  const direccion = {
    departamento: document.getElementById('departamento').value.trim(),
    localidad: document.getElementById('localidad').value.trim(),
    calle: document.getElementById('calle').value.trim(),
    numero: document.getElementById('numero').value.trim(),
    esquina: document.getElementById('esquina').value.trim()
  };
  
  localStorage.setItem('direccion_envio', JSON.stringify(direccion));
  console.log('Dirección guardada:', direccion);
  return direccion;
}

// Mostrar u ocultar sección de dirección según el carrito
function mostrarsecciondireccion() {
  const shippingSection = document.getElementById('shipping-section');
  if (shippingSection) {
    if (cart.length > 0) {
      shippingSection.style.display = 'block';
      cargarDireccionGuardada();
    } else {
      shippingSection.style.display = 'none';
    }
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartBadge();
  renderCartPage();
  mostrarsecciondireccion();

  // ==========================
  // FORMA DE PAGO
  // ==========================
  const tarjeta = document.getElementById('tarjeta');
  const transferencia = document.getElementById('transferencia');
  const tarjetaDetails = document.getElementById('tarjetaDetails');
  const transferenciaDetails = document.getElementById('transferenciaDetails');
  const paymentSection = document.getElementById('payment-section');

  if (paymentSection && cart.length > 0) {
    paymentSection.style.display = 'block';
  }

  document.querySelectorAll('input[name="formaPago"]').forEach(opcion => {
    opcion.addEventListener('change', () => {
      if (tarjeta.checked) {
        tarjetaDetails.style.display = 'block';
        transferenciaDetails.style.display = 'none';
      } else if (transferencia.checked) {
        transferenciaDetails.style.display = 'block';
        tarjetaDetails.style.display = 'none';
      }
    });
  });

  function validarFormaPago() {
  
  document.querySelectorAll('.text-danger.form-error').forEach(el => el.remove());

  const seleccion = document.querySelector('input[name="formaPago"]:checked');
  let valido = true;

  if (!seleccion) {
    mostrarMensaje('Por favor seleccioná una forma de pago.', 'warning');
    return false;
  }

  if (seleccion.value === 'tarjeta') {
    const numero = document.getElementById('numeroTarjeta');
    const mes = document.getElementById('mesExp');
    const anio = document.getElementById('anioExp');
    const cvv = document.getElementById('cvv');

    if (!numero.value.trim()) {
      const msg = document.createElement('div');
      msg.className = 'text-danger form-error';
      msg.textContent = 'Por favor ingresá el número de tarjeta.';
      numero.insertAdjacentElement('afterend', msg);
      valido = false;
    }

    if (!mes.value.trim()) {
      const msg = document.createElement('div');
      msg.className = 'text-danger form-error';
      msg.textContent = 'Seleccioná el mes de expiración.';
      mes.insertAdjacentElement('afterend', msg);
      valido = false;
    }

    if (!anio.value.trim()) {
      const msg = document.createElement('div');
      msg.className = 'text-danger form-error';
      msg.textContent = 'Seleccioná el año de expiración.';
      anio.insertAdjacentElement('afterend', msg);
      valido = false;
    }

    if (!cvv.value.trim()) {
      const msg = document.createElement('div');
      msg.className = 'text-danger form-error';
      msg.textContent = 'Por favor ingresá el código CVV.';
      cvv.insertAdjacentElement('afterend', msg);
      valido = false;
    }
  }

  if (seleccion.value === 'transferencia') {
    const banco = document.getElementById('banco');
    const cuenta = document.getElementById('nroCuenta');

    if (!banco.value.trim()) {
      const msg = document.createElement('div');
      msg.className = 'text-danger form-error';
      msg.textContent = 'Por favor ingresá el nombre del banco.';
      banco.insertAdjacentElement('afterend', msg);
      valido = false;
    }

    if (!cuenta.value.trim()) {
      const msg = document.createElement('div');
      msg.className = 'text-danger form-error';
      msg.textContent = 'Por favor ingresá el número de cuenta.';
      cuenta.insertAdjacentElement('afterend', msg);
      valido = false;
    }
  }

  return valido;
}


  // Botón "Continuar Comprando"
const continueBtn = document.getElementById('continue-shopping');
if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    window.location.href = 'categories.html';
  });
}

// Botón "Finalizar Compra"
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    // Campos de dirección
    const departamento = document.getElementById('departamento')?.value.trim();
    const localidad = document.getElementById('localidad')?.value.trim();
    const calle = document.getElementById('calle')?.value.trim();
    const numero = document.getElementById('numero')?.value.trim();

    // Forma de pago seleccionada
    const seleccionPago = document.querySelector('input[name="formaPago"]:checked');
    let camposValidos = true;

    // Validación dirección
    if (!departamento || !localidad || !calle || !numero) {
      camposValidos = false;
    }

   // Validación forma de pago
    if (!seleccionPago) {
      camposValidos = false;
    } else if (seleccionPago.value === 'tarjeta') {
      const numeroTarjeta = document.getElementById('numeroTarjeta')?.value.trim();
      const mesExp = document.getElementById('mesExp')?.value.trim();
      const anioExp = document.getElementById('anioExp')?.value.trim();
      const cvv = document.getElementById('cvv')?.value.trim();
      if (!numeroTarjeta || !mesExp || !anioExp || !cvv) camposValidos = false;
    } else if (seleccionPago.value === 'transferencia') {
      const banco = document.getElementById('banco')?.value.trim();
      const nroCuenta = document.getElementById('nroCuenta')?.value.trim();
      if (!banco || !nroCuenta) camposValidos = false;
    }

    // Mostrar mensaje según resultado
    if (camposValidos) {
      mostrarMensaje('¡Compra exitosa!', 'success');
    } else {
      mostrarMensaje('Por favor completá todos los campos obligatorios antes de finalizar la compra.', 'warning');
    }
  });
}
});
