const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5001;
const SOS_FILE = "sos_data.json";

app.use(express.json()); 
app.use(cors()); 

function loadSOSData() {
    try {
        const data = fs.readFileSync(SOS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return []; 
    }
}

function saveSOSData(data) {
    fs.writeFileSync(SOS_FILE, JSON.stringify(data, null, 4));
}

app.post("/sos", (req, res) => {
    const newSOS = req.body;
    let sosList = loadSOSData();

    const existingIndex = sosList.findIndex(entry => entry.user_id === newSOS.user_id);
    if (existingIndex !== -1) {
        sosList[existingIndex].lat = newSOS.lat;
        sosList[existingIndex].lon = newSOS.lon;
    } else {
        sosList.push(newSOS);
    }

    saveSOSData(sosList);
    res.json({ message: "SOS received" });
});

app.get("/get_sos", (req, res) => {
    res.json(loadSOSData());
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
