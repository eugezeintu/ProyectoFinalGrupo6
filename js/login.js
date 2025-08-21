document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("inputPassword6");
  const error = document.getElementById("error");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el form recargue la página

    let usuario = usuarioInput.value.trim();
    let password = passwordInput.value.trim();

    if (usuario === "" || password === "") {
      error.textContent = "⚠️ Debes ingresar usuario y contraseña.";
    } else if (password.length < 8 || password.length > 20) {
      error.textContent = "⚠️ La contraseña debe tener entre 8 y 20 caracteres.";
    } else {
      error.textContent = "";
      // ✅ Redirige a la página de inicio
      window.location.href = "index.html";
    }
  });
});
console.log("✅ login.js cargado correctamente");