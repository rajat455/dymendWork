const { default: mongoose } = require("mongoose")

class WorkModel {
    constructor() {
        this.schema = new mongoose.Schema({
            lot: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_lots" },
            employee: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_users" },
            purpose: { type: String, required: true },
            totalPcs: { type: Number, required: true },
            completedPcs: { type: Number, required: true, default: 0 },
            rejectedPcs: { type: Number, required: true, default: 0 },
        }, {
            timestamps: true,
        })
        this.model = mongoose.model("tbl_works", this.schema)
    }

    insertWork(data) {
        return this.model.create({ ...data })
    }

    list() {
        return this.model.find()
    }

    comWork(data) {
        return this.model.updateOne({ _id: data._id }, { completedPcs: data.completedPcs, rejectedPcs: data.rejectedPcs })
    }
}

const workModel = new WorkModel()

module.exports = workModel