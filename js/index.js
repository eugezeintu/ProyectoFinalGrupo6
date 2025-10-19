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

function toggleThemeCheckbox() {
    const checkbox = document.getElementById('themeSwitch');
    const html = document.documentElement;
    
    // Si está marcado = modo oscuro, si no = modo claro
    if (checkbox.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Cargar estado al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const checkbox = document.getElementById('themeSwitch');
    
    // Marcar o desmarcar según el tema guardado
    checkbox.checked = (savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
});

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});