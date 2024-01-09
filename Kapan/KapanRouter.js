const express = require("express")
const kapanController = require("./KapanController")


const kapanRouter= express.Router()

kapanRouter.post("/", kapanController.addKapan)
kapanRouter.get("/", kapanController.ListKapan)
kapanRouter.delete("/:id", kapanController.DeleteKapan)

module.exports = kapanRouter