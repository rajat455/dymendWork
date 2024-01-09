const { default: mongoose } = require("mongoose");

class LotModel {
    constructor() {
        this.schema = new mongoose.Schema({
            lotNumber: { type: String, required: true },
            kapan: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_kapans" },
            manager: { type: mongoose.Types.ObjectId, default: null, ref: "tbl_users" },
            totalPcs: { type: Number, required: true },
            
            weight:{type:Number, required:true},
        }, {
            timestamps:true,
            indexes: [
                {
                    fields: ['kapan', 'lotNumber'],
                    unique: true,
                },
            ],
        })
        this.model = mongoose.model("tbl_lots", this.schema)
    }

    insertLot(data){
        return this.model.create({...data})
    }
}
const lotModel = new LotModel()
module.exports = lotModel