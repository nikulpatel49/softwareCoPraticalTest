const { badRequestResponse } = require("../utils/apiResponse");

const validate = (schema) => async (req, res, next) => {
	try {
		await schema.validate(
			{
				headers: req.headers,
				body: { ...req.body, params: req?.params },
				query: req?.query,
				params: req?.params,
				file: req?.file,
			},
			{ abortEarly: true }
		);
		return next();
	} catch (err) {
		let errors = {};
		if (err?.params?.spec?.abortEarly) {
			errors = [
				{
					name: err.path?.split(".")?.[1],
					message: err.errors?.[0],
				},
			];
		} else {
			errors = err?.inner?.map((innerError) => ({
				name: innerError.path?.split(".")?.[1],
				message: innerError.errors?.[0],
			}));
		}
		return badRequestResponse(res, errors, {
			message: errors?.[0]?.message,
			statusCode: 400,
		});
	}
};

module.exports = {
	validate,
};
