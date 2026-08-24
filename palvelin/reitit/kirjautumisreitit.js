const express = require("express");
const bcrypt = require("bcrypt");
const { ADMIN_KAYTTAJA, ADMIN_SALASANA_HASH } = require("../asetukset/palvelinasetukset");

const router = express.Router();

router.post("/admin", async (req, res, next) => {
  try {
    const { kayttaja, salasana } = req.body;

    if (kayttaja !== ADMIN_KAYTTAJA) {
      return res.status(401).json({ viesti: "Virheelliset tunnukset" });
    }

    const ok = await bcrypt.compare(salasana, ADMIN_SALASANA_HASH);
    if (!ok) {
      return res.status(401).json({ viesti: "Virheelliset tunnukset" });
    }

    req.session.onAdmin = true;
    res.json({ viesti: "Kirjautuminen onnistui" });
  } catch (err) {
    next(err);
  }
});

router.post("/ulos", (req, res) => {
  req.session.destroy(() => {
    res.json({ viesti: "Uloskirjautuminen onnistui" });
  });
});

module.exports = router;
