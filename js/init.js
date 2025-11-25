// URLs actualizadas para apuntar al servidor local
const CATEGORIES_URL = "http://localhost:3000/api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/api/sell/publish.json";
const PRODUCTS_URL = "http://localhost:3000/api/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/api/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/api/products_comments/";
const CART_INFO_URL = "http://localhost:3000/api/user_cart/";
const CART_BUY_URL = "http://localhost:3000/api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    
    // Obtener el token de localStorage
    const token = localStorage.getItem('token');
    
    // Configurar headers con el token
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Si existe el token, agregarlo al header Authorization
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, {
      method: 'GET',
      headers: headers
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401 || response.status === 403) {
        // Token inválido o expirado - redirigir al login
        console.error('Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        throw Error('No autorizado');
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}