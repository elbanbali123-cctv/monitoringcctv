<?php require 'config.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Dashboard CCTV</title>

  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Dashboard CCTV</h2>

      <div class="summary">
        <div>Total lokasi: <span id="totalCount">0</span></div>
        <div>Kamera total: <span id="totalCams">0</span></div>
        <div>UP: <span id="upCount">0</span> — DOWN: <span id="downCount">0</span></div>
      </div>

      <button id="btnAdd" class="btn">+ Tambah CCTV</button>

      <div id="list" class="list"></div>
    </aside>

    <main class="main">
      <div id="map" class="map"></div>
    </main>
  </div>

  <!-- Modal form -->
  <div id="modal" class="modal hidden">
    <div class="modal-content">
      <h3 id="modalTitle">Tambah CCTV</h3>
      <form id="form">
        <input type="hidden" name="id" id="id" />
        <label>Nama
          <input type="text" name="nama" id="nama" required />
        </label>
        <label>IP
          <input type="text" name="ip" id="ip" required />
        </label>
        <label>URL
          <input type="url" name="url" id="url" />
        </label>
        <label>Status
          <select name="status" id="status">
            <option value="UP">UP</option>
            <option value="DOWN">DOWN</option>
          </select>
        </label>
        <label>Latitude
          <input type="number" step="0.000001" name="lat" id="lat" />
        </label>
        <label>Longitude
          <input type="number" step="0.000001" name="lng" id="lng" />
        </label>
        <label>Jumlah Kamera
          <input type="number" name="jumlah_kamera" id="jumlah_kamera" min="1" value="1" />
        </label>
        <label>Kamera UP
          <input type="number" name="kamera_up" id="kamera_up" min="0" value="0" />
        </label>
        <label>Kamera DOWN
          <input type="number" name="kamera_down" id="kamera_down" min="0" value="0" />
        </label>

        <div class="modal-actions">
          <button type="submit" class="btn primary" id="saveBtn">Simpan</button>
          <button type="button" class="btn" id="cancelBtn">Batal</button>
        </div>
      </form>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="app.js"></script>
</body>
</html>
