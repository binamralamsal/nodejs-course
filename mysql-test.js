import mysql from "mysql2";

const connection = mysql
  .createConnection({
    host: "localhost", // MySQL server host (use '127.0.0.1' or 'localhost')
    user: "root", // MySQL user (typically 'root' for local dev)
    password: "1234", // MySQL root password
    database: "mysql_test", // Name of the database to connect to
    // You can comment out database property to create database, then uncomment it to create table
  })
  .promise();

try {
  await connection.connect();
  console.log("MySQL Connected Successfully");
} catch (err) {
  console.error(err);
}

// .execute is for running queries
// await connection.execute("CREATE DATABASE mysql_test");

// await connection.execute(`
//     CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,  -- Automatically increments with each new row
//     name VARCHAR(100) NOT NULL,         -- Stores the user's name, cannot be null
//     email VARCHAR(100) NOT NULL UNIQUE  -- Stores the user's email, must be unique
// );
// `);

// try {
//   const user = {
//     name: "Binamra Lamsal",
//     email: "binamra@website.com",
//   };

// you want to know about question marks? that's because if we insert directly, it will be vulnerable to sql injection
// mysql will sanitize if you pass as parameterized queries
//   const [rows] = await connection.execute(
//     "INSERT INTO users (name, email) VALUES (?, ?)",
//     [user.name, user.email]
//   );
//   console.log("User inserted successfully:", rows);
// } catch (err) {
//   console.error("Error inserting user:", err);
// }

// try {
//   const [rows] = await connection.execute("SELECT * FROM users");
//   console.log("All Users:", rows);
// } catch (error) {
//   console.error("Error fetching users:", error);
// }

// get one user
const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [
  1,
]);
console.log(rows, "user");
