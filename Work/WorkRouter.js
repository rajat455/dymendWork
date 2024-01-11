const express = require("express")
const wrokConroller = require("./WorkController")

const workRoter = express.Router()

workRoter.post("/add", wrokConroller.addWork)
workRoter.get("/", wrokConroller.listWork)

module.exports = workRoter