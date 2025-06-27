const express = require("express");
const cors = require("cors");
const dns = require("dns");
const { promisify } = require("util");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const lookup = promisify(dns.lookup);

app.post("/api/resolve-ip", async (req, res) => {
  console.log("Server contacted", req.body);
  try {
    const { url } = req.body;
    const domain = url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
    console.log(`Domain extracted: ${domain}`);
    const { address } = await lookup(domain);
    if (!address) {
      console.log(`No IP address found for ${domain}`);
      throw new Error("No IP address found");
    }
    console.log(`Resolved IP for ${domain}: ${address}`);
    res.json({ ip: address });
  } catch (error) {
    console.log("error resolving IP:");
    res.status(400).json({ error: "Failed to resolve IP address" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
