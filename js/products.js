function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("user");

    document.getElementById("sesion").textContent = "User " + user;
    document.getElementById("cerrarsesion").innerHTML += "Logout";
    document.getElementById("cerrarsesion").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location = "login.html";
    });
});

const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

let currentProducts = [];

const ORDER_ASC_BY_PRICE = "ASC_PRICE";
const ORDER_DESC_BY_PRICE = "DESC_PRICE";
const ORDER_BY_SOLD = "SOLD";

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort((a, b) => a.cost - b.cost);
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort((a, b) => b.cost - a.cost);
    } else if (criteria === ORDER_BY_SOLD) {
        result = array.sort((a, b) => b.soldCount - a.soldCount);
    }
    return result;
}

function sortAndShowProducts(criteria) {
    currentProducts = sortProducts(criteria, currentProducts);
    mostrarProductos(currentProducts);
}

function mostrarProductos(products) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    for (let product of products) {
        contenedor.innerHTML += `
            <div class="col-sm-6 col-md-6 col-lg-4 mb-4">
              <div class="card mb-3" style="max-width: 540px; cursor: pointer;" onclick="setCatID(${product.id})">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img src="${product.image}" class="img-fluid rounded-start" alt="${product.description}">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <p class="card-text"><strong>${product.currency} ${product.cost}</strong></p>
                      <p class="card-text"><small class="text-muted">${product.soldCount} vendidos</small></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getJSONData(URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProducts = resultObj.data.products;
            mostrarProductos(currentProducts);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortBySold").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD);
    });

    document.getElementById("filterPrice").addEventListener("click", function(){
        let min = document.getElementById("minPrice").value;
        let max = document.getElementById("maxPrice").value;

        let filtered = currentProducts.filter(product => {
            let precio = product.cost;
            if ((min === "" || precio >= parseInt(min)) && (max === "" || precio <= parseInt(max))) {
                return true;
            }
            return false;
        });

        mostrarProductos(filtered);
    });

    document.getElementById("clearFilter").addEventListener("click", function(){
        document.getElementById("minPrice").value = "";
        document.getElementById("maxPrice").value = "";
        mostrarProductos(currentProducts);
    });
});
