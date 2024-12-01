import mongoose from "mongoose";

try {
  // unlike with mongodb driver, you can include database name directly here
  await mongoose.connect("mongodb://127.0.0.1/mongoose_test");
  mongoose.set("debug", true); // you can use this to see what are the queries done by mongoose.
} catch (err) {
  console.error(err);
  process.exit();
}

// Mongoose is everything about schema. Schema is where we define how our data is structured.
const userSchema = mongoose.Schema({
  // this is also fine but name will be optional
  //   name: String,

  // but we will use this as we can assign required
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // when you use unique, it will create index for this with unique
  age: { type: Number, min: 13 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// this will fail because it doesn't provide all required data
// await User.create({ name: "Binamra" });

// await User.create({ name: "Binamra", email: "binamralamsal@gmail.com" });
// console.log("user created successfully");

// const usersData = [
//   { name: "Alice", email: "alice@example.com", age: 25 },
//   { name: "Bob", email: "bob@example.com", age: 30 },
//   { name: "Charlie", email: "charlie@example.com", age: 35 },
// ];

// await User.insertMany(usersData);
// console.log("Users inserted successfully");

// this is also valid but you have to do .save() manually
// const newUser = new User({ name: "Binamra", email: "binamra12@gmail.com" });
// await newUser.save();
// console.log("user created successfully");

// const users = await User.find(); // no need to do toArray()
// console.log(users);

// const user = await User.findOne({ name: "Binamra" });
// console.log(user);

// const user = await User.findById("675013fb3bfb9415a88f52a9"); // no need to do new ObjectId();
// console.log(user);

// UPDATING
// const user = await User.findById("675013fb3bfb9415a88f52a9");
// user.age = 40;
// // you can add as many fields you want like this and update.
// await user.save();

// or you can just use traditional mongodb like:
// await User.updateOne({ email: "alice@example.com" }, { $set: { age: 26 } });

// it finds by id then updates it
// await User.findByIdAndUpdate("675013fb3bfb9415a88f52a9", {
//   $set: { name: "Person" },
// });

// deleting
// await User.deleteOne({ email: "bob@example.com" });

// User.findByIdAndDelete("675013fb3bfb9415a88f52a9");
