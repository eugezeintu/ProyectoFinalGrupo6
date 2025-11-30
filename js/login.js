document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");
  const error = document.getElementById("error");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el form recargue la página

    let usuario = usuarioInput.value.trim();
    let password = passwordInput.value.trim();

    if (usuarioInput.value === "" && password === "") {
      error.textContent = "⚠️ Debe ingresar un usuario y una contraseña.";
    } else if (password === "") {
      error.textContent = "⚠️ Debe ingresar una contraseña.";
    } else if (password.length < 8 || password.length > 20) {
      error.textContent = "⚠️ La contraseña debe tener entre 8 y 20 caracteres.";
    } else {  
      error.textContent = "";
      // Redirige a la página de inicio
      window.location.href = "index.html";
      localStorage.setItem("user",usuario);
    }
  });
});
console.log("login.js cargado correctamente");



// Modo claro y oscuro - Inicio
function modonoche() {
    const checkbox = document.getElementById('interruptor');
    const html = document.documentElement;
    
    // Si está marcado = modo oscuro, si no = modo claro
    if (checkbox.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('modo', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('modo', 'light');
    }
}

// Cargar estado al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('modo') || 'light';
    const checkbox = document.getElementById('interruptor');
    
    // Marcar o desmarcar según el tema guardado
    checkbox.checked = (savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Modo claro y oscuro - Fin