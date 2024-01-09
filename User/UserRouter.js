const express = require("express")
const userController = require("./UserController")

const userRouter = express.Router()

userRouter.post("/", userController.addUser)
userRouter.delete("/:id", userController.deleteUesr)
userRouter.get("/:role", userController.getUsers)

module.exports = userRouter