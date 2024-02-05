const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, ALLREADY_EXIST } = require("../Constents")
const lotModel = require("./LotModel")

class LotController {

    async addLot(req, res) {
        try {
            const { lotNumber, kapan, weight, totalPcs } = req.body
            if (!lotNumber || !weight || !totalPcs || !kapan) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const result = await lotModel.model.create({ ...req.body, availabelPcs: totalPcs })
            if (!result) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            console.log(error)
            if (error.code === 11000) return res.status(400).send({ message: ALLREADY_EXIST })
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async listLot(req, res) {
        try {
            const result = await lotModel.model.find().populate([{ path: "manager" }, { path: "kapan" }])
            if (!result) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS, data: result })
        } catch (error) {
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }
}

const lotController = new LotController()
module.exports = lotController