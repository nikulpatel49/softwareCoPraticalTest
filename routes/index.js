const authenticateUser = require("../middlewares/authenticateUser.middleware");
const basicAuthenticateMiddleware = require("../middlewares/basicAuthenticate.middleware");

const router = require("express").Router();

router.use("/auth", require("./authentication"));
router.use("/role", basicAuthenticateMiddleware, require("./role"));
router.use("/user", authenticateUser, require("./user"));
// router.use("/user", require("./user"));

if (process.env.NODE_ENV === "local") {
	router.use("/api-docs", require("./swagger"));
}
router.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to the API!" });
});
module.exports = router;
