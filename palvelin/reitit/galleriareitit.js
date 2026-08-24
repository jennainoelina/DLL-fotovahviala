const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// ASIAKAS: hae kuvat
router.get("/kuvat", (req, res) => {
    const asiakasId = req.session.asiakasId;

    if (!asiakasId) {
        return res.status(401).json({ viesti: "Ei kirjautunut" });
    }

    const kansioPolku = path.join(__dirname, "../julkinen/galleriat", asiakasId);

    if (!fs.existsSync(kansioPolku)) {
        return res.status(404).json({ viesti: "Kansiota ei löytynyt" });
    }

    const kaikkiTiedostot = fs.readdirSync(kansioPolku);

    // Suodata vain kuvat
    const kuvat = kaikkiTiedostot.filter(tiedosto =>
        tiedosto.endsWith(".jpg") ||
        tiedosto.endsWith(".jpeg") ||
        tiedosto.endsWith(".png")
    );

    res.json({
        asiakasId,
        kuvat
    });
});

module.exports = router;
