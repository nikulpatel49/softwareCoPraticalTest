const sensitiveKeysList = [
	"password",
	"passwords",
	"oldPassword",
	"newPassword",
	"token",
	"secret",
];

const redactLogData = (data) => {
	if (
		typeof data === "object" &&
		data !== null &&
		!data.constructor?.name?.startsWith("model")
	) {
		if (Array.isArray(data)) {
			return data.map((item) => redactLogData(item));
		}
		const redactedData = {};
		for (const key in data) {
			if (sensitiveKeysList.includes(key)) {
				redactedData[key] = "*****";
			} else {
				redactedData[key] = redactLogData(data[key]);
			}
		}
		return redactedData;
	} else {
		return data;
	}
};

const getErrorLog = (req, res) => {
	try {
		if (res.statusCode >= 400) {
			return JSON.stringify({
				req: {
					body: redactLogData(req.body),
					params: req.params,
					query: req.query,
					method: req.method,
					url: req.url,
					user: req?.user?._id,
				},
				res: {
					statusCode: res.statusCode,
					statusMessage: res.statusMessage,
					data: res.errorData,
					user: res.user,
				},
			});
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};

const logFormat =
	":method :url :status :res[content-length] - :response-time ms :error :res[content]";

module.exports = {
	redactLogData,
	getErrorLog,
	logFormat,
};
