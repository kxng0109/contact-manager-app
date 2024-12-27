const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;
app.use(express.json())
app.use("/api/contacts", require("./routes/contactRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use(errorHandler);

app.listen(port, async() =>{
	await connectDB();
	console.log(`Server is running on port ${port}`);
})