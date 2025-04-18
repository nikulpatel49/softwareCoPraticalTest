const User = require("../../models/User");
const { getRole, getRoles } = require("../role/role.service");
const _ = require("lodash");
const { default: mongoose } = require("mongoose");

module.exports.addUser = async (data) => {
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

module.exports.updateUser = async (data) => {
	try {
		const user = await User.findOne({ _id: data.id }).select(
			"username active email role firstName lastName createdAt"
		);
		if (!user) {
			return { status: false, message: "User is not found." };
		}
		const roleFetchResult = await getRole({
			queryOptions: { _id: data.role },
			select: { name: 1 },
		});
		if (roleFetchResult.status === false) {
			return { status: false, message: roleFetchResult.message };
		}
		user.username = data.username;
		user.email = data.email;
		user.role = data.role;
		user.roleName = roleFetchResult?.data?.name;
		user.firstName = data.firstName;
		user.lastName = data.lastName;
		if (Object.hasOwn(data, "active")) {
			user.active = data?.active ? true : false;
		}
		await user.save();
		return {
			status: true,
			data: user,
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.getUsers = async () => {
	try {
		const users = await User.find(
			{},
			"username active email role firstName lastName createdAt"
		)
			.populate("role", "_id name")
			.sort({ createdAt: -1 })
			.lean();
		return {
			status: true,
			data: users,
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.deleteUser = async (id) => {
	try {
		const user = await User.findByIdAndDelete(id).select({
			_id: 1,
			username: 1,
		});
		if (user) {
			return { status: true, data: user };
		}
		return {
			status: false,
			message: "Invalid user id or user already deleted.",
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.searchUser = async ({ search }) => {
	try {
		let searchText = search.trim();
		let regex = new RegExp(searchText, "i");
		const queryOptions = {
			$or: [
				{ email: regex },
				{ username: regex },
				{ roleName: regex },
				{ firstName: regex },
				{ lastName: regex },
			],
		};
		const users = await User.find(
			queryOptions,
			"username active email role firstName lastName createdAt"
		)
			.populate("role", "_id name")
			.sort({ createdAt: -1 })
			.lean();
		return {
			status: true,
			data: users,
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

module.exports.checkUserModuleAccess = async ({ accessModule, id }) => {
	try {
		console.log("accessModule", accessModule);
		const user = await User.findOne({ _id: id }, "role _id")
			.populate("role", "_id accessModules")
			.lean();
		if (!user) {
			return { status: false, message: "Invalid user id." };
		}
		if (user?.role?._id) {
			const accessModules = new Set(user.role.accessModules);
			if (accessModules.has(accessModule)) {
				return {
					status: true,
					data: { hasAccess: true },
				};
			}
		}
		return {
			status: true,
			data: { hasAccess: false },
		};
	} catch (error) {
		console.log("error", error);
		return { status: false, message: error.message };
	}
};

module.exports.updateManyUserRoleName = async ({ roleName, roleId }) => {
	try {
		const userUpdateSummary = await User.updateMany(
			{ role: roleId },
			{ roleName: roleName }
		);
		return {
			status: true,
			data: userUpdateSummary,
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

exports.bulkUpdateUsersWithSamePayload = async (data) => {
	try {
		let userDetails = data.userDetails;
		const existingUsers = await User.find(
			{ _id: { $in: data.userIds } },
			"_id"
		);
		const existingIds = new Set(
			existingUsers.map((user) => {
				const id = user._id?.toString();
				return id;
			})
		);
		const incorrectIds = data.userIds.filter((id) => !existingIds.has(id));
		if (incorrectIds.length > 0) {
			return {
				status: false,
				errors: { incorrectUserIds: incorrectIds },
				message: "Some users not found.",
			};
		}

		if (userDetails?.role) {
			const roleFetchResult = await getRole({
				queryOptions: { _id: userDetails.role },
				select: { name: 1 },
			});
			if (roleFetchResult) {
				userDetails = {
					...userDetails,
					roleName: roleFetchResult?.data?.name,
				};
			}
		}
		const result = await User.updateMany(
			{ _id: { $in: data.userIds } },
			userDetails
		);
		return {
			status: true,
			data: {
				matchedCount: result.matchedCount,
				modifiedCount: result.modifiedCount,
			},
			message: "All users updated successfully.",
		};
	} catch (error) {
		return { status: false, message: error.message };
	}
};

exports.bulkUpdateUsersWithDifferentPayload = async ({ users }) => {
	const results = {
		success: [],
		failed: [],
	};
	const bulkOps = [];
	const roleFetchedResponse = await getRoles();
	if (_.isEmpty(roleFetchedResponse?.data)) {
		return { status: false, message: "invalid role" };
	}
	const rolesKeyValue = _.fromPairs(
		roleFetchedResponse.data.map((role) => [
			role._id?.toString(),
			role.name,
		])
	);
	for (const { userId, userDetails } of users) {
		const role = rolesKeyValue[userDetails.role];
		if (_.isEmpty(role)) {
			results.failed.push({
				userId: userId,
				reason: "Invalid role id",
			});
		} else {
			const details = { ...userDetails, roleName: role };
			bulkOps.push({
				updateOne: {
					filter: { _id: userId },
					update: { $set: details },
				},
			});
			results.success.push(userId);
		}
	}
	try {
		const bulkResult = await User.bulkWrite(bulkOps, { ordered: false });
		const actualMatched = bulkResult.matchedCount;
		const actualModified = bulkResult.modifiedCount;
		const failedCount = results.success.length - actualMatched;
		if (failedCount > 0) {
			const failedUserIds = results.success.slice(-failedCount);
			results.failed.push(
				...failedUserIds.map((id) => ({
					userId: id,
					reason: "Invalid user id.",
				}))
			);
			results.success = results.success.slice(0, actualMatched);
		}
		return {
			status: true,
			data: {
				updated: actualModified,
				totalMatched: actualMatched,
				successIds: results.success,
				failed: results.failed,
			},
			message: "batch updated result.",
		};
	} catch (error) {
		console.log("error::nks::", error);
		return { status: false, message: error.message };
	}
};
