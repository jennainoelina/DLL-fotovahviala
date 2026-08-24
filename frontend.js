// ===============================
// ASETUKSET
// ===============================
const API = "http://localhost:5000";

// ===============================
// ADMIN: kirjautuminen
// ===============================
async function kirjauduAdmin() {
    const kayttaja = document.getElementById("kayttaja").value;
    const salasana = document.getElementById("admin_salasana").value;

    const vastaus = await fetch("http://localhost:5000/api/kirjautuminen/admin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kayttaja, salasana })
    });

    const data = await vastaus.json();

    if (vastaus.ok) {
        window.location.href = "admin.html";
    } else {
        alert(data.viesti);
    }
}




// ===============================
// ADMIN: luo asiakaskansio
// ===============================
async function luoAsiakas() {
  const asiakasId = document.getElementById("uusiAsiakasId").value;
  const salasana = document.getElementById("uusiAsiakasSalasana").value;

  if (!asiakasId || !salasana) {
    alert("Anna sekä asiakasId että salasana");
    return;
  }

  // 1. Luo kansio
  const kansioVastaus = await fetch(`${API}/api/admin/luo-kansio`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asiakasId })
  });

  const kansioData = await kansioVastaus.json();

  // 2. Aseta salasana
  const salasanaVastaus = await fetch(`${API}/api/admin/luo-salasana`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asiakasId, salasana })
  });

  const salasanaData = await salasanaVastaus.json();

  alert(`Asiakas luotu!\n${kansioData.viesti}\n${salasanaData.viesti}`);
}

// ===============================
// ADMIN: lataa kuvia asiakkaalle
// ===============================
async function lataaKuvat() {
  const asiakasId = document.getElementById("uploadAsiakasId").value;
  const input = document.getElementById("kuvatInput");

  const formData = new FormData();
  formData.append("asiakasId", asiakasId);

  for (const file of input.files) {
    formData.append("kuvat", file);
  }

  const vastaus = await fetch(`${API}/api/admin/lataa`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const data = await vastaus.json();
  alert("Kuvat ladattu onnistuneesti!");
  console.log(data);
}

// ===============================
// ADMIN: poista kuva
// ===============================
async function poistaKuva(asiakasId, tiedosto) {
  const vastaus = await fetch(`${API}/api/admin/poista`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asiakasId, tiedosto })
  });

  const data = await vastaus.json();
  alert(data.viesti);
}

// ===============================
// ASIAKAS: kirjautuminen
// ===============================
async function kirjauduAsiakas() {
  const asiakasId = document.getElementById("asiakasId").value;
  const salasana = document.getElementById("asiakas_salasana").value;

  const vastaus = await fetch(`${API}/api/galleria/kirjaudu`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asiakasId, salasana })
  });

  const data = await vastaus.json();

  if (vastaus.status === 200) {
    // Kirjautuminen onnistui → siirrytään galleriaan
    window.location.href = "galleria.html";
  } else {
    alert(data.viesti);
  }
}


// ===============================
// ASIAKAS: hae kuvat
// ===============================
async function haeKuvat() {
  const vastaus = await fetch(`${API}/api/galleria/kuvat`, {
    method: "GET",
    credentials: "include"
  });

  const data = await vastaus.json();

  const container = document.getElementById("kuvat");
  container.innerHTML = "";

  data.kuvat.forEach(tiedosto => {
    const img = document.createElement("img");
    img.src = `${API}/galleriat/${data.asiakasId}/${tiedosto}`;
    img.classList.add("galleria-kuva");

    // Adminille poistonappi
    const poistoBtn = document.createElement("button");
    poistoBtn.innerText = "Poista kuva";
    poistoBtn.onclick = () => poistaKuva(data.asiakasId, tiedosto);

    const wrapper = document.createElement("div");
    wrapper.appendChild(img);
    wrapper.appendChild(poistoBtn);

    container.appendChild(wrapper);
  });
}

// ===============================
// ASIAKAS: ZIP-lataus
// ===============================
function lataaZip() {
  window.location.href = `${API}/api/galleria/zip`;
}
