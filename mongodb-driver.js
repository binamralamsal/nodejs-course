import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1");

await client.connect();
const db = client.db("mongodb_test");

const usersCollection = db.collection("users");

// you can either use insertOne or insertMany, insertMany requires array of objects for multiple items
// insertOne is for one item.
// MongoDB automatically adds _id to the field
// await usersCollection.insertOne({
//   name: "Binamra Lamsal",
//   role: "user",
// });
// you can see that mongodb is schemaless, you can insert item of any schema
// await usersCollection.insertMany([
//   { name: "Rohan", role: "user", age: 23 },
//   { name: "Ram", profession: "Student" },
// ]);

// .find() method returns cursor instead of javascript objects, which you can access using 'for await' syntax
// const usersCursor = usersCollection.find();
// for await (const user of usersCursor) {
//   console.log(user);
// }

// if you want all users as an array, you can use .toArray()
// const users = await usersCollection.find().toArray();
// console.log(users);

// to find one. As this is single item, it's obviously not in cursor format
// const user = await usersCollection.findOne({ name: "Ram" });
// console.log(user);
// console.log(user._id.toHexString()); // this is special type used for unique value. it is part of mongodb driver. You can convert it to string using .toString() or .toHexString()

// updateOne requires filter as first argument. Filter is document that you use for .find() but here, it will update
// the first document it finds based on that filter.
// second argument is an object where you can assign what to update. $set is special for mongodb, you can assign the field
// that you want to update. Note that it will only change that field but won't change whole documents.
// await usersCollection.updateOne(
//   { name: "Ram" },
//   { $set: { profession: "CEO" } }
// );

// this won't work as id is in ObjectID format in mongodb
// await usersCollection.deleteOne({ _id: "675004782ca69ec71966eb7b" });
// but this will work as we converted it to ObjectId.
// await usersCollection.deleteOne({
//   _id: new ObjectId("675004782ca69ec71966eb7b"),
// });

await client.close();
