const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username and password!" });
  }

  const user = users.find((u) => u.username === username);

  const payload = { sub: user.id, email: user.email, role: user.role };
  const ACCESS_TOKEN_TTL = "15m";
  const REFRESH_TOKEN_TTL = "7d";
  const accessToken = jwt.sign(payload, "fingerprint_customer", {
    algorithm: "HS256",
    expiresIn: REFRESH_TOKEN_TTL,
  });

  req.session.authorization = { accessToken };
  req.session.user = { id: user.id, email: user.email, role: user.role };

  return res.status(200).json({
    message: "success",
    data: {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL,
      user,
    },
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req?.params;
  const { comment } = req?.body;
  
  books[isbn]["reviews"] = { user: req?.user, comment };

  return res.status(300).json({ message: "success", data: books[isbn] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
