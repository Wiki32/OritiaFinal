const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const DATABASE_FILE = "database.json";

// Function to read database file
const readDatabase = () => {
    try {
        const data = fs.readFileSync(DATABASE_FILE);
        return JSON.parse(data);
    } catch (error) {
        return { names: [] };
    }
};

// Function to write to database file
const writeDatabase = (data) => {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
};

// Get all names
app.get("/names", (req, res) => {
    const data = readDatabase();
    res.json(data);
});

// Check if a name exists
app.get("/names/:name", (req, res) => {
    const data = readDatabase();
    const name = req.params.name;
    const exists = data.names.includes(name);
    res.json({ exists });
});

// Add a new name
app.post("/names", (req, res) => {
    const data = readDatabase();
    const newName = req.body.name.trim();

    if (!newName) {
        return res.status(400).json({ message: "Name cannot be empty." });
    }

    if (data.names.includes(newName)) {
        return res.status(409).json({ message: "Name already exists." });
    }

    data.names.push(newName);
    writeDatabase(data);

    res.json({ message: `The name ${newName} has been added successfully.`, names: data.names });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});