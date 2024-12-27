const express = require("express");
const router = express.Router();
const {
	getContacts,
	getContact,
	createContact,
	updateContact,
	deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

router.route("/:id").get(getContact).patch(updateContact).delete(deleteContact);
router.route("/").get(getContacts).post(createContact);

module.exports = router;
