const express = require("express");
const bcrypt = require("bcrypt");
const { ADMIN_KAYTTAJA, ADMIN_SALASANA_HASH } = require("../asetukset/palvelinasetukset");

const router = express.Router();

// ADMIN KIRJAUTUMINEN
router.post("/admin", async (req, res) => {
    const { kayttaja, salasana } = req.body;

    if (kayttaja !== ADMIN_KAYTTAJA) {
        return res.status(401).json({ viesti: "Virheellinen käyttäjä" });
    }

    const ok = await bcrypt.compare(salasana, ADMIN_SALASANA_HASH);

    if (!ok) {
        return res.status(401).json({ viesti: "Virheellinen salasana" });
    }

    req.session.onAdmin = true;

    res.json({ viesti: "Kirjautuminen onnistui" });
});

module.exports = router;
