const passport = require("passport");
const _ = require("lodash");
const { unauthorizedResponse } = require("../utils/apiResponse");

module.exports = basicAuthenticate = (req, res, next) => {
	passport.authenticate("x-apikey-authentication", (err, token) => {
		if (!token)
			return unauthorizedResponse(
				res,
				{
					message: "Invalid Request paramaters:  x-api-key",
				},
				"Unauthorized"
			);
		if (err) return next(err);
		return next();
	})(req, res, next);
};
