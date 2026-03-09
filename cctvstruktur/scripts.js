// scripts.js - frontend logic (fetch API)
let map, markers = [], allData = [];

function initMap(){
  map = L.map('map').setView([-8.748169,115.167473],16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:25}).addTo(map);
  map.on('click', e=>{
    document.getElementById('cctvLat').value = e.latlng.lat.toFixed(6);
    document.getElementById('cctvLng').value = e.latlng.lng.toFixed(6);
  });
}

function formatURL(ip){
  ip = (ip||'').trim();
  if(!ip) return '';
  if(ip.indexOf('http')===0) return ip;
  return 'http://' + ip;
}

document.getElementById('cctvIP').addEventListener('input', function(){
  document.getElementById('cctvURL').value = formatURL(this.value);
});

// load list
async function loadList(){
  try{
    const res = await fetch('api/list.php');
    const data = await res.json();
    allData = data;
    renderTable(data);
    renderMarkers(data);
    updateCounters(data);
  }catch(err){ console.error(err); alert('Gagal load data'); }
}

function renderTable(data){
  const tbody = document.querySelector('#cctvTable tbody');
  tbody.innerHTML = '';
  data.forEach((cctv, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td>
      <td>${escapeHtml(cctv.nama_kamera)}</td>
      <td>${escapeHtml(cctv.ip_address)}</td>
      <td class="${cctv.status==='UP'?'up':'down'}">${cctv.status}</td>
      <td><a href="${escapeAttr(cctv.url)}" target="_blank">Link</a></td>
      <td>${cctv.latitude || '-'}, ${cctv.longitude || '-'}</td>
      <td>
        <button onclick="editItem(${cctv.id})">Edit</button>
        <button onclick="deleteItem(${cctv.id})">Hapus</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function renderMarkers(data){
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  data.forEach(d=>{
    if(!d.latitude || !d.longitude) return;
    const m = L.marker([d.latitude, d.longitude]).addTo(map);
    m.bindPopup(`<b>${escapeHtml(d.nama_kamera)}</b><br>IP: ${escapeHtml(d.ip_address)}<br>Status: ${d.status}`);
    markers.push(m);
  });
}

function updateCounters(data){
  document.getElementById('countTotal').innerText = data.length;
  document.getElementById('countUp').innerText = data.filter(x=>x.status==='UP').length;
  document.getElementById('countDown').innerText = data.filter(x=>x.status==='DOWN').length;
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
function escapeAttr(s){ return escapeHtml(s); }

// search
function doSearch(){
  const q1 = (document.getElementById('searchBox').value||'').toLowerCase();
  const q2 = (document.getElementById('tableSearch').value||'').toLowerCase();
  const kw = (q1 + ' ' + q2).trim();
  const filtered = allData.filter(c=>{
    if(!kw) return true;
    return (c.nama_kamera||'').toLowerCase().includes(kw) || (c.ip_address||'').toLowerCase().includes(kw);
  });
  renderTable(filtered);
  renderMarkers(filtered);
  updateCounters(filtered);
}

document.getElementById('searchBox').addEventListener('input', doSearch);
document.getElementById('tableSearch').addEventListener('input', doSearch);
document.getElementById('btnRefresh').addEventListener('click', loadList);

// save (add/update)
document.getElementById('btnSave').addEventListener('click', async ()=>{
  const id = document.getElementById('cctvId').value;
  const payload = {
    nama_kamera: document.getElementById('cctvName').value,
    ip_address: document.getElementById('cctvIP').value,
    url: document.getElementById('cctvURL').value,
    status: document.getElementById('cctvStatus').value,
    latitude: document.getElementById('cctvLat').value,
    longitude: document.getElementById('cctvLng').value
  };
  const form = new FormData();
  for(const k in payload) form.append(k, payload[k]);
  try{
    if(id){
      form.append('id', id);
      await fetch('api/update.php', { method: 'POST', body: form });
    }else{
      await fetch('api/add.php', { method: 'POST', body: form });
    }
    clearForm();
    await loadList();
    alert('Sukses');
  }catch(e){ console.error(e); alert('Gagal simpan'); }
});

document.getElementById('btnClear').addEventListener('click', clearForm);

function clearForm(){
  document.getElementById('cctvId').value='';
  document.getElementById('cctvName').value='';
  document.getElementById('cctvIP').value='';
  document.getElementById('cctvURL').value='';
  document.getElementById('cctvStatus').value='UP';
  document.getElementById('cctvLat').value='';
  document.getElementById('cctvLng').value='';
}

async function editItem(id){
  const res = await fetch('api/get.php?id='+id);
  const obj = await res.json();
  document.getElementById('cctvId').value = obj.id;
  document.getElementById('cctvName').value = obj.nama_kamera;
  document.getElementById('cctvIP').value = obj.ip_address;
  document.getElementById('cctvURL').value = obj.url;
  document.getElementById('cctvStatus').value = obj.status;
  document.getElementById('cctvLat').value = obj.latitude;
  document.getElementById('cctvLng').value = obj.longitude;
  map.setView([obj.latitude || -8.748169, obj.longitude || 115.167473], 17);
}

async function deleteItem(id){
  if(!confirm('Hapus data?')) return;
  await fetch('api/delete.php?id='+id);
  await loadList();
}

document.getElementById('btnCheckStatus').addEventListener('click', async ()=>{
  const res = await fetch('api/check_status.php');
  const text = await res.text();
  alert(text);
  await loadList();
});

// datetime
function updateDateTime(){
  const now = new Date();
  document.getElementById('dateTime').innerText = now.toLocaleString('id-ID');
}
setInterval(updateDateTime,1000);
updateDateTime();

// init
initMap();
loadList();
