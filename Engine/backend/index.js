const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENCELLID_API_KEY = "pk.5b8599952bb7a033c6efffc54ac134a0";

app.post("/get-cell-info", async (req, res) => {
  const { phoneNumber } = req.body;
  
  try {
    // Step 1: Fetch MCC & MNC
    const numLookupRes = await axios.get(
      `https://api.numlookupapi.com/v1/validate/${phoneNumber}?apikey=num_live_DHVZaR7ztpBEV5oVeVTRHMtyb981rXH7wPI3LXNY`
    );

    if (!numLookupRes.data.valid) {
      return res.status(400).json({ error: "Invalid phone number." });
    }

    const { mcc, mnc } = numLookupRes.data;

    // Step 2: Fetch Cell Tower Info (LAC, Cell ID) - Ideally from a telco API
    // Hardcoding sample values for now
    const lac = "7033";
    const cellId = "17811";

    // Step 3: Get Location from OpenCellID
    const locationRes = await axios.get(
      `https://opencellid.org/cell/get?key=${OPENCELLID_API_KEY}&mcc=${mcc}&mnc=${mnc}&lac=${lac}&cellid=${cellId}&format=json`
    );

    if (locationRes.data.lat && locationRes.data.lon) {
      return res.json({
        latitude: locationRes.data.lat,
        longitude: locationRes.data.lon,
        accuracy: locationRes.data.range || "Unknown",
      });
    } else {
      return res.status(404).json({ error: "Cell location not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error while fetching data." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
 