const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Correo o Contraseña incorrectos",
      });
    }

    
    if (!user.status) {
      return res.status(400).json({
        msg: "Usuario no esta activo",
      });
    }

    
    const validarPassword = bcryptjs.compareSync(password, user.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Correo o Contraseña incorrectos",
      });
    }

    
    const token = await generarJWT(user.id);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Comunicarse con Admin.",
    });
  }
};

const obtenerID = (req = request, res = response) => {
  const { id, role } = req.user;

  res.json({
    id,
    role,
  });
};

module.exports = {
  login,
  obtenerID,
};