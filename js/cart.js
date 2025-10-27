document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-container");
    const productoComprado = JSON.parse(localStorage.getItem("productoComprado"));

    if (!productoComprado) {
        cartContainer.innerHTML = `<div class="alert alert-warning">No hay productos en el carrito.</div>`;
        return;
    }

    // Crear tabla para mostrar el carrito
    cartContainer.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody id="cart-items"></tbody>
            <tfoot>
                <tr>
                    <th colspan="3" class="text-end">Total:</th>
                    <th id="cart-total"></th>
                </tr>
            </tfoot>
        </table>
    `;

    const cartItems = document.getElementById("cart-items");

    // Solo un producto por ahora
    const subtotal = productoComprado.cost * productoComprado.quantity;

    cartItems.innerHTML = `
        <tr>
            <td>
                <img src="${productoComprado.image}" style="width:60px; height:60px; object-fit:cover;" class="me-2">
                ${productoComprado.name}
            </td>
            <td>${productoComprado.currency} ${productoComprado.cost}</td>
            <td>${productoComprado.quantity}</td>
            <td>${productoComprado.currency} ${subtotal}</td>
        </tr>
    `;

    document.getElementById("cart-total").textContent = `${productoComprado.currency} ${subtotal}`;
});
