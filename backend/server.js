require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.get("/", (req, res) => {
    res.send("Library Management API is running!");
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing");
        }

        console.log("Connecting to MongoDB...");

        await connectDB();

        console.log("MongoDB connected successfully");

        const { ensureAdmin, seedDemo } =
            require("./utils/seedData");

        await ensureAdmin();

        const Book = require("./models/Book");

        if (await Book.countDocuments() === 0) {
            await seedDemo();
        }

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("SERVER STARTUP ERROR:", error);
        process.exit(1);
    }
}

startServer();
