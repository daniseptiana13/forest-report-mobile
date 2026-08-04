const API = 'http://192.168.11.195:3000';

const session = JSON.parse(localStorage.getItem('forest_session'));

if (!session) {
window.location.href = 'index.html';
}

function weatherIcon(weather) {
const icons = {
'Cerah': '☀️',
'Cerah Berawan': '🌤️',
'Berawan': '☁️',
'Mendung': '☁️',
'Gerimis': '🌦️',
'Hujan Ringan': '🌧️',
'Hujan Sedang': '🌧️',
'Hujan Lebat': '⛈️',
'Hujan Petir': '⛈️',
'Kabut': '🌫️',
'Angin Kencang': '💨'
};
return icons[weather] || '🌤️';
}

function formatTime(iso) {
const d = new Date(iso);
return d.toLocaleString('id-ID');
}

function syncBadge(report) {
  // Data dari pending_reports
  if (report.sync_status === 0) {
    return '<span class="badge pending">🟡 Menunggu Sinkronisasi</span>';
  }

  // Data gagal dikirim
  if (report.sync_status === -1) {
    return '<span class="badge failed">🔴 Gagal Sinkron</span>';
  }

  // Data dari server
  return '<span class="badge synced">🟢 Tersinkron</span>';
}

function renderReports(reports) {
document.getElementById('totalReports').innerText = reports.length;
document.getElementById('connectionStatus').innerText =
navigator.onLine ? 'Online' : 'Offline';
document.getElementById('modeText').innerText =
navigator.onLine ? 'Mode Online' : 'Mode Offline';

const container = document.getElementById('reportCards');
container.innerHTML = '';

if (reports.length === 0) {
container.innerHTML =
`<div class="report-card">Belum ada laporan.</div>`;
return;
}

reports.forEach(report => {
container.innerHTML += `
<div class="report-card">
<div class="report-header">
  <div>
    <div class="report-name">${report.full_name}</div>
    ${syncBadge(report)}
  </div>
  <div class="report-time">${formatTime(report.report_time)}</div>
</div>

    <div class="weather-row">
      <div class="weather-icon">${weatherIcon(report.weather)}</div>
      <div>
        <b>${report.weather}</b>
        <div style="font-size:13px;color:#666;">Kondisi Langit</div>
      </div>
    </div>

    <div class="report-grid">
      <div class="info-box">
        <div class="label">Suhu</div>
        <div class="value">${report.temperature}°C</div>
      </div>

      <div class="info-box">
        <div class="label">Angin</div>
        <div class="value">${report.wind_speed}</div>
      </div>

      <div class="info-box">
        <div class="label">Ditolong</div>
        <div class="value">${report.people_helped}</div>
      </div>
    </div>

    <div class="location-box">
      <b>Wilayah:</b> ${report.guard_location}
    </div>
  </div>
`;

});
}

async function loadReports() {
if (navigator.onLine) {
try {
const response = await fetch(`${API}/api/reports`, {
  cache: 'no-store'
});

const data = await response.json();
data.forEach(r => r.sync_status = 1);
renderReports(data);
return;
} catch (err) {}
}

const pending = JSON.parse(localStorage.getItem('pending_reports')) || [];
const myReports = pending.filter(r => r.id_user === session.id_user);
renderReports(myReports);
}

function goHome() {
window.location.href = 'home.html';
}

loadReports();

window.addEventListener('online', loadReports);
window.addEventListener('offline', loadReports);

// Refresh otomatis jika ada sinkronisasi baru
window.addEventListener('storage', (e) => {
  if (e.key === 'sync_updated') {
    loadReports();
  }
});

// Refresh setiap halaman dibuka kembali
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    loadReports();
  }
});