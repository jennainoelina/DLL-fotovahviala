const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/:asiakasId", (req, res) => {
    const asiakasId = req.params.asiakasId;

    const kansio = path.join(__dirname, "../julkinen/galleriat", asiakasId);

    if (!fs.existsSync(kansio)) {
        return res.status(404).json({ viesti: "Asiakasta ei löytynyt" });
    }

    const kuvat = fs.readdirSync(kansio).filter(tiedosto => tiedosto !== "salasana.txt");

    res.json({ kuvat });
});

module.exports = router;

