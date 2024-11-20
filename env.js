/*
// If port is undefined or not a number then it will use 3000 else it will convert it into number and use it.
const PORT = isNaN(process.env.PORT) ? 3000 : parseInt(process.env.PORT);
// Let's imagine you have SECRET which you must need for project.
const SECRET = process.env.SECRET;

if (!SECRET) throw new Error("SECRET environment variable is required");

export const env = { PORT, SECRET };
*/

import { z } from "zod";

// Zod has different types in its documentation that we can use to validate, like

// zod has different validations for number like int() for positive
// max() min()
// const ageSchema = z.number().int().max(130).min(13);
// const userAge = 14;
// the schema has different methods like parse, safeParse, parse will throw error if problems
// safeParse will return data and error object differently;
// why is it called parse instead of validate? Because, zod can also parse based on rules that you defined.
// You can transform data as you want if you defined in schema., it will return parsed data based on that.
// also types of parsedUserAge will be based on the rules you defined, it is useful while using typescript
// const parsedUserAge = ageSchema.parse(userAge);
// const {data, error, success} = ageSchema.safeParse(userAge);
// console.log(parsedUserAge);

/*


const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  // you can also assign something as optional, by default all are required.
  role: z.enum(["user", "admin"]).optional().default("user"),
});

const user = {
  username: "     Thapa Technical     ",
  email: "thapa@gmail.com",
  //   role: "asdf",
  // role: "admin"
};

const parsedUser = userSchema.parse(user);
console.log(parsedUser);

*/

export const env = z
  .object({
    PORT: z.coerce.number().default(3000),
    SECRET: z.string().min(1, "SECRET is required"),
  })
  .parse(process.env);
