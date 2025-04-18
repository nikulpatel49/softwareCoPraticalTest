const bcrypt = require("bcrypt");
const { saltRoundForPassword } = require("../config/keys");

module.exports.hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(saltRoundForPassword);
	return await bcrypt.hash(password, salt);
};

module.exports.comparePassword = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword);
};
module.exports.isDuplicates = (items) => {
	const checkedItem = new Set();
	for (const item of items) {
		if (checkedItem.has(item)) {
			return true;
		}
		checkedItem.add(item);
	}
	return false;
};
