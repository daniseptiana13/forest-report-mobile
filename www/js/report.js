const API = 'http://192.168.11.195:3000';

const session = JSON.parse(localStorage.getItem('forest_session'));

if (!session) {
window.location.href = 'index.html';
}

function updateTime() {
const now = new Date();

const formatted =
now.getFullYear() + '-' +
String(now.getMonth() + 1).padStart(2, '0') + '-' +
String(now.getDate()).padStart(2, '0') + ' ' +
String(now.getHours()).padStart(2, '0') + ':' +
String(now.getMinutes()).padStart(2, '0');

document.getElementById('reportTime').value = formatted;
}

setInterval(updateTime, 1000);
updateTime();

function getPendingReports() {
return JSON.parse(localStorage.getItem('pending_reports')) || [];
}

function savePendingReports(reports) {
localStorage.setItem('pending_reports', JSON.stringify(reports));
}

async function saveReport() {
const report = {
report_time: document.getElementById('reportTime').value,
temperature: document.getElementById('temperature').value,
wind_speed: document.getElementById('windSpeed').value,
weather: document.getElementById('weather').value,
people_helped: document.getElementById('peopleHelped').value,
guard_location: document.getElementById('guardLocation').value,
id_user: session.id_user,
full_name: session.full_name
};

try {
// Selalu coba kirim ke server terlebih dahulu
const response = await fetch(`${API}/api/reports`, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(report)
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

document.getElementById('statusMessage').innerText =
  'Laporan berhasil dikirim ke server';

} catch (err) {
// Hanya jika server gagal dijangkau, simpan sebagai offline
const pending = JSON.parse(localStorage.getItem('pending_reports')) || [];

report.sync_status = 0;
pending.push(report);

localStorage.setItem('pending_reports', JSON.stringify(pending));

document.getElementById('statusMessage').innerText =
  'Offline - laporan disimpan dan akan disinkronkan otomatis';

}

// Bersihkan form
document.getElementById('temperature').value = '';
document.getElementById('windSpeed').value = '';
document.getElementById('peopleHelped').value = '';
document.getElementById('guardLocation').value = '';
}

function goHome() {
window.location.href = 'home.html';
}