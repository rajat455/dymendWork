const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, toching, fourP } = require("../Constents")
const lotModel = require("../Lot/LotModel")
const workModel = require("./WorkModel")

class WorkConroller {
    async insertWork(req, res) {
        try {
            const { lot, employee, purpose, totalPcs } = req.body
            if (!lot || !employee || !purpose || !totalPcs) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const findLot = await lotModel.model.findById(lot)
            if (!findLot) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            const query = {
                availabelPcs: findLot.availabelPcs - totalPcs,
                tochingInProcessPcs:findLot.tochingInProcessPcs+ totalPcs,
                fourPinProcessPcs: findLot.fourPinProcessPcs + totalPcs
            }
            if(query.availabelPcs < 0){
                return res.status(500).send({message:SOMTHING_WENT_WRONG})
            }
            if (purpose === toching) delete query.fourPinProcessPcs
            if (purpose === fourP) delete query.tochingInProcessPcs
            const updateLot = await lotModel.model.updateOne({ _id: lot }, { ...query })
            if (!updateLot || updateLot.modifiedCount <= 0) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            const result = await workModel.insertWork({ ...req.body })
            if (!result) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async CompleteWork(req, res) {
        try {
            const { completedPcs, workId } = req.body
            if (!completedPcs || !workId) return res.status(200).send({ message: MISSING_DEPENDENCY })
            const updateAndFindWork = await workModel.model.findByIdAndUpdate(workId, { completedPcs: completedPcs }).populate([{ path: 'lot' }])

            if (!updateAndFindWork) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            let availabelPcs = updateAndFindWork.lot.availabelPcs + completedPcs
            let westPcs = updateAndFindWork.totalPcs - completedPcs
            const query = {
                tochingInProcessPcs: updateAndFindWork.lot.tochingInProcessPcs - (completedPcs + westPcs),
                tochingCompletedPcs: updateAndFindWork.lot.tochingCompletedPcs + completedPcs,
                fourPinProcessPcs: updateAndFindWork.lot.fourPinProcessPcs - (completedPcs + westPcs),
                fourPCompletedPcs: updateAndFindWork.lot.fourPCompletedPcs + completedPcs,
                westPcs: updateAndFindWork.lot.westPcs + westPcs,
                availabelPcs: availabelPcs,
            }
            if (updateAndFindWork.purpose === toching) {
                delete query.fourPinProcessPcs
                delete query.fourPCompletedPcs
            }
            if (updateAndFindWork.purpose === fourP) {
                delete query.tochingInProcessPcs
                delete query.tochingCompletedPcs
                delete query.availabelPcs
            }
            const updateLot = await lotModel.model.updateOne({ _id: updateAndFindWork.lot._id }, query)
            if (!updateLot || updateLot.modifiedCount <= 0) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async RejectWork(req,res){
        try {
            const {rejectedPcs,workId} =  req.body
            if(!rejectedPcs || !workId) return res.status(400).send({message:MISSING_DEPENDENCY})
            const findedWork= await workModel.model.findById(workId).populate([{path:'lot'}])
            if(!findedWork) return res.status(500).send({message:SOMTHING_WENT_WRONG})
            const totalPcs = findedWork.totalPcs - rejectedPcs
            const updateWork = await workModel.model.updateOne({_id:workId}, {totalPcs:totalPcs, rejectedPcs:rejectedPcs})
            if(!updateWork || updateWork.modifiedCount <= 0){
                return res.status(500).send({message:SOMTHING_WENT_WRONG})
            }
            const query=  {
                availabelPcs:findedWork.lot.availabelPcs + rejectedPcs,
                tochingInProcessPcs: findedWork.lot.tochingInProcessPcs - rejectedPcs,
                fourPinProcessPcs:findedWork.lot.fourPinProcessPcs - rejectedPcs
            }
            if(findedWork.purpose === toching) delete query.fourPinProcessPcs
            if(findedWork.purpose === fourP) delete query.tochingInProcessPcs
            const updateLot = await lotModel.model.updateOne({_id:findedWork.lot._id}, {...query})
            if(!updateLot || updateLot.modifiedCount <= 0) return res.status(500).send({message:SOMTHING_WENT_WRONG})
            return res.status(200).send({message:SUCCESS})
        } catch (error) {
            return res.status(500).send({message:INTERNAL_SERVER_ERROR})
        }
    }
}

const wrokConroller = new WorkConroller()

module.exports = wrokConroller