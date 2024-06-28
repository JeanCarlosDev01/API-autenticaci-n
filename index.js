const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configuración de la conexión a la base de datos
const db_config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbusuarios',
};

// Conexión a la base de datos
const connection = mysql.createConnection(db_config);

// Middleware para procesar el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Ruta para el registro de usuarios
app.post('/registro', (req, res) => {
  // Obtener datos del cuerpo de la solicitud
  const { usuario, contrasena } = req.body;

  // Validar que se proporcionaron usuario y contraseña
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Se requieren usuario y contraseña' });
  }

  // Insertar nuevo usuario en la base de datos
  const query = 'INSERT INTO usuarios (usuario, contrasenia) VALUES (?, ?)';
  connection.query(query, [usuario, contrasena], (err) => {
    if (err) {
      return res.status(500).json({ error: `Error en la base de datos: ${err.message}` });
    }
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  // Obtener datos del cuerpo de la solicitud
  const { usuario, contrasena } = req.body;

  // Validar que se proporcionaron usuario y contraseña
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Se requieren usuario y contraseña' });
  }

  // Verificar la autenticación del usuario
  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?';
  connection.query(query, [usuario, contrasena], (err, results) => {
    if (err) {
      return res.status(500).json({ error: `Error en la base de datos: ${err.message}` });
    }

    if (results.length > 0) {
      return res.status(200).json({ mensaje: 'Autenticación satisfactoria' });
    } else {
      return res.status(401).json({ error: 'Error en la autenticación' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
