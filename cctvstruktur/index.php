<?php include 'config.php'; ?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard CCTV - PHP + MySQL (Lengkap)</title>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>
  <div class="left-panel" id="leftPanel">
    <h2 style="text-align:center;">Daftar CCTV</h2>
    <div class="counters">
      Total: <span id="countTotal">0</span>
      &nbsp; UP: <span id="countUp" class="counter-up">0</span>
      &nbsp; DOWN: <span id="countDown" class="counter-down">0</span>
    </div>

    <div style="margin:8px 0">
      <input id="tableSearch" placeholder="Cari IP / Nama CCTV" />
      <button id="btnRefresh">Refresh</button>
    </div>

    <div class="table-container">
      <table id="cctvTable">
        <thead>
          <tr>
            <th>No</th><th>Nama</th><th>IP</th><th>Status</th><th>URL</th><th>Koordinat</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>

    <div class="form-section">
      <h3>Tambah / Edit CCTV</h3>
      <input type="hidden" id="cctvId" value="">
      <input type="text" id="cctvName" placeholder="Nama CCTV">
      <input type="text" id="cctvIP" placeholder="IP (ex: 10.2.55.203:8080)">
      <input type="text" id="cctvURL" placeholder="URL otomatis" readonly>
      <select id="cctvStatus"><option value="UP">UP</option><option value="DOWN">DOWN</option></select>
      <input type="text" id="cctvLat" placeholder="Latitude">
      <input type="text" id="cctvLng" placeholder="Longitude">
      <div style="margin-top:6px">
        <button id="btnSave">Simpan</button>
        <button id="btnClear">Bersihkan</button>
        <button id="btnCheckStatus">Cek Semua Status (Server)</button>
      </div>
    </div>
  </div>

  <div class="right-panel">
    <div id="map"></div>
    <div id="dateTime"></div>
    <div id="togglePanel"><a href="#" id="toggleBtn">◀</a></div>
    <input type="text" id="searchBox" placeholder="Cari CCTV..." />
  </div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="scripts.js"></script>
</body>
</html>
