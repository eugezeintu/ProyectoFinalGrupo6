function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("user");
    document.getElementById("sesion").textContent = "User " + user;
    document.getElementById("cerrarsesion").innerHTML = "Logout";
    document.getElementById("cerrarsesion").addEventListener("click", function () {
        localStorage.removeItem("user");
        window.location = "login.html";
    });

    // Recuperar el ID del producto
    const productID = localStorage.getItem("selectedProductID");
    if (!productID) {
        document.getElementById("product-container").innerHTML = `<div class="alert alert-danger">No se encontró producto seleccionado.</div>`;
        return;
    }

    // Construir la URL de detalle del producto
    const URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

    getJSONData(URL).then(resultObj => {
        if (resultObj.status === "ok") {
            mostrarProducto(resultObj.data);
            mostrarRelacionados(resultObj.data.relatedProducts);
        }
    });
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
      <button class="btn btn-primary">Agregar al carrito</button>
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
}

// Renderizar productos relacionados
function mostrarRelacionados(related) {
    const contenedor = document.getElementById("related-container");
    contenedor.innerHTML = "";

    related.forEach(prod => {
        contenedor.innerHTML += `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="verProducto(${prod.id})">
            <img src="${prod.image}" class="card-img-top" alt="${prod.name}">
            <div class="card-body">
              <h5 class="card-title">${prod.name}</h5>
            </div>
          </div>
        </div>
        `;
    });
}

// Cuando se hace clic en un producto relacionado
function verProducto(id) {
    localStorage.setItem("selectedProductID", id);
    window.location = "product-info.html"; // recarga la misma página con el nuevo producto
}
