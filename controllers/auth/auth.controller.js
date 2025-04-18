const {
	successResponse,
	errorResponse,
	badRequestResponse,
} = require("../../utils/apiResponse");
const authService = require("../../services/auth/auth.service");

module.exports.registerUser = async (req, res) => {
	try {
		const userCreationResult = await authService.registerNewUser(req.body);
		if (userCreationResult.status) {
			return successResponse(res, userCreationResult.data, {
				message: "User has been successfully register.",
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

module.exports.login = async (req, res) => {
	try {
		const userLoginResult = await authService.login(req.body);
		if (userLoginResult.status) {
			return successResponse(res, userLoginResult.data, {
				message: "User successfully login.",
			});
		}
		return badRequestResponse(
			res,
			{},
			{
				message: userLoginResult.message,
				statusCode: userLoginResult.statusCode,
			}
		);
	} catch (error) {
		return errorResponse(res, error);
	}
};
