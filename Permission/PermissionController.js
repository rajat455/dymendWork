const { INTERNAL_SERVER_ERROR, SUCCESS } = require("../Constents")
const permissionModel = require("./PermissionModel")

class PermissionController {
    async getPermissions(req, res) {
        try {
            const role = req.params.role
            const permissions = await permissionModel.model.findOne({role:role})
            if(!permissionModel) return res.status(500).send({message:INTERNAL_SERVER_ERROR})
            return res.status(200).send({message:SUCCESS, permissions:permissions.permissions})
        } catch (error) {
            return res.status(500).send({message:INTERNAL_SERVER_ERROR})
        }
    }
}

const permissionController = new PermissionController()
module.exports = permissionController