const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { StatusCodes } = require("http-status-codes");


//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find({user_id: req.user.id});
	res.status(200).json(contacts);
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req, res) => {
	const {id} = req.params;
	const contact = await Contact.findById(id);
	if(!contact){
		console.log("err ti de!")
		res.status(StatusCodes.NOT_FOUND);
		throw new Error("Contact not found");
	}
	res.status(StatusCodes.OK).json(contact);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {
	const { name, email, phone } = req.body;
	const {id:user_id} = req.user;
	if (!name || !email || !phone) {
		res.status(400);
		throw new Error("Provide the necessary details");
	}
	const contact = await Contact.create({ name, email, phone, user_id});
	res.status(201).json(contact);
});

//@desc Update contact
//@route PATCH /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
	const {id} = req.params;
	const contact = await Contact.findById(id);
	if(!contact){
		res.status(StatusCodes.NOT_FOUND);
		throw new Error("Contact not found")
	};

	if(contact.user_id.toString() !== req.user.id){
		res.status(StatusCodes.FORBIDDEN);
		throw new Error("User doesn't have permission to update this contact")
	}

	const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
	res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
	const {id} = req.params;
	const contact = await Contact.findById(id);
	if(!contact){
		res.status(StatusCodes.NOT_FOUND);
		throw new Error("Contact not found")
	};
	
	if(contact.user_id.toString() !== req.user.id){
		res.status(StatusCodes.FORBIDDEN);
		throw new Error("User doesn't have permission to update this contact")
	}

	await Contact.findByIdAndDelete(id);
	res.status(200).json(contact);
});

module.exports = {
	getContacts,
	getContact,
	createContact,
	updateContact,
	deleteContact,
};
