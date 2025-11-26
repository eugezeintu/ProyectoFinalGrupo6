const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mi_clave_secreta_super_segura_2024';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'Token no proporcionado' 
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado o inválido' 
      });
    }

    req.usuario = decoded;
    next();
  });
}

module.exports = verificarToken;