const { request, response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { role: "USER_ROLE", state: true };

  const [total, usuarios] = await Promise.all([
    User.countDocuments(query),
    User.find(query).sort({ nombre: 1 }).limit(limite).skip(desde),
  ]);

  res.status(200).json({
    total,
    User,
  });
};

const usuarioPost = async (req = request, res) => {
  const { name, email, password, role, surname } = req.body;

  const usuario = new User({ name, email, password, role, surname });

  
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    return res.status(400).json({
      msg: `El correo ${email} ya está registrado`,
    });
  }

  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);


  await usuario.save();

  res.status(201).json({
    message: "Usuario creado",
    usuario, 
  });
};

const usuarioPut = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, surname } = req.body;

  const existeEmail = await User.findOne({ email, _id: { $ne: id } });
  if (existeEmail) {
    return res.status(400).json({
      msg: `El correo ${email} ya está registrado para otro usuario`,
    });
  }

  const usuarioActual = await Usuario.findById(id);

  if (password && password.length < 8) {
    return res.status(400).json({
      msg: "La contraseña debe tener al menos 8 caracteres",
    });
  }

  const salt = bcrypt.genSaltSync();
  const hashedPassword = password ? bcrypt.hashSync(password, salt) : usuarioActual.password;
  
  const updatedRole = role || usuarioActual.role; 
  
  let data = {
    name: name || usuarioActual.name,
    email,
    password: hashedPassword,
    role: updatedRole,
  };

  const usuario = await User.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    message: "Usuario actualizado",
    usuario,
  });
};

const usuarioDelete = async (req, res) => {
  const { id } = req.params;

  

  const usuarioBorrado = await User.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  );

  res.status(200).json({
    message: "Usuario eliminado",
    usuarioBorrado,
  });
};

module.exports = {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};
