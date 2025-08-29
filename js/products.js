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
                     <div class="col-12 col-sm-6 col-md-4 mb-4">
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
`;
  }
  }