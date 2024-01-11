const { default: mongoose } = require("mongoose");
const { toching } = require("../Constents");

class LotModel {
    constructor() {
        this.schema = new mongoose.Schema({
            lotNumber: { type: String, required: true },
            kapan: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_kapans" },
            manager: { type: mongoose.Types.ObjectId, default: null, ref: "tbl_users" },
            weight: { type: Number, required: true },
            totalPcs: { type: Number, required: true },
            availabelPcs: { type: Number, required: true },
            tochingPendingPcs: { type: Number, required: true, default: 0 },
            tochingCompletedPcs: { type: Number, required: true, default: 0 },
            fourpPendingPcs: { type: Number, required: true, default: 0 },
            fourpCompletedPcs: { type: Number, required: true, default: 0 },
        }, {
            timestamps: true,
            indexes: [
                {
                    fields: ['kapan', 'lotNumber'],
                    unique: true,
                },
            ],
        })
        this.model = mongoose.model("tbl_lots", this.schema)
    }

    insertLot(data) {
        return this.model.create({ ...data })
    }

    // Update Lot
    updatePcs(data) {
        const tochingData = {
            availabelPcs: -data.totalPcs,  
            tochingPendingPcs: data.totalPcs 
        }
        const fourPData = {
            tochingCompletedPcs: -data.totalPcs, 
            fourpPendingPcs: data.totalPcs
        }
        return this.model.updateOne({ _id: data.lot }, { $inc: data.purpose == toching ? tochingData : fourPData })
    }

    completeWork(data){
        const tochingData ={
            tochingPendingPcs: -data.totalPcs, 
            tochingCompletedPcs: data.completedPcs, 
            availabelPcs: data.rejectedPcs
        }
        const fourPData = {
            fourpPendingPcs: -data.totalPcs, 
            fourpCompletedPcs: data.completedPcs, 
            tochingCompletedPcs: data.rejectedPcs
        }
        return this.model.updateOne({_id: data.lot}, { $inc: data.purpose == toching ? tochingData : fourPData})
    }
}
const lotModel = new LotModel()
module.exports = lotModel 