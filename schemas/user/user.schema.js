const Yup = require("../../config/yup");
const Role = require("../../models/Role");
const User = require("../../models/User");
const _ = require("lodash");

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
			if (_.isNil(value) || _.isEmpty(value)) return true;
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

module.exports.createUserSchema = Yup.object({
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
	}),
});

module.exports.updateUserSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.required("Id is required")
			.isMongooseId({ message: "Invalid user Id" }),
	}),
	body: Yup.object().shape({
		firstName: Yup.string().required("firstName is required"),
		lastName: Yup.string().required("lastName is required"),
		email: Yup.string()
			.email()
			.duplicateEmail({ operation: "edit" })
			.required("email is required"),
		username: Yup.string()
			.matches(
				/^[A-Za-z0-9_-]+$/,
				"Username can only contain letters, numbers, underscores, and dashes"
			)
			.duplicateUsername({ operation: "edit" })
			.required("username is required"),
		role: Yup.string()
			.isMongooseId({ message: "Invalid role Id." })
			.checkIfRoleExists()
			.required("role is required"),
		active: Yup.boolean().strict().required("This field is required"),
	}),
});

module.exports.removeUserSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.required("Id is required")
			.isMongooseId({ message: "Invalid user Id" }),
	}),
});

module.exports.searchUserSchema = Yup.object({
	query: Yup.object({
		search: Yup.string().required("search is required"),
	}),
});

module.exports.checkAccessModuleUserSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.required("Id is required")
			.isMongooseId({ message: "Invalid user Id" }),
	}),
	query: Yup.object({
		accessModule: Yup.string().required("module name is required"),
	}),
});

module.exports.bulkUpdateUsersWithSamePayloadSchema = Yup.object({
	body: Yup.object({
		userIds: Yup.array()
			.of(
				Yup.string()
					.required("Invalid user Ids")
					.isMongooseId({ message: "Invalid user Id" })
			)
			.required("Invalid user Ids"),
		userDetails: Yup.object()
			.shape({
				role: Yup.string()
					.min(1, "role cannot be empty")
					.isMongooseIdOptional({ message: "Invalid role Id." })
					.checkIfRoleExists()
					.optional(),
				firstName: Yup.string()
					.trim()
					.min(1, "First name cannot be empty")
					.optional(),
				lastName: Yup.string()
					.trim()
					.min(1, "Last name cannot be empty")
					.optional(),
				active: Yup.boolean().optional(),
			})
			.test(
				"requiredAtleastOneField",
				"At least one field must be provided",
				(userDetails) =>
					!!userDetails &&
					Object.keys(userDetails).some(
						(key) => userDetails[key] !== undefined
					)
			),
	}),
});

module.exports.bulkUpdateUsersWithDifferentPayloadSchema = Yup.object({
	body: Yup.object({
		users: Yup.array().of(
			Yup.object().shape({
				userId: Yup.string()
					.required("Invalid user Ids")
					.isMongooseId({ message: "Invalid user Id" }),
				userDetails: Yup.object()
					.shape({
						role: Yup.string()
							.min(1, "role cannot be empty")
							.isMongooseIdOptional({
								message: "Invalid role Id.",
							})
							.optional(),
						firstName: Yup.string()
							.trim()
							.min(1, "First name cannot be empty")
							.optional(),
						lastName: Yup.string()
							.trim()
							.min(1, "Last name cannot be empty")
							.optional(),
						active: Yup.boolean().optional(),
					})
					.test(
						"requiredAtleastOneField",
						"At least one field must be provided",
						(userDetails) =>
							!!userDetails &&
							Object.keys(userDetails).some(
								(key) => userDetails[key] !== undefined
							)
					),
			})
		),
	}),
});
