const {StatusCodes} = require("http-status-codes")

const errorHandler = (err, req, res, next) => {
	let statusCode = res.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	if(err.message.startsWith = "Cast to ObjectId") {
		statusCode = StatusCodes.INTERNAL_SERVER_ERROR
	}
	switch (statusCode) {
		case StatusCodes.BAD_REQUEST:
			res.json({
				title: "Validation Error",
				message: err.message,
				stackTrace: err.stack,
			});
			break;
		case StatusCodes.NOT_FOUND:
			res.json({
				title: "Not found",
				message: err.message,
				stackTrace: err.stack,
			});
			break;
		case StatusCodes.UNAUTHORIZED:
			res.json({
				title: "Unauthorized",
				message: err.message,
				stackTrace: err.stack,
			});
			break;
		case StatusCodes.FORBIDDEN:
			res.json({
				title: "Forbidden",
				message: err.message,
				stackTrace: err.stack,
			});
			break;
		case StatusCodes.INTERNAL_SERVER_ERROR:
			res.json({
				title: "Server Error",
				message: err.message,
				stackTrace: err.stack,
			});
			break;
		default:
			console.log("No error, all good!")
			break;
	}
};

module.exports = errorHandler;
