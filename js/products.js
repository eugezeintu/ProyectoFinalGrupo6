function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
            window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded",()=>{
    let user = localStorage.getItem("user");

    document.getElementById("sesion").textContent = "User  " + user;
    document.getElementById("cerrarsesion").innerHTML += "Logout";
    document.getElementById("cerrarsesion").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location = "login.html"
    });

    
})

const URL = "https://japceibal.github.io/emercado-api/cats_products/101.json"

    document.addEventListener("DOMContentLoaded", function () {
  getJSONData(URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      let products = resultObj.data.products;
      mostrarProductos(products);
    }
  });
});

function mostrarProductos(products) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  for (let product of products) {
    contenedor.innerHTML += `
       <div onclick="setCatID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                            <small class="text-muted">${product.soldCount} artículos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                        <br>
                        <br>
                        <br>
                        <h4 class="mb-1">${product.currency+product.cost}</h4>
                    </div>
                </div>
            </div>
    `;
  }
}
