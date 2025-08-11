require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const { rateLimit } = require("express-rate-limit");

const notFound = require("./middleware/notFound");
const taskRouter = require("./routes/task");
const errorHandlingMiddleware = require("./middleware/errorhandling");
const connectDb = require("./db/connectDb");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/authmiddleware");
const adminRouter = require("./routes/admin");

const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

app.use(limiter);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://todo-app-1-hi1e.onrender.com",
      "https://ois-todo-app.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", authMiddleware, taskRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is alive" });
});

app.use(notFound);
app.use(errorHandlingMiddleware);

async function start() {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
