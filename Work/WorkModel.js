const { default: mongoose } = require("mongoose")

class WorkModel {
    constructor() {
        this.schema = new mongoose.Schema({
            lot: { type: mongoose.Types.ObjectId, ref: "tbl_lots", required: true },
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

    list(userInfo) {
        let query = [
            {
                $match: { employee: new mongoose.Types.ObjectId(userInfo._id) }
            },
            {
                $lookup: {
                    from: 'tbl_users', // Assuming the name of the employee collection
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            { $project: { "employee._id": false, "employee.phone": false, "employee.password": false, "employee.createdAt": false, "employee.updatedAt": false, "employee.role": false, "employee._v": false } },
            {
                $lookup: {
                    from: 'tbl_lots', // Assuming the name of the employee collection
                    localField: 'lot',
                    foreignField: '_id',
                    as: 'lot',
                },
            },
            { $unwind: "$lot" },
            {
                $lookup: {
                    from: 'tbl_kapans', // Assuming the name of the employee collection
                    localField: 'lot.kapan',
                    foreignField: '_id',
                    as: 'kapan'
                },
            },
            {
                $project: { "kapan.createdAt:": false, "kapan.updatedAt": false, "kapan.totalPcs": false, "kapan.totalWeight": false, "kapan.__v": false },
            },
            { $unwind: "$kapan" },
            {
                '$addFields': {
                    'lot.kapan': '$kapan',
                }
            },
            { $project: { kapan: false } }
        ]
        if (userInfo.role === "manager") {
            query.splice(0, 1)
            query = [
                ...query,
                { $match: { "lot.manager": new mongoose.Types.ObjectId(userInfo._id) } },
                {
                    $lookup: {
                        from: 'tbl_users', // Assuming the name of the employee collection
                        localField: 'lot.manager',
                        foreignField: '_id',
                        as: 'manager'
                    },
                },
                { $unwind: "$manager" },
                {
                    $project: {
                        'manager.phone': false,
                        'manager.password': false,
                        'manager.createdAt': false,
                        'manager.updatedAt': false,
                        'manager.role': false,
                        'manager.__v': false
                    }
                },
                {
                    '$addFields': {
                        'lot.manager': '$manager'
                    }
                },
                {
                    $project: { "manager": false }
                }
            ]
        }
        if (userInfo.role === "admin") {
            query.splice(0, 1)
            query = [
                ...query,
                {
                    '$addFields': {
                        'lot.kapan': '$kapan',
                    }
                },
            ]

        }

        return this.model.aggregate([
            ...query,
            { $sort: { createdAt: -1 } }
        ]);
    }

    fetchDashboard(userInfo, startTime) {
        if (!startTime) {
            startTime = new Date()
            startTime.setDate(startTime.getDate() - 1)
            startTime.setHours(23)
            startTime.setMinutes(59)
            startTime.setSeconds(59)
        }
        const query = [
            {
                $match: { employee: new mongoose.Types.ObjectId(userInfo._id), createdAt: { $gte: startTime } }
            },
            {
                $lookup:{
                    from: 'tbl_lots',
                    localField: 'lot',
                    foreignField: '_id',
                    as: 'lot'
                }
            },
            {
                $unwind:"$lot"
            },
            {
                $group: {
                    _id: "$purpose",
                    totalPcs: { $sum:"$totalPcs" },
                    completedPcs:{$sum:"$completedPcs"},
                    rejectedPcs:{$sum:"$rejectedPcs"},
                    rows: { $push: "$$ROOT" }
                }
            }
        ]

        return this.model.aggregate(query)
    }

    comWork(data) {
        return this.model.updateOne({ _id: data._id }, { completedPcs: data.completedPcs, rejectedPcs: data.rejectedPcs })
    }
}

const workModel = new WorkModel()

module.exports = workModel