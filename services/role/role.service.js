const Role = require("../../models/Role");
const User = require("../../models/User");

module.exports.getRole = async ({ queryOptions, select }) => {
	try {
		const role = await Role.findOne(queryOptions, select).lean();
		if (role) {
			return {
				status: true,
				data: role,
			};
		}
		return {
			status: false,
			message: "Invalid role id",
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};
module.exports.addRole = async (data) => {
	try {
		const role = new Role({
			name: data.name,
			accessModules: data.accessModules,
		});
		const result = await role.save();
		return {
			status: true,
			data: {
				name: result.name,
				accessModules: result.accessModules,
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

module.exports.updateRole = async (data) => {
	try {
		const role = await Role.findOne({ _id: data.id }).select(
			"name accessModules active"
		);
		if (!role) {
			return { status: false, message: "Role is not found." };
		}
		role.name = data?.name ? data.name : role.name;
		role.accessModules = data.accessModules;
		if (Object.hasOwn(data, "active")) {
			role.active = data?.active ? true : false;
		}
		await role.save();
		return {
			status: true,
			data: {
				name: role.name,
				accessModules: role.accessModules,
				active: role.active,
			},
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.getRoles = async () => {
	try {
		const roles = await Role.find(
			{},
			"_id name active accessModules createdAt"
		)
			.sort({ createdAt: -1 })
			.lean();
		return {
			status: true,
			data: roles,
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.deleteRole = async (id) => {
	try {
		const role = await Role.findById(id).select({
			_id: 1,
			name: 1,
		});
		if (role) {
			const userExists = User.exists({ role: role._id });
			if (userExists) {
				return {
					status: false,
					message:
						"Cannot delete the role because there are active users still assigned to it.",
				};
			}
			await role.deleteOne();
			return { status: true, data: role };
		}
		return { status: false, message: "Role is not found." };
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.addNewRoleAccessModule = async (data) => {
	try {
		const role = await Role.findByIdAndUpdate(
			data.id,
			{ $addToSet: { accessModules: data.accessModule } },
			{ new: true, select: "accessModules" }
		);
		if (!role) {
			return { status: false, message: "Role is not found." };
		}
		return {
			status: true,
			data: {
				accessModules: role.accessModules,
			},
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.removeRoleAccessModule = async (data) => {
	try {
		const role = await Role.findByIdAndUpdate(
			data.id,
			{ $pull: { accessModules: data.accessModule } },
			{ new: true, select: "accessModules" }
		);
		if (!role) {
			return { status: false, message: "Role is not found." };
		}
		return {
			status: true,
			data: {
				accessModules: role.accessModules,
			},
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};
