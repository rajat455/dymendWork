const { MISSING_DEPENDENCY, SOMTHING_WENT_WRONG, SUCCESS, INTERNAL_SERVER_ERROR, ALLREADY_EXIST, FOREIGN_KEY_EXIST, JWT_SCARATE } = require("../Constents")
const bcrypt = require("bcrypt")
const userModel = require("./UserModel")
const jwt = require("jsonwebtoken")
const { restart } = require("nodemon")
const permissionModel = require("../Permission/PermissionModel")

class UserController {
    async addUser(req, res) {
        try {
            const { firstName, password, lastName, phone, role } = req.body
            if (!firstName || !lastName || !role || !phone || !password) return res.status(400).send({ message: MISSING_DEPENDENCY })

            req.body.password = bcrypt.hashSync(password, 8)
            const result = await userModel.createUser({ ...req.body })
            if (!result) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            if (error.code === 11000) return res.status(400).send({ message: ALLREADY_EXIST })
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async deleteUesr(req, res) {
        try {
            const { id } = req.params
            let result = await userModel.model.findById(id)
            await result.deleteOne()
            if (!result || result.deletedCount <= 0) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS })
        } catch (error) {
            console.log(error)
            if (error.code === FOREIGN_KEY_EXIST) return res.status(400).send({ message: PRIMARY_KEY_USED })
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async getUsers(req, res) {
        try {
            const { role } = req.params
            const result = await userModel.model.find(role !== "all" ? { role: role } : undefined)
            if (!result) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS, data: result })
        } catch (error) {
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }

    async LoginUser(req, res) {
        try {
            const { phone, password } = req.body
            if (!phone || !password) return res.status(400).send({ message: MISSING_DEPENDENCY })
            let user = await userModel.model.findOne({ phone: phone })
            user = user?._doc
            if (!user) return res.status(401).send({ message: "Phone Number Not Found" })
            const permissions = await permissionModel.model.findOne({role:user.role})
            if(!permissions) return res.status(200).send({message:SOMTHING_WENT_WRONG})
            const checkPassword = bcrypt.compareSync(password, user.password)
            if (!checkPassword) return res.status(401).send({ message: "Password not match" })
            delete user.password
            const token = jwt.sign({ ...user }, JWT_SCARATE, { expiresIn: "1d" })
            if (!token) return res.status(500).send({ message: SOMTHING_WENT_WRONG })
            return res.status(200).send({ message: SUCCESS, token: token, permissions })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
        }
    }
}

const userController = new UserController()

module.exports = userController