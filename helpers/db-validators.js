const Role = require("../models/role");
const User = require("../models/user");
const Product = require("../models/product");
const Category = require("../models/category");

const esRoleValido = async (role) => 
   {
    const existeRole = await Role.findOne({ role });
    if (!existeRole) {
      throw new Error(`El rol ${role} no está registrado en la BD`);
    }
  } 
;

const emailExiste = async (email) => {
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
     throw new Error(`El correo ${email} ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
   throw new Error(`El id ${id} NO existe`);
  }

  if (!existeUsuario.status) {
throw new Error(`El usuario ${existeUsuario.name} está inactivo`);
  }
};
const productoExiste = async (id) => {
  const existeProducto = await Product.findById(id);
  if (!existeProducto) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

const categoriaExiste = async (id) => {
  const existeCategoria = await Category.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  productoExiste,
  categoriaExiste,
};