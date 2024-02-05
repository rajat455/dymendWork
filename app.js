const express = require("express")
const ConnectDb = require("./Connection")
const userRouter = require("./User/UserRouter")
const cors = require("cors")
const kapanRouter = require("./Kapan/KapanRouter")
const lotRouter = require("./Lot/LotRouter")
const workRoter = require("./Work/WorkRouter")
const Auth = require("./Auth")
const permissionModel = require("./Permission/PermissionModel")
const permissionController = require("./Permission/PermissionController")
permissionModel


const app = express()

app.use(cors())
app.use(express.json())

ConnectDb()

app.get("/permission/:role", permissionController.getPermissions)

permissionModel.model.updateOne({role:"employee"}, {permissions:{work:"/work", dashBoard:"/"}})

app.use("/api/user", userRouter)
app.use(Auth)
app.use("/api/kapan", kapanRouter)
app.use("/api/lot", lotRouter)
app.use("/api/work", workRoter)









app.listen(5000, () => {
    console.log("Sever Started")
})

