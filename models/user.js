const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  surname: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  role: {
    type: String,
    default: "USER_ROLE",
  },
  status: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
  cartshop: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1,
      },
      // Puedes agregar más campos si lo necesitas (por ejemplo, precio al momento de la compra)
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
