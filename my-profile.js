const KEY = "perfilSimple_v1";
const form = document.getElementById("perfilForm");
const fotoInput = document.getElementById("foto");
const preview = document.getElementById("preview");
const msg = document.getElementById("mensaje");
const cargarBtn = document.getElementById("cargarBtn");
const modoBtn = document.getElementById("modoBtn");

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
    email: document.getElementById("email").value || "",
    telefono: document.getElementById("telefono").value || "",
    foto: imagenBase64
  };
  localStorage.setItem(KEY, JSON.stringify(perfil));
  msg.style.color = "green"; msg.textContent = "Guardado ✅";
  setTimeout(()=> msg.textContent = "", 1800);
});

cargarBtn.addEventListener("click", () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return alert("No hay perfil guardado");
  const p = JSON.parse(raw);
  document.getElementById("nombre").value = p.nombre || "";
  document.getElementById("email").value = p.email || "";
  document.getElementById("telefono").value = p.telefono || "";
  imagenBase64 = p.foto || "";
  preview.src = imagenBase64 || "";
  msg.style.color = "blue"; msg.textContent = "Cargado 🔄";
  setTimeout(()=> msg.textContent = "", 1800);
});

modoBtn.addEventListener("click", () => document.body.classList.toggle("dark"));

window.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  const p = JSON.parse(raw);
  document.getElementById("nombre").value = p.nombre || "";
  document.getElementById("email").value = p.email || "";
  document.getElementById("telefono").value = p.telefono || "";
  imagenBase64 = p.foto || "";
  preview.src = imagenBase64 || "";
});
