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
          message: err.sqlMessage,
        });
      }
      let { message, status } = "";
      if (data.length === 0) {
        status = "try";
        message = "Empty book data";
      } else {
        status = "good";
        message = "Successfuly to get all books";
      }

      return res.status(200).send({
        status,
        message,
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
      let { message, status } = "";
      if (data.length === 0) {
        status = "try";
        message = "Book has not found";
      } else {
        status = "good";
        message = `Successfuly find book id ${id}`;
      }

      return res.status(200).send({
        status,
        message,
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
        message: "Please fill Name and Author",
      });
    } else {
      db.query("INSERT INTO books (name, author) VALUES (?, ?)", [name, author], (err, data) => {
        let { message, status } = "";
        if (err) {
          status = "try";
          message = err;
        } else {
          status = "good";
          message = "Successfuly to add a new book";
        }

        return res.status(200).send({
          status,
          message,
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
  let { message, status } = "";
  try {
    if (!name && !author) {
      return res.status(400).send({
        status: "bad",
        message: "Please input data you want to update",
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
        status = "try";
        message = `Fail to update book id ${id} maybe book has not found`;
      } else {
        status = "good";
        message = `Successfuly to update book id ${id}`;
      }

      return res.status(200).send({
        status,
        message,
        data,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
// Delete book
app.delete("/book/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.query("DELETE FROM books WHERE id = ?", id, (err, data) => {
      let { message, status } = "";
      if (err) {
        return res.status(500).send({
          status: "bad",
          message: err,
        });
      }
      if (data.affectedRows === 0) {
        status = "try";
        message = `Fail to delete book id ${id} maybe book has not found`;
      } else {
        status = "good";
        message = `Successfuly delete book id ${id}`;
      }

      return res.status(200).send({
        status,
        message,
        data,
      });
    });
  } catch (error) {
    console.log(error);
  }
});

// app.delete("/book", (req, res) => {
//   let id = req.body.id;

//   if (!id) {
//     return res.status(400).send({
//       status: "bad",
//       message: "Please insert book id to delete",
//     });
//   } else {
//     dbCon.query("DELETE FROM books WHERE id = ?", id, (error, result) => {
//       if (error) throw error;

//       let message = "";
//       if (result.affectedRows === 0) {
//         message = `Book id ${id} not found please try agian`;
//       } else {
//         message = "Successfully deleted";
//       }

//       return res.send({
//         status: "good",
//         message,
//         result,
//       });
//     });
//   }
// });
