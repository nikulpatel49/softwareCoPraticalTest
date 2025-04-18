const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const User = require("../../models/User");
const { getRole } = require("../role/role.service");

module.exports.registerNewUser = async (data) => {
	try {
		const { username, email, password, role, firstName, lastName } = data;
		const roleFetchResult = await getRole({
			queryOptions: { _id: role },
			select: { name: 1 },
		});
		if (roleFetchResult.status === false) {
			return { status: false, message: roleFetchResult.message };
		}
		const user = new User({
			username,
			email,
			password,
			role,
			roleName: roleFetchResult?.data?.name,
			firstName,
			lastName,
		});
		const result = await user.save();
		return {
			status: true,
			data: {
				username: result.username,
				email: result.email,
				role: result.role,
				firstName: result.firstName,
				lastName: result.lastName,
				active: result.active,
			},
		};
	} catch (error) {
		if (error.code === 11000) {
			const field = Object.keys(error.keyValue)?.[0];
			error.message = `${field} already exists.`;
		}
		return { status: false, message: error.message };
	}
};

module.exports.login = async (data) => {
	try {
		const { email, password } = data;
		const user = await User.findOne(
			{ email },
			"_id username role password"
		).populate("role", "_id name");
		if (!user) {
			return {
				status: false,
				statusCode: 401,
				message: "Invalid credentials",
			};
		}
		const isMatchPassword = await user.comparePassword(password);
		if (!isMatchPassword) {
			return {
				status: false,
				statusCode: 401,
				message: "Invalid credentials",
			};
		}
		const payload = {
			_id: user._id.toString(),
			username: user.username,
			role: user.role?.name,
		};
		const accessToken = this.signUserJWT(payload);
		return {
			status: true,
			data: { accessToken: accessToken.data },
		};
	} catch (error) {
		console.error(error);
		return { status: false, message: error.message };
	}
};

module.exports.signUserJWT = (data, expiresIn = keys.authJWTExpiredIn) => {
	try {
		const token = jwt.sign(data, keys.authSecretKey, {
			expiresIn: expiresIn,
		});
		return { status: true, data: token };
	} catch (error) {
		return { status: false, message: error?.message };
	}
};
