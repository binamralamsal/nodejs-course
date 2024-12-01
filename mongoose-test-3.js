import mongoose from "mongoose";

try {
  await mongoose.connect("mongodb://127.0.0.1/mongoose_test");
  mongoose.set("debug", true);
} catch (err) {
  console.error(err);
  process.exit();
}

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 13 },
  },
  { timestamps: true } // this will automatically add createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);

const newUser = new User({
  name: "Rohan",
  email: "rohan@example.com",
  age: 25,
});

await newUser.save();
