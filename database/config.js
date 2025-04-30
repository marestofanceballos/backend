const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:student2025@cluster0.srefzil.mongodb.net/testDB")
        console.log('Base de datos online');
    }
    catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }

}
module.exports = {
    dbConnection
}
