const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const { ISTUNTO_SALAINEN } = require("./asetukset/palvelinasetukset");

const kirjautumisreitit = require("./reitit/kirjautumisreitit");
const adminreitit = require("./reitit/adminreitit");
const galleriareitit = require("./reitit/galleriareitit");

const app = express();

// FRONTENDIN PALVELU (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../")));

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: ISTUNTO_SALAINEN,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ASIAKKAIDEN KUVAT
app.use("/galleriat", express.static(path.join(__dirname, "julkinen", "galleriat")));

// API-REITIT
app.use("/api/kirjautuminen", kirjautumisreitit);
app.use("/api/admin", adminreitit);
app.use("/api/galleria", galleriareitit);

// VIRHEKÄSITTELIJÄ
const { virheKasittelija } = require("./valiaohjelmat/virheKasittelija");
app.use(virheKasittelija);

// PALVELIN KÄYNTIIN
const PORTTI = process.env.PORT || 5000;
app.listen(PORTTI, () => {
  console.log(`Palvelin käynnissä portissa ${PORTTI}`);
});
