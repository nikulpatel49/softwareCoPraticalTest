const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Yup = require("yup");
const { hashPassword, comparePassword } = require("../utils/common.util");

const Schema = mongoose.Schema;
const yupEmailSchema = Yup.string().email();
const yupUsernameSchema = Yup.string().matches(/^[A-Za-z0-9_-]+$/);

const UserSchema = new Schema({
	username: {
		type: String,
		index: true,
		required: true,
		unique: true,
		validate: {
			validator: (v) => yupUsernameSchema.isValidSync(v),
			message:
				"Username can only contain letters, numbers, underscores, and dashes",
		},
	},
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		trim: true,
		index: true,
		required: true,
		unique: true,
		validate: {
			validator: (v) => yupEmailSchema.isValidSync(v),
			message: "Please enter a valid email",
		},
	},
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Role",
		required: true,
		index: true,
	},
	roleName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	active: {
		type: Boolean,
		default: true,
	},
});

// runs before executing a save
UserSchema.pre("save", async function (next) {
	try {
		if (!this.isModified("password")) return next();
		this.password = await hashPassword(this.password);
		next();
	} catch (err) {
		next(err);
	}
});

// runs before executing a findOneAndUpdate
UserSchema.pre("findOneAndUpdate", async function (next) {
	try {
		const update = this.getUpdate();
		if (update?.password) {
			update.password = await hashPassword(update.password);
			this.setUpdate(update);
		}
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.methods.comparePassword = async function (password) {
	return await comparePassword(password, this.password);
};

UserSchema.set("timestamps", true);
UserSchema.plugin(mongoosePaginate);
module.exports = User = mongoose.model("User", UserSchema);
