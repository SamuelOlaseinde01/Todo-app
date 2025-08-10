require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");

const notFound = require("./middleware/notFound");
const taskRouter = require("./routes/task");
const errorHandlingMiddleware = require("./middleware/errorhandling");
const connectDb = require("./db/connectDb");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/authmiddleware");
const adminRouter = require("./routes/admin");

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", authMiddleware, taskRouter);
app.use("/api/v1/admin", adminRouter);

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
