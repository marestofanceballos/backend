const { request, response } = require("express");
const Category = require("../models/category");

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
  const categoria = await Category.findById(id).populate(
    "user",
    "name email"
  );
  
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

  const categoria = await Category.findByIdAndUpdate(id, datos, { new: true });

  res.status(200).json({
    categoria,
  });
};

const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoriaBorrada = await Category.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.status(200).json({
    msg: "Categoría inactivada",
    categoriaBorrada,
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
