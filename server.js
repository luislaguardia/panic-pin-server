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
    const newSOS = {
        user_id: req.body.user_id,
        lat: req.body.lat,
        lon: req.body.lon,
        timestamp: new Date().toISOString() 
    };

    sosList.push(newSOS);
    await saveSOSData();

    res.json({ message: "SOS received", data: newSOS });
});

app.get("/get_sos", (req, res) => {
    res.json(sosList);
});

app.listen(PORT, "0.0.0.0", async () => {
    console.log(Server running on http://localhost:${PORT});
    await loadSOSData();
});
