const db = require("../database/connection");

exports.findAllBook = (req, res) => {
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
};

exports.findBookById = (req, res) => {
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
};

exports.addBook = (req, res) => {
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
};

exports.updateBook = (req, res) => {
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
};

exports.deleteBook = (req, res) => {
  const { id } = req.params;
  const { clear } = req.query;
  try {
    if (clear) {
      // Delete all rows**
      db.query("TRUNCATE books", (err, data) => {
        let message = "";
        if (err) {
          return res.status(500).send({
            status: "bad",
            message: err,
          });
        } else {
          message = "Successfuly clear all database";
        }

        return res.status(200).send({
          status: "good",
          message,
          data,
        });
      });
    } else {
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
    }
  } catch (error) {
    console.log(error);
  }
};
