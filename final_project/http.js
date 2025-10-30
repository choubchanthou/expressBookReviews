// services/http.js
const axios = require("axios");

const http = axios.create({
  baseURL: process.env.BOOKS_API_URL || "http://localhost:5000", // change to your upstream
  timeout: 10_000,
});

// Optional: interceptors for logging/headers
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // centralize error logging
    // console.error('HTTP error:', err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

module.exports = http;
``;
