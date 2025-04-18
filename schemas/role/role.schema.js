const Yup = require("../../config/yup");
const Role = require("../../models/Role");
const { isDuplicates } = require("../../utils/common.util");

Yup.addMethod(Yup.string, "duplicateRoleName", function (arg) {
	return this.test(async (value, context) => {
		try {
			const queryOptions = { name: value };
			const roleId = context?.parent?.params?.id;
			if (arg?.operation === "edit" && roleId) {
				queryOptions["_id"] = { $ne: roleId };
			}
			const isExists = await Role.exists(queryOptions);
			if (isExists) {
				return context.createError({
					message: arg?.message
						? arg.message
						: "Name already exists.",
				});
			}
			return true;
		} catch (e) {
			return context.createError({
				message: arg?.message ? arg.message : "Name already exists.",
			});
		}
	});
});

Yup.addMethod(Yup.string, "duplicateRoleAccessModule", function (arg) {
	return this.test(async (value, context) => {
		try {
			const roleId = context?.parent?.params?.id;
			if (roleId) {
				const queryOptions = { accessModules: value, _id: roleId };
				const isExists = await Role.exists(queryOptions);
				if (isExists) {
					return context.createError({
						message: arg?.message
							? arg.message
							: "Access module already exists.",
					});
				}
				return true;
			} else {
				return context.createError({
					message: arg?.message
						? arg.message
						: "Access module already exists.",
				});
			}
		} catch (e) {
			return context.createError({
				message: arg?.message
					? arg.message
					: "Access module already exists.",
			});
		}
	});
});

Yup.addMethod(Yup.string, "checkIfAccessModuleExists", function (arg) {
	return this.test(async (value, context) => {
		try {
			const roleId = context?.parent?.params?.id;
			if (roleId) {
				const queryOptions = { accessModules: value, _id: roleId };
				const isExists = await Role.exists(queryOptions);
				if (isExists) {
					return true;
				}
				return context.createError({
					message: arg?.message
						? arg.message
						: "Access module does not exists.",
				});
			} else {
				return context.createError({
					message: arg?.message
						? arg.message
						: "Access module does not exists.",
				});
			}
		} catch (e) {
			return context.createError({
				message: arg?.message
					? arg.message
					: "Access module does not exists.",
			});
		}
	});
});

module.exports.createRoleSchema = Yup.object({
	body: Yup.object({
		name: Yup.string().duplicateRoleName().required("name is required"),
		accessModules: Yup.array("accessModules must be a `array` type.")
			.of(Yup.string())
			.typeError("Access modules must be an array")
			.required("accessModules are required")
			.test(
				"checkAccessModuleDuplication",
				"accessModules contains duplicate entries.",
				function (value) {
					return !isDuplicates(value);
				}
			),
	}),
});

module.exports.updateRoleSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.required("Id is required")
			.isMongooseId({ message: "Invalid role Id" }),
	}),
	body: Yup.object({
		name: Yup.string()
			.duplicateRoleName({ operation: "edit" })
			.required("name is required"),
		accessModules: Yup.array()
			.of(Yup.string())
			.required("accessModules are required")
			.test(
				"checkAccessModuleDuplication",
				"accessModules contains duplicate entries.",
				function (value) {
					return !isDuplicates(value);
				}
			),
	}),
});

module.exports.addNewRoleAccessModuleSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.strict()
			.typeError("Access module must be an string")
			.required("Id is required")
			.isMongooseId({ message: "Invalid role Id" }),
	}),
	body: Yup.object({
		accessModule: Yup.string()
			.strict()
			.duplicateRoleAccessModule({ id: Yup.ref("params.id") })
			.required("accessModule is required"),
	}),
});

module.exports.removeRoleAccessModuleSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.strict()
			.required("Id is required")
			.isMongooseId({ message: "Invalid role Id" }),
	}),
	body: Yup.object({
		accessModule: Yup.string()
			.strict()
			.checkIfAccessModuleExists({ id: Yup.ref("params.id") })
			.required("accessModule is required"),
	}),
});

module.exports.removeRoleSchema = Yup.object({
	params: Yup.object({
		id: Yup.string()
			.required("Id is required")
			.isMongooseId({ message: "Invalid role Id" }),
	}),
});
