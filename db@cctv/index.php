<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Dashboard CCTV</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<style>
  body { margin:0; padding:0; display:flex; height:100vh; }
  #map { height:100%; width:70%; }
  .sidebar { width:30%; padding:20px; background:#f2f2f2; overflow-y:scroll; }
  .item { padding:10px; border-bottom:1px solid #ccc; }
  .green { color:green; font-weight:bold; }
  .red { color:red; font-weight:bold; }
</style>
</head>

<body>

<div class="sidebar">
  <h2>Daftar CCTV</h2>
  <div id="list"></div>
</div>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>
// Ambil dari database (PHP)
fetch("get_data.php")
  .then(res => res.json())
  .then(data => {
      let map = L.map('map').setView([-8.65, 115.22], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(map);

      let listBox = document.getElementById("list");

      data.forEach(item => {
          // Buat marker di peta
          L.marker([item.latitude, item.longitude]).addTo(map)
           .bindPopup(`<b>${item.nama}</b><br>${item.ipcamera}`);

          // Tampilkan daftar di sidebar
          listBox.innerHTML += `
            <div class="item">
              <b>${item.nama}</b><br>
              IP: ${item.ipcamera}<br>
              Total Kamera: ${item.totalkamera}<br>
              <span class="green">Up: ${item.kamera_up}</span> | 
              <span class="red">Down: ${item.kamera_down}</span>
            </div>
          `;
      });
  });
</script>

</body>
</html>
