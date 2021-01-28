import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jaysonPromise from "jayson/promise/index.js";
import mongodb from "mongodb";
import { createTodosController } from "./todosController.js";

dotenv.config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

const main = async () => {
  // set up db connection
  const client = mongodb.MongoClient(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log("Connected to database");
  const todos = client.db("todolist").collection("todos");

  // set up web server
  const app = express();
  app.use(cors());
  app.use(express.json());
  const todosController = createTodosController(todos);
  app.use(jaysonPromise.server(todosController).middleware());
  console.log("Starting http server");
  app.listen(PORT);
};
main();
