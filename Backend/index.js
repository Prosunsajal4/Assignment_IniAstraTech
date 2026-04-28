const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/connection");
const config = require("./config");
const teachersRouter = require("./routes/teachers");
const studentsRouter = require("./routes/students");

const app = express();

connectDB();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/teachers", teachersRouter);
app.use("/api/students", studentsRouter);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
