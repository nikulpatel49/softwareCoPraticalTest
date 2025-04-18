const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../config/swagger");

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.get("/json", (req, res) => {
	res.json(swaggerDocs);
});
module.exports = router;
