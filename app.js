const express = require("express")
const ConnectDb = require("./Connection")
const userRouter = require("./User/UserRouter")
const cors = require("cors")
const kapanRouter = require("./Kapan/KapanRouter")
const lotRouter = require("./Lot/LotRouter")
const workRoter = require("./Work/WorkRouter")



const app = express()

app.use(cors())
app.use(express.json())

ConnectDb()

app.use("/api/user", userRouter)
app.use("/api/kapan", kapanRouter)
app.use("/api/lot", lotRouter)
app.use("/api/work", workRoter)



app.listen(5000, () => {
    console.log("Sever Started")
})

