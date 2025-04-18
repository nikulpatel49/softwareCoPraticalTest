const Yup = require("../../config/yup");
const Role = require("../../models/Role");
const User = require("../../models/User");

Yup.addMethod(Yup.string, "duplicateEmail", function (arg) {
	return this.test(async (value, context) => {
		try {
			const queryOptions = { email: value };
			const userId = context?.parent?.params?.id;
			if (arg?.operation === "edit" && userId) {
				queryOptions["_id"] = { $ne: userId };
			}
			const isExists = await User.exists(queryOptions);
			if (isExists) {
				return context.createError({
					message: arg?.message
						? arg.message
						: "Email already exists.",
				});
			}
			return true;
		} catch (e) {
			return context.createError({
				message: arg?.message ? arg.message : "Email already exists.",
			});
		}
	});
});

Yup.addMethod(Yup.string, "duplicateUsername", function (arg) {
	return this.test(async (value, context) => {
		try {
			const queryOptions = { username: value };
			const userId = context?.parent?.params?.id;
			if (arg?.operation === "edit" && userId) {
				queryOptions["_id"] = { $ne: userId };
			}
			const isExists = await User.exists(queryOptions);
			if (isExists) {
				return context.createError({
					message: arg?.message
						? arg.message
						: "Username already exists.",
				});
			}
			return true;
		} catch (e) {
			return context.createError({
				message: arg?.message
					? arg.message
					: "Username already exists.",
			});
		}
	});
});

Yup.addMethod(Yup.string, "checkIfRoleExists", function (arg) {
	return this.test(async (value, context) => {
		try {
			const queryOptions = { _id: value, active: true };
			const isExists = await Role.exists(queryOptions);
			if (isExists) {
				return true;
			}
			return context.createError({
				message: arg?.message
					? arg.message
					: "role is either invalid or currently inactive.",
			});
		} catch (e) {
			return context.createError({
				message: arg?.message
					? arg.message
					: "role is either invalid or currently inactive.",
			});
		}
	});
});

module.exports.validateLoginSchema = Yup.object({
	body: Yup.object().shape({
		password: Yup.string().required("Password is required."),
		email: Yup.string().email().required("email is required"),
	}),
});

module.exports.validateSignUpSchema = Yup.object({
	body: Yup.object().shape({
		firstName: Yup.string().required("firstName is required"),
		lastName: Yup.string().required("lastName is required"),
		email: Yup.string()
			.email()
			.duplicateEmail()
			.required("email is required"),
		username: Yup.string()
			.matches(
				/^[A-Za-z0-9_-]+$/,
				"Username can only contain letters, numbers, underscores, and dashes"
			)
			.duplicateUsername()
			.required("username is required"),
		role: Yup.string()
			.isMongooseId({ message: "Invalid role Id." })
			.checkIfRoleExists()
			.required("role is required"),
		password: Yup.string().required("Password is required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
	}),
});
