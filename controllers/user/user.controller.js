const userService = require("../../services/user/user.service");
const {
	successResponse,
	errorResponse,
	badRequestResponse,
} = require("../../utils/apiResponse");

module.exports.getUsers = async (req, res) => {
	try {
		const userFetchnResult = await userService.getUsers();
		return successResponse(res, userFetchnResult.data, "Success");
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.addNewUser = async (req, res) => {
	try {
		const userCreationResult = await userService.addUser(req.body);
		if (userCreationResult.status) {
			return successResponse(res, userCreationResult.data, {
				message: "User has been successfully created",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: userCreationResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.updateUser = async (req, res) => {
	try {
		const id = req.params?.id;
		const userUpdationResult = await userService.updateUser({
			id,
			...req.body,
		});
		if (userUpdationResult.status) {
			return successResponse(res, userUpdationResult.data, {
				message: "User has been successfully updated",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: userUpdationResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.deleteUser = async (req, res) => {
	try {
		const id = req.params?.id;
		const userDeletionResult = await userService.deleteUser(id);
		if (userDeletionResult.status) {
			return successResponse(res, userDeletionResult.data, {
				message: "User has been successfully deleted",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: userDeletionResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.searchUser = async (req, res) => {
	try {
		const { search } = req.query;
		const userSearchResult = await userService.searchUser({ search });
		return successResponse(res, userSearchResult.data, "Success");
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.checkUserModuleAccess = async (req, res) => {
	try {
		const { accessModule } = req.query;
		const id = req.params?.id;
		const userUserModuleAccessResult =
			await userService.checkUserModuleAccess({ accessModule, id });
		if (userUserModuleAccessResult.status) {
			return successResponse(res, userUserModuleAccessResult.data, {
				message: userUserModuleAccessResult.data.hasAccess
					? "User has access to the specified module"
					: "User does not have access to the specified module.",
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: userUserModuleAccessResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.bulkUpdateUsersWithSamePayload = async (req, res) => {
	try {
		const { userIds, userDetails } = req.body;
		const userUpdateResult =
			await userService.bulkUpdateUsersWithSamePayload({
				userIds,
				userDetails,
			});
		if (userUpdateResult.status) {
			return successResponse(res, userUpdateResult.data, {
				message: userUpdateResult.message,
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: userUpdateResult.message }
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};

module.exports.bulkUpdateUsersWithDifferentPayload = async (req, res) => {
	try {
		const { users } = req.body;
		const userUpdateResult =
			await userService.bulkUpdateUsersWithDifferentPayload({
				users,
			});
		if (userUpdateResult.status) {
			return successResponse(res, userUpdateResult.data, {
				message: userUpdateResult.message,
			});
		}
		return badRequestResponse(
			res,
			{},
			{ message: userUpdateResult.message }
		);
	} catch (error) {
		console.log("error::error::", error);
		return errorResponse(res, error);
	}
};
