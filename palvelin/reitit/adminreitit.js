const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

router.post("/luo-asiakas", async (req, res) => {
    const { asiakasId, salasana } = req.body;

    const asiakasKansio = path.join(__dirname, "../julkinen/galleriat", asiakasId);

    if (!fs.existsSync(asiakasKansio)) {
        fs.mkdirSync(asiakasKansio, { recursive: true });
    }

    const hash = await bcrypt.hash(salasana, 10);

    fs.writeFileSync(path.join(asiakasKansio, "salasana.txt"), hash);

    res.json({ viesti: "Asiakas luotu ja salasana tallennettu" });
});

module.exports = router;
