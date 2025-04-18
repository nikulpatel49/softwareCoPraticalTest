const roleService = require("../../services/role/role.service");
const {
	successResponse,
	errorResponse,
	badRequestResponse,
} = require("../../utils/apiResponse");

module.exports.getRoles = async (req, res) => {
	try {
		const roleFetchnResult = await roleService.getRoles();
		return successResponse(res, roleFetchnResult.data, "Success");
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.addNewRole = async (req, res) => {
	try {
		const roleCreationResult = await roleService.addRole(req.body);
		if (roleCreationResult.status) {
			return successResponse(res, roleCreationResult.data, {
				message: "Role has been successfully created",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: roleCreationResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.updateRole = async (req, res) => {
	try {
		const id = req.params?.id;
		const roleUpdationResult = await roleService.updateRole({
			id,
			...req.body,
		});
		if (roleUpdationResult.status) {
			return successResponse(res, roleUpdationResult.data, {
				message: "Role has been successfully updated",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: roleUpdationResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.deleteRole = async (req, res) => {
	try {
		const id = req.params?.id;
		const roleDeletionResult = await roleService.deleteRole(id);
		if (roleDeletionResult.status) {
			return successResponse(res, roleDeletionResult.data, {
				message: "Role has been successfully deleted",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: roleDeletionResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.addNewRoleAccessModule = async (req, res) => {
	try {
		const id = req.params?.id;
		const roleUpdationResult = await roleService.addNewRoleAccessModule({
			id,
			...req.body,
		});

		if (roleUpdationResult.status) {
			return successResponse(res, roleUpdationResult.data, {
				message:
					"Module has been successfully added to the role access module.",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: roleUpdationResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.removeRoleAccessModule = async (req, res) => {
	try {
		const id = req.params?.id;
		const roleDeletionResult = await roleService.removeRoleAccessModule({
			id,
			...req.body,
		});

		if (roleDeletionResult.status) {
			return successResponse(res, roleDeletionResult.data, {
				message:
					"Module has been successfully deleted to the role access module.",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: roleDeletionResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};
