function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("user");

    document.getElementById("sesion").textContent = "User  " + user;
    document.getElementById("cerrarsesion").innerHTML += "Logout";
    document.getElementById("cerrarsesion").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location = "login.html"
    });

    // Cargar información del producto seleccionado
    loadProductInfo();
});

async function loadProductInfo() {
    const selectedProductId = localStorage.getItem("selectedProductId");
    
    if (!selectedProductId) {
        // Si no hay producto seleccionado, redirigir a products.html
        window.location.href = "products.html";
        return;
    }

    try {
        // Cargar desde la lista de productos de la categoría (más confiable)
        const categoryURL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
        const response = await fetch(categoryURL);
        
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const result = await response.json();
        const product = result.products.find(p => p.id == selectedProductId);
        
        if (product) {
            // Crear estructura de producto completa para coincidir con el prototipo
            const productInfo = {
                id: product.id,
                name: product.name,
                description: product.description,
                cost: product.cost,
                currency: product.currency,
                soldCount: product.soldCount,
                category: result.catName,
                images: [
                    product.image,
                    product.image.replace('_1.', '_2.'),
                    product.image.replace('_1.', '_3.')
                ],
                relatedProducts: result.products.filter(p => p.id !== product.id).slice(0, 4)
            };
            displayProductInfo(productInfo);
        } else {
            showError("Producto no encontrado");
        }
        
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        showError("Error al cargar la información del producto");
    }
}

async function getProductById(productId) {
    // Intentar obtener información individual del producto
    try {
        const individualURL = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
        const result = await getJSONData(individualURL);
        return result.status === "ok" ? result.data : null;
    } catch (error) {
        return null;
    }
}

function displayProductInfo(product) {
    const container = document.getElementById("product-container");
    
    container.innerHTML = `
        <div class="row">
            <!-- Galería de imágenes -->
            <div class="col-md-6">
                <div class="product-gallery">
                    <div class="main-image mb-3">
                        <img id="main-product-image" src="${product.images ? product.images[0] : product.image}" 
                             class="img-fluid rounded" alt="${product.name}" 
                             style="width: 100%; max-height: 400px; object-fit: cover;">
                    </div>
                    <div class="thumbnail-images d-flex gap-2">
                        ${product.images ? product.images.map((img, index) => `
                            <img src="${img}" class="img-thumbnail" 
                                 style="width: 80px; height: 80px; object-fit: cover; cursor: pointer;" 
                                 onclick="changeMainImage('${img}')"
                                 alt="Vista ${index + 1}">
                        `).join('') : `
                            <img src="${product.image}" class="img-thumbnail" 
                                 style="width: 80px; height: 80px; object-fit: cover;" 
                                 alt="Vista principal">
                        `}
                    </div>
                </div>
            </div>
            
            <!-- Información del producto -->
            <div class="col-md-6">
                <div class="product-info">
                    <h1 class="display-4 mb-3">${product.name}</h1>
                    
                    <div class="product-details mb-4">
                        <p class="mb-2">
                            <strong>Categoría:</strong> 
                            <span class="text-muted">${product.category || 'Autos'}</span>
                        </p>
                        <p class="mb-3">
                            <strong>Vendidos:</strong> 
                            <span class="text-muted">${product.soldCount}</span>
                        </p>
                    </div>
                    
                    <div class="product-description mb-4">
                        <p class="lead">${product.description}</p>
                    </div>
                    
                    <div class="product-price mb-4">
                        <h3 class="text-primary">
                            <strong>${product.currency} ${product.cost.toLocaleString()}</strong>
                        </h3>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary btn-lg px-5" onclick="addToCart()">
                            <i class="fa fa-shopping-cart me-2"></i>
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Productos relacionados -->
        ${product.relatedProducts && product.relatedProducts.length > 0 ? `
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="mb-4">Productos relacionados</h3>
                <div class="row">
                    ${product.relatedProducts.map(relProduct => `
                        <div class="col-md-3 mb-3">
                            <div class="card h-100" style="cursor: pointer;" onclick="selectProduct(${relProduct.id})">
                                <img src="${relProduct.image}" class="card-img-top" 
                                     style="height: 200px; object-fit: cover;" alt="${relProduct.name}">
                                <div class="card-body">
                                    <h6 class="card-title">${relProduct.name}</h6>
                                    <p class="card-text small text-muted">${relProduct.description}</p>
                                    <p class="card-text">
                                        <strong>${relProduct.currency} ${relProduct.cost.toLocaleString()}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById("main-product-image");
    mainImage.src = imageSrc;
}

function addToCart() {
    // Implementar funcionalidad del carrito
    alert("Producto agregado al carrito");
}

function selectProduct(productId) {
    localStorage.setItem("selectedProductId", productId);
    window.location.reload();
}

function showError(message) {
    const container = document.getElementById("product-container");
    container.innerHTML = `
        <div class="alert alert-danger text-center" role="alert">
            <h4 class="alert-heading">Error</h4>
            <p>${message}</p>
            <a href="products.html" class="btn btn-primary">Volver a productos</a>
        </div>
    `;
}