const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios"); // Import axios for HTTP requests

const app = express();
const PORT = 5001;
const SOS_FILE = "sos_data.json";

app.use(express.json());
app.use(cors());

const ALERTO_API_URL = "https://alertobuilders.net/api"; // Replace with actual endpoint

async function sendToAlerto(sosData) {
    try {
        const response = await axios.post(`${ALERTO_API_URL}/alerts`, sosData, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Sent to Alerto API:", response.data);
    } catch (error) {
        console.error("Error sending to Alerto:", error.response?.data || error.message);
    }
}

app.post("/sos", async (req, res) => {
    const newSOS = req.body;
    let sosList = [];

    try {
        const data = fs.readFileSync(SOS_FILE, "utf8");
        sosList = JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
    }

    sosList.push(newSOS);
    fs.writeFileSync(SOS_FILE, JSON.stringify(sosList, null, 4));

    // Send SOS to Alerto API
    await sendToAlerto(newSOS);

    res.json({ message: "SOS received and sent to Alerto API" });
});

app.get("/get_sos", (req, res) => {
    try {
        const data = fs.readFileSync(SOS_FILE, "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        res.json([]);
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
