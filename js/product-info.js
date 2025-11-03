let productData = null;
let commentsData = [];

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

function addProductToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) addToCart(product);
}

document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("user");

    document.getElementById("sesion").textContent = user;
    document.getElementById("perfil").addEventListener("click", function() {
        window.location = "my-profile.html"});
    document.getElementById("cerrarsesion").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location = "login.html"
    });

    // Recuperar el ID del producto
    const productID = localStorage.getItem("selectedProductID");
    if (!productID) {
        document.getElementById("product-container").innerHTML = `<div class="alert alert-danger">No se encontró producto seleccionado.</div>`;
        return;
    }

    updateCartBadge();

    // Construir las URLs
    const productURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    const commentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

    // Cargar datos del producto y comentarios
    Promise.all([
        getJSONData(productURL),
        getJSONData(commentsURL)
    ]).then(([productResult, commentsResult]) => {
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

    // Configurar formulario de calificación
    configurarFormularioCalificacion();
});



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

// Renderizar el producto principal con galería
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
      <p><strong>Vendidos:</strong> ${product.soldCount}</p>
      <p>${product.description}</p>
      <button id="add-cart-btn" class="btn btn-success btn-lg">
        <i class="fa fa-shopping-cart"></i> Agregar al carrito
        </button>
    </div>
  `;

    // Evento: cambiar imagen principal al hacer clic en miniatura
    document.querySelectorAll(".gallery-img").forEach(img => {
        img.addEventListener("click", (e) => {
            document.getElementById("main-image").src = e.target.src;

            // Resaltar miniatura activa
            document.querySelectorAll(".gallery-img").forEach(i => i.classList.remove("border", "border-primary"));
            e.target.classList.add("border", "border-primary");
        });
    });

    // Resaltar la primera miniatura como activa
    const firstImg = document.querySelector(".gallery-img");
    if (firstImg) firstImg.classList.add("border", "border-primary");

    document.getElementById("add-cart-btn").addEventListener("click", () => {
    addToCart(product);
  });
}

// Mostrar comentarios y calificaciones
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

// Generar estrellas para mostrar calificación
function generarEstrellas(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star-filled">★</span>';
        } else {
            stars += '<span class="star-empty">★</span>';
        }
    }
    return stars;
}

// Configurar el formulario de calificación
function configurarFormularioCalificacion() {
    const form = document.getElementById('rating-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const commentText = document.getElementById('comment-text').value;
        const rating = document.querySelector('input[name="rating"]:checked');
        const user = localStorage.getItem("user");
        
        if (!rating) {
            alert('Por favor, selecciona una calificación.');
            return;
        }

        if (!commentText.trim()) {
            alert('Por favor, escribe un comentario.');
            return;
        }

        // Crear nuevo comentario
        const newComment = {
            user: user,
            dateTime: new Date().toISOString(),
            description: commentText,
            score: parseInt(rating.value)
        };

        // Agregar al inicio del array de comentarios
        commentsData.unshift(newComment);
        
        // Actualizar la vista
        mostrarComentarios(commentsData);
        
        // Limpiar formulario
        form.reset();
        
        // Mostrar mensaje de éxito
        mostrarMensaje('¡Tu calificación ha sido enviada exitosamente!', 'success');
    });
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
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Renderizar productos relacionados
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
          <div class="card h-100 shadow-sm product-related-card" style="cursor:pointer;" onclick="verProducto(${prod.id})">
            <img src="${prod.image}" class="card-img-top" alt="${prod.name}" 
                 style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex align-items-center justify-content-center">
              <h6 class="card-title text-center mb-0">${prod.name}</h6>
            </div>
          </div>
        </div>
        `;
    });

    // Agregar efecto hover a las cards de productos relacionados
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

// Cuando se hace clic en un producto relacionado
function verProducto(id) {
    localStorage.setItem("selectedProductID", id);
    window.location = "product-info.html";
}

