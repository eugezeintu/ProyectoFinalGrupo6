const express = require('express');

const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "123",
  database: "ecommerce",
  connectionLimit: 5,
});

const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const verificarToken = require('./js/authMiddleware');
const app = express();
const PORT = 3000;

// Clave secreta para firmar los tokens
const SECRET_KEY = 'mi_clave_secreta_super_segura_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para servir archivos estáticos (JSON)
app.use('/data', express.static(path.join(__dirname, 'data')));

// ==================== AUTENTICACIÓN ====================

// POST /login - Endpoint de autenticación
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  // Validar que se recibieron los datos
  if (!usuario || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Usuario y contraseña son requeridos' 
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(usuario)) {
    return res.status(400).json({ 
      success: false,
      message: 'El usuario debe ser un email válido' 
    });
  }

  // Validar longitud de contraseña
  if (password.length < 8 || password.length > 20) {
    return res.status(400).json({ 
      success: false,
      message: 'La contraseña debe tener entre 8 y 20 caracteres' 
    });
  }

  // Login exitoso - Generar token JWT
  const token = jwt.sign(
    { 
      usuario: usuario,
      loginTime: new Date().toISOString()
    }, 
    SECRET_KEY, 
    { expiresIn: '2h' }
  );

  

  // Respuesta exitosa
  res.json({
    success: true,
    message: 'Login exitoso',
    token: token,
    usuario: usuario
  });

});

// ==================== RUTAS API ====================

// 1. Obtener todas las categorías (PÚBLICA)
app.get('/api/cats/cat.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'cats', 'cat.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }
    res.json(JSON.parse(data));
  });
});

// 2. Obtener productos por categoría (PÚBLICA)
app.get('/api/cats_products/:id.json', (req, res) => {
  const categoryId = req.params.id;
  const filePath = path.join(__dirname, 'data', 'cats_products', `${categoryId}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(JSON.parse(data));
  });
});

// 3. Obtener información de un producto específico (PÚBLICA)
app.get('/api/products/:id.json', (req, res) => {
  const productId = req.params.id;
  const filePath = path.join(__dirname, 'data', 'products', `${productId}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

// 4. Obtener comentarios de un producto (PÚBLICA)
app.get('/api/products_comments/:id.json', (req, res) => {
  const productId = req.params.id;
  const filePath = path.join(__dirname, 'data', 'products_comments', `${productId}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Comentarios no encontrados' });
    }
    res.json(JSON.parse(data));
  });
});

// 5. Obtener carrito de un usuario (PROTEGIDA)
app.get('/api/user_cart/:id.json', verificarToken, (req, res) => {
  const userId = req.params.id;
  const filePath = path.join(__dirname, 'data', 'user_cart', `${userId}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

// 6. Endpoint para publicar producto (PROTEGIDA)
app.get('/api/sell/publish.json', verificarToken, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'sell', 'publish.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }
    res.json(JSON.parse(data));
  });
});

// 7. Endpoint para compra de carrito (PROTEGIDA)
app.get('/api/cart/buy.json', verificarToken, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'cart', 'buy.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }
    res.json(JSON.parse(data));
  });
});

// POST /cart - Endpoint de carrito
app.post("/cart",async (req,res)=>{
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      'INSERT INTO pedidos(id_usuario, id_producto, nombre_producto, cantidad, moneda, precio)VALUE (?,?,?,?,?,?)',
      [req.body.id_usuario, req.body.id_producto, req.body.nombre_producto, req.body.cantidad, req.body.moneda, req.body.precio]
    );
    res.json({id: parseInt(response.insertId), ...req.body});
  } catch (error){
    console.log(error);
    res.status(500).json({ message: "Se rompió el servidor hola"});
  } finally {
    if(conn) conn.release();
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido al Backend de eMercado',
    endpoints: {
      login: 'POST /login',
      categorias: '/api/cats/cat.json',
      productos_por_categoria: '/api/cats_products/:id.json',
      producto_detalle: '/api/products/:id.json',
      comentarios: '/api/products_comments/:id.json',
      carrito: '/api/user_cart/:id.json',
      publicar: '/api/sell/publish.json',
      comprar: '/api/cart/buy.json',
      cart: 'POST /cart'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔐 Endpoint de login: POST http://localhost:${PORT}/login`);
  console.log(`📁 Datos JSON en: http://localhost:${PORT}/data`);
});