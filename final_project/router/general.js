const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password, role } = (req.body || {});

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and passowrd are required!" });
  }

  if (users.some((user) => user.username === username)) {
    return res
      .status(400)
      .json({ message: "The user is already exist!" });
  }

  const id = users.length + 1;
  users.push({ id, username, password, email: `${username}@gmail.com`, role });

  return res.status(200).json({ message: "success" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res
    .status(200)
    .json({
      message: "success",
      data: Object.entries(books).flatMap(([key, value]) => ({...value, id: key})),
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req?.params || {};
  const bookDetail = books[isbn];

  if(!bookDetail) return res.status(404).json({ message: "book is not available" })

  return res.status(200).json({ message: "success", data: {...bookDetail, id: isbn} });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req?.params || {};
  // const bookDetail = Object.entries();
  const flatBooks = Object.entries(books).flatMap(([key, value]) => ({...value, id: key}));
  const book = flatBooks.find((b) => b.author === author);

  return res.status(200).json({ message: "success", data: book });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { title } = req?.params || {};
  const flatBooks = Object.entries(books).flatMap(([key, value]) => ({...value, id: key})).filter(o => o.title.includes(title));
  return res.status(300).json({ message: "success", data: flatBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req?.params || {};
  const bookDetail = books[isbn];

  if(!bookDetail) return res.status(404).json({ message: "book is not available" });

  return res.status(300).json({ message: "success", data: bookDetail?.author });
});

module.exports.general = public_users;
