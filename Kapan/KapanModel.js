const { default: mongoose } = require("mongoose");
const lotModel = require("../Lot/LotModel");
const { FOREIGN_KEY_EXIST } = require("../Constents");

class KapanModel {
    constructor() {
        this.schema = new mongoose.Schema({
            kapan: { type: String, required: true, unique: true },
            totalWaight: { type: Number, required: true },
            totalPcs: { type: Number, required: true },
            totalLot: { type: Number, required: true },
        }, {
            timestamps: true
        })
        this.schema.pre('deleteOne', { document: true, query: false }, async function (next) {

            const kapanId = this._id
            const islotExist = await lotModel.model.findOne({ kapan: kapanId });
            if (islotExist) {
                const err = new Error("Cannot delete Kapan because it is being used in lots");
                err.code = FOREIGN_KEY_EXIST
                return next(err);
            }
            next()
        });


        this.model = mongoose.model("tbl_kapans", this.schema)
    }
    createKapan(data) {
        return this.model.create({ ...data })
    }

    updateKapan(data) {
        return this.model.updateOne({ _id: data._id }, { totalLot: data.totalLot, totalPcs: data.totalPcs, totalWaight: data.totalWaight })
    }

}

const kapanModel = new KapanModel()
module.exports = kapanModel