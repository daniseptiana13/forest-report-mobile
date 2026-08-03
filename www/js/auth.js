const API = 'http://192.168.11.195:3000';

window.onload = function () {
const session = localStorage.getItem('forest_session');
if (session) {
window.location.href = 'home.html';
}
};

async function login() {
const id = document.getElementById('userId').value.trim();

if (id.length !== 8) {
alert('ID User harus 8 digit');
return;
}

try {
const response = await fetch("${API}/api/users/login/${id}");
const data = await response.json();

if (data.success) {
  localStorage.setItem(
    'forest_session',
    JSON.stringify(data.user)
  );

  localStorage.setItem(
    'last_login_user',
    JSON.stringify(data.user)
  );

  window.location.href = 'home.html';
  return;
}

alert('ID User tidak ditemukan');

} catch (err) {
const offlineUser = JSON.parse(
localStorage.getItem('last_login_user')
);

if (offlineUser && offlineUser.id_user === id) {
  localStorage.setItem(
    'forest_session',
    JSON.stringify(offlineUser)
  );

  alert('Masuk menggunakan data offline');
  window.location.href = 'home.html';
  return;
}

alert('Server tidak dapat dijangkau dan data offline tidak tersedia');

}
}