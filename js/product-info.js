// Variables globales
let productData = null;
let commentsData = [];

function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
    window.location.href = "login.html";
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

    const productID = localStorage.getItem("selectedProductID");
    if (!productID) {
        document.getElementById("product-container").innerHTML = `<div class="alert alert-danger">No se encontró producto seleccionado.</div>`;
        return;
    }

    const productURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    const commentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

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

    configurarFormularioCalificacion();
});

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

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const checkbox = document.getElementById('themeSwitch');
    checkbox.checked = (savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
});

function mostrarProducto(product) {
    const contenedor = document.getElementById("product-container");

    contenedor.innerHTML = `
    <div class="col-md-6">
      <div class="mb-3">
        <img id="main-image" src="${product.images[0]}" class="img-fluid rounded shadow" alt="${product.name}">
      </div>
      <div id="gallery" class="d-flex gap-2 flex-wrap">
        ${product.images.map((img,index)=>`
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
      <button id="buy-btn" class="btn btn-success">Comprar</button>
    </div>
    `;

    document.querySelectorAll(".gallery-img").forEach(img=>{
        img.addEventListener("click", e=>{
            document.getElementById("main-image").src = e.target.src;
            document.querySelectorAll(".gallery-img").forEach(i=>i.classList.remove("border","border-primary"));
            e.target.classList.add("border","border-primary");
        });
    });

    document.getElementById("buy-btn")?.addEventListener("click", () => {
        const productoComprado = {
            id: product.id,
            name: product.name,
            cost: product.cost,
            currency: product.currency,
            image: product.images[0],
            quantity: 1
        };
        localStorage.setItem("productoComprado", JSON.stringify(productoComprado));
        window.location.href = "cart.html";
    });
}

// Resto de funciones: mostrarComentarios, generarEstrellas, configurarFormularioCalificacion, mostrarRelacionados y verProducto
// Se mantienen exactamente igual a tu JS original.
