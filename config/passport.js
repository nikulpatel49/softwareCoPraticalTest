const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const headerStrategy = require("passport-http-header-strategy").Strategy;
const keys = require("../config/keys");

const User = require("../models/User");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.authSecretKey;

module.exports = (passport) => {
	passport.use(
		"user-jwt-auth",
		new JwtStrategy(opts, async (jwtPayload, done) => {
			try {
				if (jwtPayload?._id) {
					const user = await User.findOne({
						_id: jwtPayload?._id,
					}).lean();
					if (user) {
						return done(null, {
							user: user,
						});
					} else {
						return done(null, false);
					}
				}
				return done(null, false);
			} catch (error) {
				return done(null, false);
			}
		})
	);
	passport.use(
		"x-apikey-authentication",
		new headerStrategy(
			{ header: "X-API-KEY", passReqToCallback: true },
			function (req, token, done) {
				if (keys.xApiKey === token) {
					return done(null, true);
				}
				return done(null, false);
			}
		)
	);
};
