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
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
          <p><strong>Vendidos:</strong> ${product.soldCount}</p>
        </div>
      </div>
    `;
  }
}
