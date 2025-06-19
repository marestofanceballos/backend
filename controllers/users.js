const { request, response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find().sort({ name: 1 }).select("-password"),
  ]);

  res.status(200).json({
    total,
    users,
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
  const { name, email, password, role, surname, img, cartshop } = req.body;

  const existeEmail = await User.findOne({ email, _id: { $ne: id } });
  if (existeEmail) {
    return res.status(400).json({
      msg: `El correo ${email} ya está registrado para otro usuario`,
    });
  }

  const usuarioActual = await User.findById(id);

  if (password && password.length < 8) {
    return res.status(400).json({
      msg: "La contraseña debe tener al menos 8 caracteres",
    });
  }

  const salt = bcrypt.genSaltSync();
  const hashedPassword = password
    ? bcrypt.hashSync(password, salt)
    : usuarioActual.password;

  const updatedRole = role || usuarioActual.role;

  let data = {
    name: name || usuarioActual.name,
    email,
    password: hashedPassword,
    role: updatedRole,
  };

  if (surname !== undefined) {
    data.surname = surname;
  }

  if (img !== undefined) {
    data.img = img;
  }

  // Validar y agregar cartshop si viene en la petición
  if (Array.isArray(cartshop)) {
    const validCartshop = cartshop.filter(item =>
      item.product && item.cantidad && typeof item.cantidad === "number"
    );
    data.cartshop = validCartshop;
  }

  const usuario = await User.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    message: "Usuario actualizado",
    usuario,
  });
};


const usuarioDelete = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener usuario actual
    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    // Alternar el estado
    const nuevoEstado = !usuario.status;

    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      { status: nuevoEstado },
      { new: true }
    );

    res.status(200).json({
      message: `Usuario ${nuevoEstado ? "activado" : "eliminado"}`,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar el estado del usuario",
    });
  }
};

const usuarioGet = async (req = request, res = response) => {
  const { id } = req.params;

  const usuario = await User.findById(id).select("-password");
  if (!usuario) {
    return res.status(404).json({
      msg: "Usuario no encontrado",
    });
  }

  res.status(200).json({
    usuario,
  });
};

module.exports = {
  usuariosGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
  usuarioGet,
};
