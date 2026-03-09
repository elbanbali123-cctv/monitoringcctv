// Ambil data dari localStorage (jika ada), atau inisialisasi array kosong
let cctvData = JSON.parse(localStorage.getItem("cctvData") || "[]");
let markers = {};

// Jika data lama tidak punya id unik, tambahkan id
let needSave = false;
cctvData = cctvData.map(item => {
  if (!item.id) {
    needSave = true;
    return Object.assign({ id: Date.now().toString() + Math.random().toString(36).slice(2) }, item);
  }
  return item;
});
if (needSave) localStorage.setItem("cctvData", JSON.stringify(cctvData));

// Fungsi simpan data
function saveData() {
  localStorage.setItem("cctvData", JSON.stringify(cctvData));
}

// Icon marker untuk status UP / DOWN
const iconUp = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
const iconDown = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Inisialisasi map Leaflet
const map = L.map('map').setView([-8.748, 115.167], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 22 }).addTo(map);

// Hapus semua marker lama
function clearMarkers() {
  Object.values(markers).forEach(m => {
    try { map.removeLayer(m); } catch {}
  });
  markers = {};
}

// Render marker berdasarkan data cctvData
function renderMarkers() {
  clearMarkers();
  cctvData.forEach(cctv => {
    const lat = parseFloat(cctv.lat), lng = parseFloat(cctv.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    const iconUsed = (cctv.status === 'UP') ? iconUp : iconDown;
    const m = L.marker([lat, lng], { icon: iconUsed }).addTo(map);

    const warna = (cctv.status === 'UP') ? "green" : "red";
    const ipLink = cctv.ip ? `<a href="${cctv.url || ("http://"+cctv.ip)}" target="_blank" style="color:${warna}">${cctv.ip}</a>` : '';
    const streamLink = cctv.url ? `<a href="${cctv.url}" target="_blank" style="color:${warna}">Buka Stream</a>` : '';

    m.bindPopup(`
      <b>${escapeHtml(cctv.nama)}</b><br>
      IP: ${ipLink}<br>
      Status: <span style="color:${warna}">${cctv.status}</span><br>
      ${streamLink}
    `);

    markers[cctv.id] = m;
  });
}

// Render tabel daftar CCTV
function renderTableFromArray(arr) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  arr.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;

    const tdNama = document.createElement('td');
    tdNama.innerText = item.nama || '';
    const tdIp = document.createElement('td');
    if (item.ip) {
      const a = document.createElement('a');
      a.href = item.url || ("http://" + item.ip);
      a.target = "_blank";
      a.innerText = item.ip;
      tdIp.appendChild(a);
    } else {
      tdIp.innerText = '';
    }

    const tdStatus = document.createElement('td');
    tdStatus.className = (item.status === 'UP') ? 'status-up' : 'status-down';
    tdStatus.innerHTML = (item.status || '') + (item.url ? '<br><a href="' + item.url + '" target="_blank">Stream</a>' : '');

    const tdAksi = document.createElement('td');
    tdAksi.className = 'actions';
    const btnEdit = document.createElement('button');
    btnEdit.innerText = 'Edit';
    btnEdit.onclick = () => editCCTV(item.id);
    const btnHapus = document.createElement('button');
    btnHapus.innerText = 'Hapus';
    btnHapus.onclick = () => deleteCCTV(item.id);
    tdAksi.appendChild(btnEdit);
    tdAksi.appendChild(btnHapus);

    tr.appendChild(tdNama);
    tr.appendChild(tdIp);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAksi);
    tbody.appendChild(tr);
  });
}

function renderTable() { renderTableFromArray(cctvData); }

// Tambah CCTV baru
document.getElementById('addBtn').addEventListener('click', () => {
  const nama = document.getElementById('nama').value.trim();
  const ip   = document.getElementById('ip').value.trim();
  const status = document.getElementById('status').value;
  const url  = document.getElementById('url').value.trim();
  const lat  = document.getElementById('lat').value.trim();
  const lng  = document.getElementById('lng').value.trim();

  if (!nama || !ip || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
    alert('Isi semua data dengan benar (nama, ip, lat, lng).');
    return;
  }

  const newItem = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    nama, ip, status, url,
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };
  cctvData.push(newItem);
  saveData();

  document.getElementById('nama').value = '';
  document.getElementById('ip').value = '';
  document.getElementById('url').value = '';
  document.getElementById('lat').value = '';
  document.getElementById('lng').value = '';

  renderMarkers();
  renderTable();
});

// Edit CCTV
function editCCTV(id) {
  const pwd = prompt('Masukkan password edit:');
  if (pwd !== 'admin') { alert('Password salah!'); return; }
  const item = cctvData.find(x => x.id === id);
  if (!item) return;

  const newNama = prompt('Nama baru:', item.nama) || item.nama;
  const newIp   = prompt('IP baru:', item.ip) || item.ip;
  const newStatus = prompt('Status (UP/DOWN):', item.status) || item.status;
  const newUrl  = prompt('URL stream (kosong untuk tidak berubah):', item.url || '') || item.url;
  const newLat  = prompt('Latitude:', item.lat) || item.lat;
  const newLng  = prompt('Longitude:', item.lng) || item.lng;

  if (!newNama || !newIp || isNaN(parseFloat(newLat)) || isNaN(parseFloat(newLng))) {
    alert('Nama, IP, Latitude, dan Longitude harus diisi dengan benar.');
    return;
  }

  item.nama   = newNama;
  item.ip     = newIp;
  item.status = (newStatus === 'DOWN') ? 'DOWN' : 'UP';
  item.url    = newUrl;
  item.lat    = parseFloat(newLat);
  item.lng    = parseFloat(newLng);

  saveData();
  renderMarkers();
  renderTable();
}

// Hapus CCTV
function deleteCCTV(id) {
  const pwd = prompt('Masukkan password hapus:');
  if (pwd !== 'admin') { alert('Password salah!'); return; }
  if (!confirm('Yakin ingin menghapus CCTV ini?')) return;

  cctvData = cctvData.filter(x => x.id !== id);
  saveData();
  renderMarkers();
  renderTable();
}

// Search / filter
document.getElementById('searchInput').addEventListener('input', function() {
  const keyword = this.value.trim().toLowerCase();
  if (keyword === '') {
    renderTable();
    map.setView([-8.748, 115.167], 13);
    return;
  }

  const matched = [], others = [];
  cctvData.forEach(item => {
    const n = (item.nama || '').toLowerCase();
    const ip = (item.ip || '').toLowerCase();
    const s = (item.status || '').toLowerCase();
    if (n.includes(keyword) || ip.includes(keyword) || s.includes(keyword))
      matched.push(item);
    else
      others.push(item);
  });

  const final = matched.concat(others);
  renderTableFromArray(final);

  document.querySelectorAll('#tableBody tr').forEach(r => {
    const id = r.dataset.id;
    if (matched.find(x => x.id === id)) r.classList.add('row-highlight');
    else r.classList.remove('row-highlight');
  });

  if (matched.length > 0) {
    const first = matched[0];
    if (markers[first.id]) {
      map.setView([first.lat, first.lng], 20);
      markers[first.id].openPopup();
      const firstRow = document.querySelector('#tableBody tr[data-id="' + first.id + '"]');
      if (firstRow) firstRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

// Clear search
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  renderTable();
  document.querySelectorAll('#tableBody tr').forEach(r => r.classList.remove('row-highlight'));
  map.setView([-8.748, 115.167], 13);
  map.closePopup();
});

// Utility escape HTML
function escapeHtml(unsafe) {
  return (unsafe || '').replace(/[&<"'>]/g, m =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m]
  );
}

// Inisialisasi awal
renderMarkers();
renderTable();
