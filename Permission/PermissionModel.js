const { default: mongoose } = require("mongoose");

class PermissionModel {
    constructor() {
        this.schema = new mongoose.Schema({
            role: { type: String, require: true, unique: true },
            permissions: { type: Object, required: true },
        })
        this.model = mongoose.model("tbl_permissions",this.schema)
    }
}

const permissionModel = new PermissionModel()


const data = {
    "admin": {
        "user": "/user",
        "kapan": "/kapan",
        "lot": "/lot",
        "work": "/work",
        "login": "/login",
        "dashBoard": "/"
    },
    "manager": {
        "user": "/user",
        "lot": "/lot",
        "work": "/work",
        "login": "/login",
        "dashBoard": "/"
    },
    "employee": {
        "work": "/work"
    }
}



module.exports = permissionModel