const successResponse = (res, data, { statusCode = 200, message }) => {
	return res.status(statusCode).json({
		statusCode: statusCode,
		data: data,
		msg: message ? message : "sucess",
	});
};

const errorResponse = (res, err, { statusCode = 500, message }) => {
	return res.status(statusCode).json({
		statusCode: statusCode,
		error: err,
		msg: message ? message : "Internal Server Error",
	});
};

const badRequestResponse = (res, err, { statusCode = 400, message }) => {
	return res.status(statusCode).json({
		statusCode: statusCode,
		error: err,
		msg: message ? message : "Invalid Request",
	});
};

const unauthorizedResponse = (res, err, msg = "Unauthorized") => {
	return res.status(401).json({
		statusCode: 401,
		error: err,
		msg: err?.msg ? err.msg : msg,
	});
};

const notFoundResponse = (res, err, msg = "Not found") => {
	return res.status(404).json({
		statusCode: 404,
		error: err,
		msg: err?.msg ? err.msg : msg,
	});
};

const duplicationResponse = (res, err, msg = "Conflict") => {
	return res.status(409).json({
		code: 409,
		error: err,
		msg: err?.msg ? err.msg : msg,
	});
};

module.exports = {
	successResponse,
	errorResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
	duplicationResponse,
};
