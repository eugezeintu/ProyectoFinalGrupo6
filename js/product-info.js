esta es la version modificada del js // Variables globales
let productData = null;
let commentsData = [];

// Función de autenticación
function autenticado() {
    return localStorage.getItem('user') !== null; 
}

// Redirigir si no hay usuario
if (!autenticado()) {
    window.location.href = "login.html";
}

// Función para actualizar badge del carrito
function updateCartBadge() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-badge').textContent = totalItems;
    } else {
        document.getElementById('cart-badge').textContent = '0';
    }
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Función para agregar producto al carrito (principal y fallback)
function addToCart(product) {
    if (!product || !product.id) {
        console.error('Producto inválido', product);
        return;
    }

    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.images[0] || '', 
            price: product.cost,
            currency: product.currency,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    mostrarMensaje('Producto agregado al carrito', 'success');
}

// Función para agregar productos relacionados al carrito
function addRelatedToCart(productId) {
    const relatedProduct = productData.relatedProducts.find(p => p.id === productId);
    if (!relatedProduct) return;

    addToCart({
        id: relatedProduct.id,
        name: relatedProduct.name,
        images: [relatedProduct.image],
        cost: relatedProduct.cost,
        currency: relatedProduct.currency
    });
}

// Función para cambiar tema
function toggleThemeCheckbox() {
    const checkbox = document.getElementById('themeSwitch');
    const html = document.documentElement;

    if (checkbox.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Aplicar tema guardado
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const checkbox = document.getElementById('themeSwitch');
    checkbox.checked = (savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Función para mostrar estrellas
function generarEstrellas(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<span class="star-filled">★</span>' : '<span class="star-empty">★</span>';
    }
    return stars;
}

// Función para mostrar comentarios
function mostrarComentarios(comments) {
    const contenedor = document.getElementById("comments-container");
    contenedor.innerHTML = "";

    if (!comments || comments.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No hay calificaciones disponibles.</p>';
        return;
    }

    comments.forEach(comment => {
        const starsHTML = generarEstrellas(comment.score);
        const fecha = new Date(comment.dateTime);

        contenedor.innerHTML += `
        <div class="comment-card card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 class="card-title mb-1">${comment.user}</h6>
                        <small class="text-muted">${fecha.toLocaleDateString('es-ES')} - ${fecha.toLocaleTimeString('es-ES')}</small>
                    </div>
                    <div class="rating-display">
                        ${starsHTML}
                    </div>
                </div>
                <p class="card-text">${comment.description}</p>
            </div>
        </div>
        `;
    });
}

// Función para mostrar producto
function mostrarProducto(product) {
    const contenedor = document.getElementById("product-container");

    contenedor.innerHTML = `
    <div class="col-md-6">
        <div class="mb-3">
            <img id="main-image" src="${product.images[0]}" class="img-fluid rounded shadow" alt="${product.name}">
        </div>
        <div id="gallery" class="d-flex gap-2 flex-wrap">
            ${product.images.map((img, index) => `
                <img src="${img}" class="img-thumbnail gallery-img" 
                     style="width: 100px; height: 100px; object-fit: cover; cursor:pointer;" 
                     data-index="${index}">
            `).join("")}
        </div>
    </div>
    <div class="col-md-6">
        <h2 class="fw-bold">${product.name}</h2>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
        <p><strong>Vendidos:</strong> ${product.soldCount}</p>
        <p>${product.description}</p>
        <button id="add-cart-btn" class="btn btn-primary btn-lg" disabled>
            <i class="fa fa-shopping-cart"></i> Agregar al carrito
        </button>
    </div>
    `;

    // Galería de imágenes
    document.querySelectorAll(".gallery-img").forEach(img => {
        img.addEventListener("click", (e) => {
            document.getElementById("main-image").src = e.target.src;
            document.querySelectorAll(".gallery-img").forEach(i => i.classList.remove("border", "border-primary"));
            e.target.classList.add("border", "border-primary");
        });
    });

    const firstImg = document.querySelector(".gallery-img");
    if (firstImg) firstImg.classList.add("border", "border-primary");

    // Habilitar botón carrito después de renderizar
    const btn = document.getElementById('add-cart-btn');
    btn.disabled = false;
    btn.addEventListener('click', () => addToCart(productData));
}

// Función para mostrar productos relacionados
function mostrarRelacionados(related) {
    const contenedor = document.getElementById("related-container");
    contenedor.innerHTML = "";

    if (!related || related.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No hay productos relacionados disponibles.</p>';
        return;
    }

    related.forEach(prod => {
        contenedor.innerHTML += `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100 shadow-sm product-related-card">
                <img src="${prod.image}" class="card-img-top" alt="${prod.name}" 
                     style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-center mb-2">${prod.name}</h6>
                    <p class="text-center mb-2"><strong>${prod.currency} ${prod.cost}</strong></p>
                    <div class="mt-auto">
                        <button class="btn btn-sm btn-outline-primary w-100 mb-2" onclick="verProducto(${prod.id})">Ver detalles</button>
                        <button class="btn btn-sm btn-success w-100" onclick="addRelatedToCart(${prod.id})">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    // Efecto hover
    document.querySelectorAll('.product-related-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'all 0.3s ease';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Función para ver un producto relacionado
function verProducto(id) {
    localStorage.setItem("selectedProductID", id);
    window.location = "product-info.html";
}

// Configurar formulario de calificación
function configurarFormularioCalificacion() {
    const form = document.getElementById('rating-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const commentText = document.getElementById('comment-text').value;
        const rating = document.querySelector('input[name="rating"]:checked');
        const user = localStorage.getItem("user");

        if (!rating) { alert('Por favor, selecciona una calificación.'); return; }
        if (!commentText.trim()) { alert('Por favor, escribe un comentario.'); return; }

        const newComment = {
            user: user,
            dateTime: new Date().toISOString(),
            description: commentText,
            score: parseInt(rating.value)
        };

        commentsData.unshift(newComment);
        mostrarComentarios(commentsData);
        form.reset();
        mostrarMensaje('¡Tu calificación ha sido enviada exitosamente!', 'success');
    });
}

// Cargar datos del producto y comentarios al iniciar
document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    document.getElementById("sesion").textContent = user;
    document.getElementById("perfil").addEventListener("click", () => window.location = "my-profile.html");
    document.getElementById("cerrarsesion").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location = "login.html";
    });

    updateCartBadge();

    const productID = localStorage.getItem("selectedProductID");
    if (!productID) {
        document.getElementById("product-container").innerHTML = `<div class="alert alert-danger">No se encontró producto seleccionado.</div>`;
        return;
    }

    const productURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    const commentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

    Promise.all([getJSONData(productURL), getJSONData(commentsURL)])
    .then(([productResult, commentsResult]) => {
        if (productResult.status === "ok") {
            productData = productResult.data;
            mostrarProducto(productData);
            mostrarRelacionados(productData.relatedProducts);
        }
        if (commentsResult.status === "ok") {
            commentsData = commentsResult.data;
            mostrarComentarios(commentsData);
        }
    });

    configurarFormularioCalificacion();
});
