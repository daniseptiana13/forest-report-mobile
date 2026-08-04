const API = 'http://192.168.11.195:3000';

function getPendingReports() {
return JSON.parse(localStorage.getItem('pending_reports')) || [];
}

function savePendingReports(reports) {
localStorage.setItem('pending_reports', JSON.stringify(reports));
}

async function syncPendingReports() {
if (!navigator.onLine) return;

const pending = getPendingReports();
if (pending.length === 0) return;

let successCount = 0;
const remaining = [];

for (const report of pending) {
try {
const response = await fetch(`${API}/api/reports`, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(report)
});

  if (response.ok) {
    successCount++;
  } else {
    remaining.push(report);
  }
} catch (err) {
  remaining.push(report);
}

}

savePendingReports(remaining);

if (successCount > 0) {
console.log(`${successCount} laporan berhasil disinkronkan`);

// Beri tahu halaman lain agar refresh data
localStorage.setItem('sync_updated', Date.now().toString());

}
}

// Jalankan saat file dimuat
syncPendingReports();

// Jalankan setiap 5 detik
setInterval(syncPendingReports, 5000);

// Jalankan saat koneksi kembali online
window.addEventListener('online', syncPendingReports);

// Jalankan saat halaman kembali aktif
document.addEventListener('visibilitychange', () => {
if (!document.hidden) {
syncPendingReports();
}
});