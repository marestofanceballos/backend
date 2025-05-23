const { response, request } = require("express");
const Product = require("../models/product");

const obtenerProductos = async (req = request, res = response) => {
  try {
    const [total, Products] = await Promise.all([
      Product.countDocuments(),
      Product.find()
        .sort({ nombre: 1 })
        .populate("category", "nombre")
        .populate("user", "name"),
    ]);

    res.json({
      total,
      Products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener los Productos",
    });
  }
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Product.findById(id)
    .populate("category", "nombre")
    .populate("user", "name");

  res.json({
    producto,
  });
};

const ProductoPost = async (req, res) => {
  const { precio, categoria, descripcion, img, stock } = req.body;

  const nombre = req.body.nombre.toUpperCase();

  const ProductDB = await Product.findOne({ nombre });

  if (ProductDB) {
    return res.status(400).json({
      msg: `El Producto ${ProductDB.nombre} ya existe`,
    });
  }

  const data = {
    nombre,
    categoria,
    precio,
    descripcion,
    img,
    stock,
    usuario: req.usuario._id,
  };

  const product = new Product(data);

  await product.save();

  res.status(201).json({
    msg: "Se agregó Producto",
    product,
  });
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { precio, category, descripcion, disponible, estado } = req.body;
  const user = req.usuario._id;

  let data = {
    precio,
    descripcion,
    category,
    disponible,
    user,
    estado,
  };

  if (req.body.nombre) {
    data.nombre = req.body.nombre.toUpperCase();
  }

  if (req.body.stock) {
    data.stock = req.body.stock;
  }
  if (req.body.img) {
    data.img = req.body.img;
  }

  const product = await Product.findByIdAndUpdate(id, data, { new: true })
    .populate("category", "nombre")
    .populate("user", "name");

  res.status(200).json(product);
};

const borrarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener producto actual
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        msg: "Producto no encontrado",
      });
    }

    // Alternar el estado
    const nuevoEstado = !product.estado;

    const productoActualizado = await Product.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }
    );

    res.status(200).json({
      message: `Producto ${nuevoEstado ? "activado" : "eliminado"}`,
      producto: productoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar el estado del producto",
    });
  }
};

module.exports = {
  ProductoPost,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
