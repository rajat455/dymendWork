const { addAbortListener } = require("events")
const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, toching, fourP } = require("../Constents")
const lotModel = require("../Lot/LotModel")
const workModel = require("./WorkModel")
const { CLIENT_RENEG_LIMIT } = require("tls")
const { log } = require("console")

class WorkConroller {

    async addWork(req, res) {
        try {
            const { lot, employee, purpose, totalPcs } = req.body
            if (!lot || !employee || !purpose || !totalPcs ) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const result = await workModel.insertWork(req.body)
            if (!result) return res.status(400).send({ message: SOMTHING_WENT_WRONG })
            await lotModel.updatePcs(purpose, lot, totalPcs)
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async complateWork(req, res) {
        try {
            const { lot, employee, purpose, completedPcs, rejectedPcs } = req.body
            if (!lot || !employee || !purpose || !completedPcs || !rejectedPcs) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const ToatalPcs = completedPcs + rejectedPcs
            const result = await workModel.comWork(lot, completedPcs, rejectedPcs)
            if (!result) return res.status(400).send({ message: SOMTHING_WENT_WRONG })
            await lotModel
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {

        }
    }

    async listWork(req, res) {
        try {
            const result = await workModel.list()
            if (!result) return res.status(400).send({ message: SOMTHING_WENT_WRONG })
            return res.status(400).send({ message: SUCCESS })
        } catch (error) {

            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })

        }
    }

    async updateWork(req, res) {
        
    }
}

const wrokConroller = new WorkConroller()

module.exports = wrokConroller