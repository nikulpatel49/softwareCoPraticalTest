const passport = require("passport");
const _ = require("lodash");
const { unauthorizedResponse } = require("../utils/apiResponse");
const authenticateUser = (req, res, next) => {
	passport.authenticate("user-jwt-auth", (err, data) => {
		if (err) return next(err);
		if (_.isEmpty(data?.user))
			return unauthorizedResponse(res, {}, "Unauthorized user");
		req.user = data.user;
		return next();
	})(req, res, next);
};

module.exports = authenticateUser;
