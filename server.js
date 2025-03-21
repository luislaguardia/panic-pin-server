const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 5001;
const SOS_FILE = path.join(__dirname, "sos_data.json");

app.use(express.json());
app.use(cors());

let sosList = [];

async function loadSOSData() {
    try {
        const data = await fs.readFile(SOS_FILE, "utf8");
        sosList = JSON.parse(data);
    } catch (error) {
        console.log("No existing SOS data found, starting fresh.");
        sosList = [];
    }
}

async function saveSOSData() {
    try {
        await fs.writeFile(SOS_FILE, JSON.stringify(sosList, null, 4));
    } catch (error) {
        console.error("Error saving SOS data:", error);
    }
}

app.post("/sos", async (req, res) => {
    const newSOS = req.body;

    const existingIndex = sosList.findIndex(entry => entry.user_id === newSOS.user_id);
    if (existingIndex !== -1) {
        sosList[existingIndex].lat = newSOS.lat;
        sosList[existingIndex].lon = newSOS.lon;
    } else {
        sosList.push(newSOS);
    }

    await saveSOSData(); 
    res.json({ message: "SOS received" });
});

app.get("/get_sos", (req, res) => {
    res.json(sosList);
});

// Start server and load SOS data
app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await loadSOSData(); 
});
