const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
	const {username, email, password} = req.body;
	if(!username || !email || !password){
		res.status(StatusCodes.BAD_REQUEST);
		throw new Error("All fields are mandatory")
	}
	const userAvailable = await User.findOne({email});
	if(userAvailable){
		res.status(StatusCodes.BAD_REQUEST);
		throw new Error("User with this email already exists")
	}

	//hash password
	const hashedPassword = await bcrypt.hash(password, 12);
	const user = await User.create({username, email, password: hashedPassword});
	if(user){
		res.status(StatusCodes.CREATED).json({_id: user.id, email: user.email})
	} else{
		res.status(StatusCodes.BAD_REQUEST);
		throw new Error("User data is not valid")
	}
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
	const {email, password} = req.body;
	if(!email || !password){
		res.status(StatusCodes.BAD_REQUEST);
		throw new Error("All fields are required")
	}
	const user = await User.findOne({email});
	if(!user){
		res.status(StatusCodes.NOT_FOUND);
		throw new Error("User not found")
	}
	//Compare password
	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if(isPasswordCorrect){
		const accessToekn = jwt.sign({user: {email:user.email, username: user.username, id:user._id}}, process.env.JWT_SECRET, {expiresIn: '3d'});
		res.status(StatusCodes.OK).json({accessToekn})
	} else{
		res.status(StatusCodes.UNAUTHORIZED);
		throw new Error("Invalid password")
	}
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
	res.status(StatusCodes.OK).json(req.user)
});

module.exports = {
	registerUser,
	loginUser,
	currentUser,
};
