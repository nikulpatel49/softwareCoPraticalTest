const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = mongoose.model("User");

// Create Schema
const RoleSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	accessModules: [{ type: String }],
	active: {
		type: Boolean,
		default: true,
	},
});

RoleSchema.set("timestamps", true);
RoleSchema.pre(
	["save", "findOneAndUpdate", "updateOne", "findByIdAndUpdate"],
	async function (next) {
		const fieldName = "name";
		if (this instanceof mongoose.Document) {
			if (this.isModified(fieldName)) {
				try {
					await User.updateMany(
						{ role: this["_id"] },
						{ roleName: this.get(fieldName) }
					);
				} catch (error) {
					console.error(error);
				}
			}
			return next();
		}
		const update = this.getUpdate();
		const newFieldName = update?.[fieldName] ?? update?.$set?.[fieldName];
		if (newFieldName === undefined) return next();
		const oldRole = await this.model
			.findOne(this.getQuery(), { [fieldName]: 1, _id: 1 })
			.lean();
		if (!oldRole || oldRole[fieldName] === newValue) return next();
		try {
			await User.updateMany(
				{ role: oldRole["_id"] },
				{ roleName: newFieldName }
			);
		} catch (error) {
			console.error(error);
		}
		await updateManyUserRoleName({
			roleName: newFieldName,
			oldRoleName: oldRole[fieldName],
			roleId: oldRole["_id"],
		});
		return next();
	}
);
module.exports = Role = mongoose.model("Role", RoleSchema);
