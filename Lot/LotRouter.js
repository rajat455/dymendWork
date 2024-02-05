const express = require("express")
const lotController = require("./LotController")

const lotRouter = express.Router()

lotRouter.post("/", lotController.addLot)
lotRouter.get("/", lotController.listLot)

module.exports = lotRouter