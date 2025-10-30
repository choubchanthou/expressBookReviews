// routes/public_users.js
const express = require("express");
const public_users = express.Router();
const http = require("../http");

public_users.get("/books", async (req, res) => {
  http
    .get("/")
    .then(({ data }) => {
      return res.status(200).json({ message: "success", data });
    })
    .catch((err) => {
      const status = err?.response?.status || 500;
      return res
        .status(status)
        .json({ message: "failed", error: err?.response?.data || err.message });
    });
});

public_users.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;

  const _data = await new Promise((resolve, reject) => {
    http
      .get(`/isbn/${isbn}`)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  res.status(200).json({ message: "success", data: _data });
});

public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author.trim();
    const { data: serverBooks } = await http.get('/author/'+ author);

    return res.status(200).json({ message: "success", data: serverBooks?.data });
  } catch (err) {
    const status = err?.response?.status || 500;
    return res
      .status(status)
      .json({ message: "failed", error: err?.response?.data || err.message });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.trim();
    // Axios version:
    const { data: serverBooks } = await http.get('/title/' + title);

    return res.status(200).json({ message: 'success', data: serverBooks?.data || [] });
  } catch (err) {
    const status = err?.response?.status || 500;
    return res.status(status).json({ message: 'failed', error: err?.response?.data || err.message });
  }
});

module.exports = public_users;
