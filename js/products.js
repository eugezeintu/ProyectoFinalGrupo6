// Variables globales
let currentProducts = [];

const ORDER_ASC_BY_PRICE = "ASC_PRICE";
const ORDER_DESC_BY_PRICE = "DESC_PRICE";
const ORDER_BY_SOLD = "SOLD";

// Función de autenticación
function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
    window.location.href = "login.html";
}

// Badge del carrito
function updateCartBadge() {
    const savedCart = localStorage.getItem('cart');
    const totalItems = savedCart ? JSON.parse(savedCart).reduce((total, item) => total + item.quantity, 0) : 0;
    document.getElementById('cart-badge').textContent = totalItems;
}

// Función de mensajes
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
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => { if (alertDiv.parentNode) alertDiv.remove(); }, 3000);
}

// Agregar producto al carrito
function addToCart(product) {
    if (!product || !product.id) return;

    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image || '',
            price: product.cost,
            currency: product.currency,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    alert("Producto agregado al carrito");
}

function addProductToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) addToCart(product);
}

// Redirigir al detalle del producto
function setCatID(id) {
    localStorage.setItem("selectedProductID", id);
    window.location = "product-info.html";
}

// Ordenar productos
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) result = array.sort((a, b) => a.cost - b.cost);
    else if (criteria === ORDER_DESC_BY_PRICE) result = array.sort((a, b) => b.cost - a.cost);
    else if (criteria === ORDER_BY_SOLD) result = array.sort((a, b) => b.soldCount - a.soldCount);
    return result;
}

function sortAndShowProducts(criteria) {
    currentProducts = sortProducts(criteria, currentProducts);
    mostrarProductos(currentProducts);
}

// Mostrar productos (clic en tarjeta = detalles)
function mostrarProductos(products) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    for (let product of products) {
        contenedor.innerHTML += `
        <div class="col-sm-6 col-md-6 col-lg-4 mb-4">
          <div class="card h-100 product-card" onclick="setCatID(${product.id})">
            <img src="${product.image}" class="card-img-top" alt="${product.description}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text flex-grow-1">${product.description}</p>
              <div class="mt-auto">
                <p class="card-text"><strong>${product.currency} ${product.cost}</strong></p>
                <p class="card-text"><small class="text-muted">${product.soldCount} vendidos</small></p>
                <div class="d-flex justify-content-end">
                  <button class="btn btn-success btn-add-cart" onclick="event.stopPropagation(); addProductToCart(${product.id})" title="Agregar al carrito">
                    <i class="fa fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
    }
}
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

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("user");
    document.getElementById("sesion").textContent = user;
    document.getElementById("perfil").addEventListener("click", () => window.location = "my-profile.html");
    document.getElementById("cerrarsesion").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location = "login.html";
    });

    updateCartBadge();

    const categoria = localStorage.getItem("catID");
    const URL = PRODUCTS_URL + categoria + ".json";
    getJSONData(URL).then(resultObj => {
        if (resultObj.status === "ok") {
            currentProducts = resultObj.data.products;
            mostrarProductos(currentProducts);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", () => sortAndShowProducts(ORDER_ASC_BY_PRICE));
    document.getElementById("sortDesc").addEventListener("click", () => sortAndShowProducts(ORDER_DESC_BY_PRICE));
    document.getElementById("sortBySold").addEventListener("click", () => sortAndShowProducts(ORDER_BY_SOLD));

    document.getElementById("filterPrice").addEventListener("click", () => {
        let min = document.getElementById("minPrice").value;
        let max = document.getElementById("maxPrice").value;
        const filtered = currentProducts.filter(product => {
            const precio = product.cost;
            return (min === "" || precio >= parseInt(min)) && (max === "" || precio <= parseInt(max));
        });
        mostrarProductos(filtered);
    });

    document.getElementById("searchInput").addEventListener("input", () => {
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        const resultadosFiltrados = currentProducts.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
        mostrarProductos(resultadosFiltrados);
    });

    document.getElementById("clearFilter").addEventListener("click", () => {
        document.getElementById("minPrice").value = "";
        document.getElementById("maxPrice").value = "";
        mostrarProductos(currentProducts);
    });
});
