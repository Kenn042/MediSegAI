import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(email,password) VALUES($1,$2)",
    [email, hash]
  );

  res.json({ message: "User created" });
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.status(400).json({ message: "User not found" });

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
});

// AI DEMO SIMULATION
app.post("/api/analyze", (req, res) => {
  const risk = (Math.random() * 100).toFixed(2);

  res.json({
    riskScore: risk,
    confidence: "94%",
    report: `AI simulation detected ${risk}% early oncology risk pattern.`
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
