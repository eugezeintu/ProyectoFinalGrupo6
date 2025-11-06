function autenticado() {
    return localStorage.getItem('user') !== null; 
}

if (!autenticado()) {
            window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded",()=>{
    let user = localStorage.getItem("user");

    document.getElementById("sesion").textContent = user;
    document.getElementById("perfil").addEventListener("click", function() {
        window.location = "my-profile.html"});
    document.getElementById("cerrarsesion").addEventListener("click", function() {
        localStorage.removeItem("user");
        window.location = "login.html"
    });

    
})

document.addEventListener("DOMContentLoaded",()=>{
    let user = localStorage.getItem("user");

    document.getElementById("usuarioperfil").textContent = "Usuario: " + user;

})


const form = document.getElementById("perfilForm");
const fotoInput = document.getElementById("foto");
const preview = document.getElementById("preview");
const msg = document.getElementById("mensaje");

let imagenBase64 = "";

fotoInput.addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) { imagenBase64=""; preview.src=""; return; }
  const reader = new FileReader();
  reader.onload = (ev) => { imagenBase64 = ev.target.result; preview.src = imagenBase64; };
  reader.readAsDataURL(f);
});


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const perfil = {
    nombre: document.getElementById("nombre").value || "",
    apellido: document.getElementById("apellido").value || "",
    telefono: document.getElementById("telefono").value || "",
    foto: imagenBase64

  };
  localStorage.setItem(localStorage.getItem("user"), JSON.stringify(perfil));
  msg.style.color = "green"; msg.textContent = "Guardado ✅";
  setTimeout(()=> msg.textContent = "", 1800);
});

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


document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem(localStorage.getItem("user"));
  if (!raw) return;
  const p = JSON.parse(raw);
  document.getElementById("nombre").value = p.nombre || "";
  document.getElementById("apellido").value = p.apellido || "";
  document.getElementById("telefono").value = p.telefono || "";
  imagenBase64 = p.foto || "";
  preview.src = imagenBase64 || "";
});
