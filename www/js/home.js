const session = JSON.parse(localStorage.getItem('forest_session'));

if (!session) {
window.location.href = 'index.html';
}

function updateStatus() {
const status = navigator.onLine
? '<span style="color:green;">🟢 Online</span>'
: '<span style="color:#d97706;">🟡 Offline</span>';

document.getElementById('welcomeText').innerHTML = `Selamat datang <b>${session.full_name}</b><br> ID Login: <b>${session.id_user}</b><br> Status: ${status}`;
}

updateStatus();

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

function goReport() {
window.location.href = 'report.html';
}

function goReports() {
window.location.href = 'reports.html';
}

function logout() {
localStorage.removeItem('forest_session');
window.location.href = 'index.html';
}