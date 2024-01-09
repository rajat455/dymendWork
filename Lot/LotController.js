const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, ALLREADY_EXIST } = require("../Constents")
const lotModel = require("./LotModel")

class LotController {
    async insertLot(req, res) {
        try {
            const { kapan, lotNumber, totalPcs, weight } = req.body
            if (!kapan || !lotNumber || !totalPcs || !weight) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const reuslt = await lotModel.insertLot({ ...req.body})
            if (!reuslt) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            if(error.code === 11000) return res.status({message:ALLREADY_EXIST})
            return res.status(500).send({message:INTERNAL_SERVER_ERROR})
        }
    }


    
}

const lotController = new LotController()
module.exports = lotController