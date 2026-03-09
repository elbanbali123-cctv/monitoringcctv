let map;
let markers = [];

// --- INIT MAP --- //
function initMap() {
    map = L.map("map").setView([-8.748169, 115.167473], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 25
    }).addTo(map);

    loadCCTV();

    map.on("click", e => {
        document.getElementById("lat").value = e.latlng.lat;
        document.getElementById("lng").value = e.latlng.lng;
    });
}

// --- LOAD CCTV (PHP → JSON) --- //
function loadCCTV() {
    fetch("load.php")
        .then(res => res.json())
        .then(data => renderTable(data));
}

// --- RENDER TABLE + MAP --- //
function renderTable(data) {
    const tbody = document.querySelector("#cctvTable tbody");
    tbody.innerHTML = "";

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    let UP = 0, DOWN = 0;

    data.forEach((cctv, i) => {

        if (cctv.status === "UP") UP++; else DOWN++;

        // marker
        const marker = L.marker([cctv.lat, cctv.lng]).addTo(map);
        marker.bindPopup(`<b>${cctv.nama}</b><br>IP: ${cctv.ip}<br>Status: ${cctv.status}`);
        markers.push(marker);

        // table row
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i+1}</td>
          <td>${cctv.nama}</td>
          <td>${cctv.ip}</td>
          <td>${cctv.status}</td>
          <td><a href="${cctv.url}" target="_blank">Link</a></td>
          <td>${cctv.lat}, ${cctv.lng}</td>
          <td>
            <button onclick="hapus(${cctv.id})" class="delete-btn">Hapus</button>
          </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("countUp").innerText = UP;
    document.getElementById("countDown").innerText = DOWN;
}

// --- TAMBAH CCTV --- //
document.getElementById("btnTambah").addEventListener("click", () => {
    const data = new FormData();
    data.append("nama", nama.value);
    data.append("ip", ip.value);
    data.append("url", "http://" + ip.value);
    data.append("status", status.value);
    data.append("lat", lat.value);
    data.append("lng", lng.value);

    fetch("add.php", { method: "POST", body: data })
        .then(() => loadCCTV());
});

// --- HAPUS CCTV --- //
function hapus(id) {
    if (!confirm("Hapus CCTV?")) return;
    fetch("delete.php?id=" + id)
        .then(() => loadCCTV());
}

initMap();
