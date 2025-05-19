const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usuariosPath = "/api/user";
    this.categoriasPath = "/api/category";
    this.productosPath = "/api/products";

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }
  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));
  }
  routes() {
    this.app.use("/api/users", require("../routes/users"));
    this.app.use("/api/auth", require("../routes/auth"));
    this.app.use("/api/category", require("../routes/category"));
    this.app.use("/api/products", require("../routes/products"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto:", this.port);
    });
  }
}
module.exports = Server;
