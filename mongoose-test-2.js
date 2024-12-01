import mongoose from "mongoose";

try {
  await mongoose.connect("mongodb://127.0.0.1/mongoose_test");
  mongoose.set("debug", true);
} catch (err) {
  console.error(err);
  process.exit();
}

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 13 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose allows you to define middleware (also called hooks) that run before or after certain operations like save, find, or update.
// Here pre means before, hence it is done before saving
userSchema.pre("save", function (next) {
  if (this.isModified()) {
    // Check if the document is modified
    this.updatedAt = Date.now(); // Set the updatedAt field to the current timestamp
  }
  // if you don't call this then it will cause isssues
  next(); // Proceed with saving the document
});

const User = mongoose.model("User", userSchema);

// const newUser = new User({
//   name: "Rahul",
//   email: "rahul@example.com",
//   age: 25,
// });

// await newUser.save();

// pre hook will be called automatically
// await User.updateOne({ email: "rahul@example.com" }, { $set: { age: 44 } });
