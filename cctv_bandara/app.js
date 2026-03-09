// app.js
let map, markers = {};
const apiGet = 'get_cctv.php';
const apiAdd = 'add_cctv.php';
const apiDelete = 'delete_cctv.php';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();

  document.getElementById('btnAdd').addEventListener('click', openAdd);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('form').addEventListener('submit', onSubmit);
});

function initMap(){
  map = L.map('map').setView([-8.409518, 115.188919], 13); // default Bali (ubah jika perlu)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
}

async function loadData(){
  try {
    const res = await fetch(apiGet);
    const j = await res.json();
    if(!j.success) throw new Error('Failed loading');
    renderList(j.data);
    renderMarkers(j.data);
    updateSummary(j.data);
  } catch(err){
    console.error(err);
    alert('Gagal memuat data: ' + err.message);
  }
}

function updateSummary(data){
  const totalCount = data.length;
  let totalCams = 0, up = 0, down = 0;
  data.forEach(d => {
    totalCams += Number(d.jumlah_kamera || 0);
    up += Number(d.kamera_up || 0);
    down += Number(d.kamera_down || 0);
  });
  document.getElementById('totalCount').textContent = totalCount;
  document.getElementById('totalCams').textContent = totalCams;
  document.getElementById('upCount').textContent = up;
  document.getElementById('downCount').textContent = down;
}

function renderList(data){
  const el = document.getElementById('list');
  el.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="meta">
        <h4>${escapeHtml(item.nama)} <small style="font-weight:400">(${escapeHtml(item.ip)})</small></h4>
        <p>Status: ${item.status} — ${item.jumlah_kamera} kamera (UP:${item.kamera_up} / DOWN:${item.kamera_down})</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="zoomTo(${item.id})">Map</button>
        <button class="btn" onclick="openEdit(${item.id})">Edit</button>
        <button class="btn" onclick="del(${item.id})">Hapus</button>
      </div>
    `;
    el.appendChild(div);
  });
}

function renderMarkers(data){
  // clear existing
  for(const k in markers){ map.removeLayer(markers[k]); }
  markers = {};
  data.forEach(item => {
    if(!item.lat || !item.lng) return;
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);
    // color based on status
    const color = (item.status === 'UP') ? 'green' : 'red';
    const marker = L.circleMarker([lat, lng], {
      radius: 8,
      color: color,
      fillColor: color,
      fillOpacity: 0.8
    }).addTo(map);
    marker.bindPopup(`<b>${escapeHtml(item.nama)}</b><br>IP: ${escapeHtml(item.ip)}<br>Status: ${escapeHtml(item.status)}`);
    markers[item.id] = marker;
  });
}

function zoomTo(id){
  const m = markers[id];
  if(m){
    map.setView(m.getLatLng(), 16);
    m.openPopup();
  } else {
    alert('Lokasi belum memiliki koordinat');
  }
}

function openAdd(){
  document.getElementById('modalTitle').textContent = 'Tambah CCTV';
  document.getElementById('form').reset();
  document.getElementById('id').value = '';
  showModal();
}

async function openEdit(id){
  // ambil data dari server list (atau GET individual jika ada)
  const res = await fetch(apiGet);
  const j = await res.json();
  const item = j.data.find(x => Number(x.id) === Number(id));
  if(!item) return alert('Data tidak ditemukan');
  document.getElementById('modalTitle').textContent = 'Edit CCTV';
  document.getElementById('id').value = item.id;
  document.getElementById('nama').value = item.nama;
  document.getElementById('ip').value = item.ip;
  document.getElementById('url').value = item.url || '';
  document.getElementById('status').value = item.status;
  document.getElementById('lat').value = item.lat || '';
  document.getElementById('lng').value = item.lng || '';
  document.getElementById('jumlah_kamera').value = item.jumlah_kamera || 1;
  document.getElementById('kamera_up').value = item.kamera_up || 0;
  document.getElementById('kamera_down').value = item.kamera_down || 0;
  showModal();
}

function showModal(){ document.getElementById('modal').classList.remove('hidden'); }
function closeModal(){ document.getElementById('modal').classList.add('hidden'); }

async function onSubmit(e){
  e.preventDefault();
  const form = new FormData(document.getElementById('form'));
  // basic validation: kamera_up + kamera_down <= jumlah_kamera
  const jumlah = Number(form.get('jumlah_kamera') || 0);
  const up = Number(form.get('kamera_up') || 0);
  const down = Number(form.get('kamera_down') || 0);
  if(up + down > jumlah){
    if(!confirm('Jumlah kamera UP + DOWN lebih besar dari total kamera. Lanjutkan?')) return;
  }

  try {
    const res = await fetch(apiAdd, { method:'POST', body: form });
    const j = await res.json();
    if(j.success){
      closeModal();
      await loadData();
    } else {
      alert('Error: ' + (j.error || j.message || 'tidak diketahui'));
    }
  } catch(err){
    console.error(err);
    alert('Gagal menyimpan: ' + err.message);
  }
}

async function del(id){
  if(!confirm('Hapus data ini?')) return;
  const form = new FormData();
  form.append('id', id);
  try {
    const res = await fetch(apiDelete, { method:'POST', body: form });
    const j = await res.json();
    if(j.success){
      await loadData();
    } else {
      alert('Gagal hapus: ' + (j.error || ''));
    }
  } catch(err){
    console.error(err);
    alert('Gagal menghapus: ' + err.message);
  }
}

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
