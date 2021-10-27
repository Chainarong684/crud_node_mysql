const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is starting at http://localhost:${PORT}`);
});

app.use("/", router);
