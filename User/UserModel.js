const { default: mongoose } = require("mongoose");
// const lotModel = require("../Lot/LotModel");

class UserModel {
    constructor(){
        this.schema = new mongoose.Schema({
            firstName:{type:String, required:true},
            lastName:{type:String, required:true},
            phone:{type:String, required:true, length:10, unique:true},
            password:{type:String, required:true},
            role:{type:String,required:true},
            
        },{
            timestamps:true
        })
        // this.schema.pre('deleteOne', { document: true, query: false }, async function (next) {
            
        //     const manager = this._id
        //     const islotExist = await lotModel.model.findOne({ manager: manager });
        //     if (islotExist) {
        //         const err = new Error("Cannot delete user because it is being used in lots");
        //         err.code = FOREIGN_KEY_EXIST
        //         return next(err);
        //     }
        //     next()
        // });

        this.model = mongoose.model("tbl_users", this.schema)
    }

    createUser(data){
        return this.model.create({...data})
    }

}

const userModel = new UserModel()
module.exports = userModel