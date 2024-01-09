const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, ALLREADY_EXIST, FOREIGN_KEY_EXIST, PRIMARY_KEY_USED } = require("../Constents")
const userModel = require("../User/UserModel")
const kapanModel = require("./KapanModel")

class KapanController {
    async addKapan(req, res) {
        try {
            const { totalLot, totalWaight, totalPcs, kapan } = req.body
            if (!totalLot || !totalWaight || !totalPcs || !kapan) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const result = await kapanModel.createKapan({ ...req.body })
            if (!result) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({message:SUCCESS})
        } catch (error) {
            if(error.code === 11000) return res.status(400).send({message:ALLREADY_EXIST})
            return res.status(500).send({message:INTERNAL_SERVER_ERROR})
        }
    }

    async ListKapan(req,res){
        try {
            const result = await kapanModel.model.find()
            if(!result) return res.status(500).send({message:SOMTHING_WENT_WRONG})
            return res.status(200).send({message:SUCCESS, data:result})
        } catch (error) {
            return res.status(500).send({message:INTERNAL_SERVER_ERROR})
        }
    }

    async DeleteKapan(req,res){
        try {
            const {id} =req.params
            let result = await kapanModel.model.findById(id)
            result =await result.deleteOne()
            if(!result || result.deletedCount <= 0) return res.status(500).send({message:SOMTHING_WENT_WRONG})
            return res.status(200).send({message:SUCCESS})
        } catch (error) {
            if(error.code === FOREIGN_KEY_EXIST) return res.status(400).send({message:PRIMARY_KEY_USED})
            return res.status(500).send({message:INTERNAL_SERVER_ERROR})
        }
    }
}

const kapanController = new KapanController()
module.exports = kapanController