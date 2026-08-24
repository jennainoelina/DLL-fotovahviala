const express = require("express");
const bcrypt = require("bcrypt");
const asiakkaat = require("../data/asiakkaat.json");
const { listaaKuvat } = require("../palvelut/galleriaPalvelu");
const { luoZip } = require("../palvelut/zipPalvelu");

const router = express.Router();

router.post("/kirjaudu", async (req, res, next) => {
  try {
    const { asiakasId, salasana } = req.body;
    const asiakas = asiakkaat.find(a => a.id === asiakasId);

    if (!asiakas) return res.status(404).json({ viesti: "Asiakasta ei löytynyt" });

    const ok = await bcrypt.compare(salasana, asiakas.salasanaHash);
    if (!ok) return res.status(401).json({ viesti: "Virheellinen salasana" });

    req.session.asiakasId = asiakasId;
    res.json({ viesti: "Kirjautuminen onnistui", asiakasId });
  } catch (err) {
    next(err);
  }
});

function vaadiAsiakas(req, res, next) {
  if (req.session && req.session.asiakasId) return next();
  return res.status(401).json({ viesti: "Ei oikeuksia" });
}

router.get("/kuvat", vaadiAsiakas, (req, res) => {
  const asiakasId = req.session.asiakasId;
  const kuvat = listaaKuvat(asiakasId);
  res.json({ asiakasId, kuvat });
});

router.get("/zip", vaadiAsiakas, (req, res, next) => {
  try {
    const asiakasId = req.session.asiakasId;
    luoZip(asiakasId, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
