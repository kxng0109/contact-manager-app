const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");


const validateToken = asyncHandler(async(req, res, next) =>{
	let token;
	let authHeader = req.headers.Authorization || req.headers.authorization;
	if(authHeader && authHeader.startsWith("Bearer ")){
		token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
			if(err){
				res.status(StatusCodes.UNAUTHORIZED);
				throw new Error("User is not authorized")
			}
			req.user = decoded.user;
			next();
		})
	}
	if(!token){
		res.status(401);
		throw new Error("User is not authorized or token is missing")
	}
});

module.exports = validateToken;