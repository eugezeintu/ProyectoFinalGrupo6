# Backend eMercado - Proyecto Final Grupo 6

Este es el backend de nuestro proyecto eMercado. Básicamente es una API que devuelve los datos de productos, categorías y eso, y también tiene login con JWT.

## ¿Qué necesito para que funcione?

- Node.js instalado (versión 14 o más nueva)
- npm (viene con Node.js)

## Cómo instalarlo

1. Cloná el repositorio:
```bash
git clone https://github.com/eugezeintu/ProyectoFinalGrupo6.git
cd ProyectoFinalGrupo6
```

2. Instalá las dependencias:
```bash
npm install
```

Eso instala Express, CORS, jsonwebtoken y nodemon.

## Cómo ejecutarlo

Simplemente corré:
```bash
node server.js
```

El servidor va a arrancar en `http://localhost:3000`

Si querés que se reinicie solo cuando cambies algo, usá:
```bash
npx nodemon server.js
```

## Login

Para loguearte, tenés que hacer un POST a `http://localhost:3000/login` con:
```json
{
  "usuario": "tu@email.com",
  "password": "tucontraseña"
}
```

Si está todo bien, te devuelve un token que tenés que usar en los otros endpoints.

## Los endpoints

**Sin token (público):**
- `POST /login` - Para loguearte

**Con token (protegidos):**
Tenés que mandar el token en el header así: `Authorization: Bearer tu_token_aqui`

- `GET /api/cats/cat.json` - Lista de categorías
- `GET /api/cats_products/:id.json` - Productos de una categoría (cambiar :id por el número)
- `GET /api/products/:id.json` - Info de un producto específico
- `GET /api/products_comments/:id.json` - Comentarios de un producto
- `GET /api/user_cart/:id.json` - Carrito de un usuario
- `GET /api/sell/publish.json` - Datos para publicar
- `GET /api/cart/buy.json` - Datos para comprar

## Conectar con el frontend

En el archivo `js/init.js` del frontend, cambiá las rutas para que apunten a `http://localhost:3000/api/` en vez de la URL vieja.

Por ejemplo:
```javascript
const API_URL = 'http://localhost:3000/api';
```

Y cuando hagas fetch, agregá el token:
```javascript
fetch(`${API_URL}/cats/cat.json`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

## Dependencias que usa

- express - Para el servidor
- cors - Para que el frontend pueda conectarse
- jsonwebtoken - Para los tokens de login
- nodemon - Para desarrollo (se reinicia solo)

## Notas

- El token dura 2 horas, después tenés que loguearte de vuelta
- Todos los datos vienen de archivos JSON en la carpeta `data/`
- El middleware que verifica el token está en `js/authMiddleware.js`

---

**Grupo 6** - Jóvenes a Programar
