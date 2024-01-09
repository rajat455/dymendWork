const express = require("express")
const lotController = require("./LotController")

const lotRouter = express.Router()

lotRouter.post("/", lotController.insertLot)

module.exports = lotRouter