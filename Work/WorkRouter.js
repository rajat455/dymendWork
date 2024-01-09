const express = require("express")
const wrokConroller = require("./WorkController")

const workRoter = express.Router()

workRoter.post("/", wrokConroller.insertWork)
workRoter.put("/complete", wrokConroller.CompleteWork)
workRoter.put("/reject", wrokConroller.RejectWork)

module.exports = workRoter