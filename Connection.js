const { default: mongoose } = require("mongoose");

async function ConnectDb(){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/project1")
        console.log("Db Connected")
    } catch (error) {
        console.log("db Connection Loss")
    }
}

module.exports = ConnectDb