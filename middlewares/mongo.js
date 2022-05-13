// Export mongoose
const  mongoose = require("mongoose");

require('dotenv-flow').config();

//Assign MongoDB connection string to Uri and declare options settings
// var  uri = `mongodb+srv://subeditor:${process.env.MONGO_PASSWORD}@subeditor.8v8yz.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
var  uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017/?authSource=${process.env.MONGO_DATABASE}&readPreference=primary&appname=MongoDB%20Compass&ssl=false`

const db = require("../models");
const User = db.user;

db.mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
	User.estimatedDocumentCount((err, count) => {
	  if (!err && count === 0) {
		new User({
		  email: "hello@adriantwarog.com",
		  password: "PASSWORDGOESHERE",
		  accountType: "admin",
		  fname: "Adrian",
		  lname: "Twarog",
		  accountType: "admin",
		  plan: "Ultimate",
		  status: "active",
		  credits: 10000,
		}).save(err => {
		  if (err) {
			console.log("error", err);
		  }
		  console.log("admin user added");
		});

		new User({
			email: "support@openai.com",
			password: "PASSWORDGOESHERE", // 
			accountType: "user",
			fname: "OpenAI",
			lname: "Support",
			plan: "Ultimate",
			status: "active",
			credits: 1000,
		  }).save(err => {
			if (err) {
			  console.log("error", err);
			}
			console.log("admin user added");
		  });

	  }
	});
}