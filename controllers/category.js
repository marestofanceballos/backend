const { request, response } = require("express");
const Category = require("../models/category");
const User = require("../models/user");

const obtenerCategorias = async (req = request, res = response) => {
  const { desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Category.countDocuments(),
    Category.find()
      .sort({ nombre: 1 })
      .skip(desde)
      .populate("user", "name email"),
  ]);

  res.status(200).json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Category.findById(id).populate("user", "name email");

  res.status(200).json({
    categoria,
  });
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Category.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Category(data);
  await categoria.save();
  res.status(200).json(categoria);
};

const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;
  const usuario = req.usuario._id;

  const datos = {
    estado,
    usuario,
  };

  if (req.body.nombre) {
    datos.nombre = req.body.nombre.toUpperCase();
  }

  const categoria = await Category.findByIdAndUpdate(id, datos, { new: true });

  res.status(200).json({
    categoria,
  });
};

const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    // Obtener categoría actual
    const categoria = await Category.findById(id);

    if (!categoria) {
      return res.status(404).json({
        msg: "Categoría no encontrada",
      });
    }

    // Alternar el estado
    const nuevoEstado = !categoria.estado;

    const categoriaActualizada = await Category.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }
    );

    res.status(200).json({
      message: `Categoría ${nuevoEstado ? "activada" : "inactivada"}`,
      categoria: categoriaActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar el estado de la categoría",
    });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
