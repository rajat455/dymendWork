const express = require("express")
const userController = require("./UserController")
const Auth = require("../Auth")

const userRouter = express.Router()

userRouter.post("/login", userController.LoginUser)
userRouter.use(Auth)
userRouter.post("/", userController.addUser)
userRouter.delete("/:id", userController.deleteUesr)
userRouter.get("/:role", userController.getUsers)

module.exports = userRouter