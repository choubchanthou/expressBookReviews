const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const public_users = require("./router/public_users");

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  try {
    // 1) Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization || "";
    const [scheme, tokenFromHeader] = authHeader.split(" ");

    // 2) Or check session token (if you saved it at login)
    const tokenFromSession = req.session?.authorization?.accessToken;

    const token =
      scheme === "Bearer" && tokenFromHeader
        ? tokenFromHeader
        : tokenFromSession
        ? tokenFromSession
        : null;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, "fingerprint_customer", {
      algorithms: ["HS256"],
    });
    // Attach claims to request for downstream handlers
    req.user = decoded; // e.g., { sub: userId, email, role, iat, exp }
    return next();
  } catch (err) {
    // Token absent/invalid/expired
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/public", public_users);
app.use("/", genl_routes);




app.listen(PORT, () => console.log("Server is running"));
