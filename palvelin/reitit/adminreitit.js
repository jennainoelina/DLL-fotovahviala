const express = require("express");
const multer = require("multer");
const path = require("path");
const { adminVarmistus } = require("../valiaohjelmat/adminVarmistus");
const { varmistaKansio, poistaKuva } = require("../palvelut/galleriaPalvelu");

const router = express.Router();

// Multer tallennus
const tallennus = multer.diskStorage({
  destination: (req, file, cb) => {
    const asiakasId = req.body.asiakasId;
    const kansio = varmistaKansio(asiakasId);
    cb(null, kansio);
  },
  filename: (req, file, cb) => {
    const nimi = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, nimi);
  }
});

const upload = multer({ storage: tallennus });

// Lataa kuvia
router.post("/lataa", adminVarmistus, upload.array("kuvat", 50), (req, res) => {
  res.json({
    viesti: "Kuvat ladattu",
    tiedostot: req.files.map(f => path.basename(f.path))
  });
});

// Poista kuva
router.delete("/poista", adminVarmistus, (req, res) => {
  const { asiakasId, tiedosto } = req.body;
  const ok = poistaKuva(asiakasId, tiedosto);

  if (!ok) {
    return res.status(404).json({ viesti: "Kuvaa ei löytynyt" });
  }

  res.json({ viesti: "Kuva poistettu" });
});

// Luo asiakaskansio
router.post("/luo-kansio", adminVarmistus, (req, res) => {
  const { asiakasId } = req.body;
  varmistaKansio(asiakasId);
  res.json({ viesti: "Asiakaskansio luotu", asiakasId });
});

module.exports = router;
