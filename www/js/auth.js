const API = 'http://192.168.11.195:3000';

window.onload = function () {
const session = localStorage.getItem('forest_session');
if (session) {
window.location.href = 'home.html';
}
};

function reloadApp() {
if (navigator.onLine) {
alert('Memuat ulang aplikasi (Mode Online)');
} else {
alert('Memuat ulang aplikasi (Mode Offline)');
}

location.reload();
}

async function login() {
const id = document.getElementById('userId').value.trim();

if (id.length !== 8) {
alert('ID User harus 8 digit');
return;
}

// Jika perangkat offline, langsung gunakan data lokal
if (!navigator.onLine) {
const offlineUser = JSON.parse(localStorage.getItem('last_login_user'));

if (offlineUser && offlineUser.id_user === id) {
  localStorage.setItem('forest_session', JSON.stringify(offlineUser));
  alert('Masuk menggunakan data offline');
  window.location.href = 'home.html';
  return;
}

alert('Perangkat sedang offline dan data login belum tersedia');
return;

}

try {
const response = await fetch(`${API}/api/users/login/${id}`, {
method: 'GET',
headers: {
'Content-Type': 'application/json'
}
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const data = await response.json();

if (data.success && data.user) {
  // Simpan session
  localStorage.setItem('forest_session', JSON.stringify(data.user));
  localStorage.setItem('last_login_user', JSON.stringify(data.user));

  // Paksa sinkron semua laporan yang masih antre
  if (navigator.onLine && typeof syncPendingReports === 'function') {
    try {
      await syncPendingReports();
    } catch (e) {
      console.log('Sinkronisasi awal gagal:', e);
    }
  }

  // Masuk ke halaman utama
  window.location.href = 'home.html';
  return;
}

alert('ID User tidak ditemukan');

} catch (err) {
// Jika server tidak bisa dijangkau, coba gunakan data lokal
const offlineUser = JSON.parse(localStorage.getItem('last_login_user'));

if (offlineUser && offlineUser.id_user === id) {
  localStorage.setItem('forest_session', JSON.stringify(offlineUser));
  alert('Masuk menggunakan data offline');
  window.location.href = 'home.html';
  return;
}

alert('Server tidak dapat dijangkau dan data offline tidak tersedia');

}
}