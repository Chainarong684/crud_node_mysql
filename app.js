const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is starting at http://localhost:${PORT}`);
});

/* -------------------------------- Database -------------------------------- */
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log(`Error Database connection ${err}`);
  } else {
    console.log(`Successfuly database connected`);
  }
});

/* --------------------------------- Route --------------------------------- */
app.get("/", (req, res) => {
  res.send("OK");
});
// Get all books
app.get("/book", (req, res) => {
  try {
    db.query("SELECT * FROM books", (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "bad",
          messege: err.sqlMessage,
        });
      }
      let messege = "";
      if (data.length === 0) {
        messege = "Empty book data";
      } else {
        messege = "Successfuly to get all books";
      }

      return res.status(200).send({
        status: "good",
        messege,
        data,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
// Find book by id
app.get("/book/:id", (req, res) => {
  const id = req.params.id;
  try {
    db.query("SELECT * FROM books WHERE id = ?", id, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "bad",
          err,
        });
      }
      let messege = "";
      if (data.length === 0) {
        messege = "Book has not found";
      } else {
        messege = `Successfuly find book id ${id}`;
      }

      return res.status(200).send({
        status: "good",
        messege,
        data,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
// Add book
app.post("/book/add", (req, res) => {
  const { name, author } = req.body;
  try {
    if (!name || !author) {
      return res.status(400).send({
        status: "bad",
        messege: "Please fill Name and Author",
      });
    } else {
      db.query("INSERT INTO books (name, author) VALUES (?, ?)", [name, author], (err, data) => {
        let messege = "";
        if (err) {
          messege = err;
        } else {
          messege = "Successfuly to add a new book";
        }

        return res.status(200).send({
          status: "good",
          messege,
          data,
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// Update book
app.put("/book/:id", (req, res) => {
  const { id } = req.params;
  const { name, author } = req.body;
  let query = "";
  let values = [];
  let message = "";
  try {
    if (!name && !author) {
      return res.status(400).send({
        status: "bad",
        messege: "Please input data you want to update",
      });
    } else if (!name) {
      query = "UPDATE books SET author = ? WHERE id = ?";
      values = [author, id];
    } else if (!author) {
      query = "UPDATE books SET name = ? WHERE id = ?";
      values = [name, id];
    } else {
      query = "UPDATE books SET name = ?, author = ? WHERE id = ?";
      values = [name, author, id];
    }

    db.query(query, values, (err, data) => {
      if (err) {
        message = err;
      } else if (data.affectedRows === 0) {
        message = `Fail to update book id ${id} maybe book has not found`;
      } else {
        message = `Successfuly to update book id ${id}`;
      }

      return res.status(200).send({
        status: "good",
        message,
        data,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
// Delete book
