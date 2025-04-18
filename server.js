require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { mongoURI, morganLogFormat } = require("./config/keys");
const routes = require("./routes");
const passport = require("passport");
const configPassport = require("./config/passport");
const morgan = require("morgan");
const { logger, stream } = require("./utils/logger");
const { getErrorLog, logFormat } = require("./utils/apiLogger");

// Connect to mongoDB
mongoose
	.connect(mongoURI)
	.then(async () => {
		logger.info("MongoDB connected");
	})
	.catch((err) => {
		logger.error(`Could not connect to the MongoDB. ERR:`, err);
		process.exit(0);
	});

const app = express();
app.use(morgan(morganLogFormat, { stream }));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded());

// Passport middleware
app.use(passport.initialize());
configPassport(passport);

// override res send to add res.errorData
morgan.token("error", getErrorLog);
app.use(morgan(logFormat, { stream }));

app.use("/", routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	logger.info(`Server running on port ${port}`);
});

// any server error handler
app.use(function (error, req, res, next) {
	try {
		const status = error.status || error.httpCode || 500;
		const message = error.message || "Something went wrong";
		logger.error(
			`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
		);
		res.status(status).json({ message });
	} catch (error) {
		next(error);
	}
});
