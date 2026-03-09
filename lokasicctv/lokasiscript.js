<script>
  let mapInitialized = false;
  let map;

  function showDashboard() {
    document.getElementById("dashboard-section").style.display = "block";
    document.getElementById("map-section").style.display = "none";
    document.getElementById("camera-table-section").style.display = "none";
  }

  function showAnalitic() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("camera-table-section").style.display = "none";
    document.getElementById("map-section").style.display = "flex";

    setTimeout(() => {
      if (!mapInitialized) {
        map = L.map('map').setView([-8.7481, 115.1675], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        mapInitialized = true;
      } else {
        map.invalidateSize();
      }
    }, 300);
  }

  function showCameraTable() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("map-section").style.display = "none";
    document.getElementById("camera-table-section").style.display = "block";
  }
</script>
