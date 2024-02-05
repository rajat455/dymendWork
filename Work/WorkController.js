const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, toching, fourP, WORK_NOT_FOUND } = require("../Constents")
const lotModel = require("../Lot/LotModel")
const workModel = require("./WorkModel")
const { CLIENT_RENEG_LIMIT } = require("tls")

class WorkConroller {

    async addWork(req, res) {
        try {
            const { lot, employee, purpose, totalPcs } = req.body
            if (!lot || !employee || !purpose || !totalPcs) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const result = await workModel.insertWork(req.body)
            if (!result) return res.status(400).send({ message: SOMTHING_WENT_WRONG })
            await lotModel.updatePcs({ ...req.body })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async complateWork(req, res) {
        try {
            const { _id, lot, purpose, completedPcs, rejectedPcs } = req.body
            if (!_id || !lot || !purpose) return res.status(400).send({ message: MISSING_DEPENDENCY })
            const totalPcs = completedPcs + rejectedPcs
            const result = await workModel.comWork({ ...req.body })
            if (!result) return res.status(400).send({ message: SOMTHING_WENT_WRONG })
            await lotModel.completeWork({ ...req.body, totalPcs })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async listWork(req, res) {
        try {
            let result = await workModel.list(req.body.userInfo)
            if (!result) return res.status(400).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async countPendingWork(req, res) {
        try {
            const { userInfo } = req.body
            const result = await workModel.model.find({ employee: userInfo._id, completedPcs: 0, rejectedPcs: 0 }).countDocuments()
            if (result >= 0) return res.status(200).send({ message: SUCCESS, totalWork: result })
            return res.status(500).send({ message: SOMTHING_WENT_WRONG })
        } catch (error) {
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async FetchDashboard(req, res) {
        try {
            const { userInfo } = req.body
            let todayData = await workModel.fetchDashboard(userInfo)
            if (!todayData) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            let tochingData;
            let fourPData;
            if (todayData[0] && todayData[0]._id === "toching") {
                tochingData = todayData[0]
                fourPData = todayData[1]
            } else {
                tochingData = todayData[1]
                fourPData = todayData[0]
            }

            todayData = {
                tochingData: tochingData ? { ...tochingData } : {},
                fourPData: fourPData ? { ...fourPData } : {}
            }
            let startDate = new Date()
            startDate.setMonth(startDate.getMonth() - 1)
            startDate.setDate(1)
            startDate.setHours(0, 0, 0, 0)
            let MonthleyData = await workModel.fetchDashboard(userInfo, startDate)
            if (!MonthleyData) return res.status(500).send({ message: SOMTHING_WENT_WRONG })

            if (MonthleyData[0] && MonthleyData[0]._id === "toching") {
                tochingData = MonthleyData[0]
                fourPData = MonthleyData[1]
            } else {
                tochingData = MonthleyData[1]
                fourPData = MonthleyData[0]
            }
            MonthleyData = {
                tochingData: tochingData ? { ...tochingData } : {},
                fourPData: fourPData ? { ...fourPData } : {}
            }
            const data = {
                month: MonthleyData,
                today: todayData
            }
            return res.status(200).send({ message: SUCCESS, data })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }
}

const wrokConroller = new WorkConroller()
module.exports = wrokConroller