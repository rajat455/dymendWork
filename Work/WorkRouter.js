const express = require("express")
const wrokConroller = require("./WorkController")

const workRoter = express.Router()

workRoter.post("/", wrokConroller.addWork)
workRoter.get("/", wrokConroller.listWork)
workRoter.post("/complet", wrokConroller.complateWork)
workRoter.get("/countWorkPenddingWork", wrokConroller.countPendingWork)
workRoter.get("/fetchEmployeeDashboard", wrokConroller.FetchDashboard)

module.exports = workRoter