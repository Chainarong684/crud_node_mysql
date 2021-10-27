const express = require("express");
const route = express.Router();

const services = require("../services/render");
const controllers = require("../controllers/controller");

route.get("/", services.index);

// Get all books
route.get("/book", controllers.findAllBook);
// Find book by id
route.get("/book/:id", controllers.findBookById);
// Add book
route.post("/book/add", controllers.addBook);
// Update book
route.put("/book/:id", controllers.updateBook);
// Delete book
route.delete("/book/:id", controllers.deleteBook);

module.exports = route;
