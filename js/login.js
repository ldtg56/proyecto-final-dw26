// Usuarios registrados de prueba (puedes agregar más)
const USUARIOS_KEY = 'dmela_usuarios';

// Crea un usuario de prueba si no existe ninguno
function inicializarUsuarios() {
    const existe = localStorage.getItem(USUARIOS_KEY);
    if (!existe) {
        const usuariosPrueba = [
            { email: 'admin@dmela.com', password: '123456', nombre: 'Admin' }
        ];
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosPrueba));
    }
}

function togglePassword() {
    const input = document.getElementById('loginPassword');
    const icono = document.getElementById('iconoOjo');

    if (input.type === 'password') {
        input.type = 'text';
        icono.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icono.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function iniciarSesion() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const recaptcha = document.getElementById('recaptcha').checked;

    // Validaciones
    if (!email) {
        alert('Por favor, ingresa tu correo electrónico.');
        document.getElementById('loginEmail').focus();
        return;
    }

    if (!password) {
        alert('Por favor, ingresa tu contraseña.');
        document.getElementById('loginPassword').focus();
        return;
    }

    if (!recaptcha) {
        alert('Por favor, confirma que no eres un robot.');
        return;
    }

    // Buscar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

    if (!usuarioEncontrado) {
        alert('Correo o contraseña incorrectos. Intenta nuevamente.');
        return;
    }

    // Guardar sesión activa leyendo los datos reales del usuario logueado
    localStorage.setItem('dmela_sesion', JSON.stringify({
        email: usuarioEncontrado.email,
        nombre: usuarioEncontrado.nombre, // <-- ESTO LO HACE DINÁMICO
        logueado: true
    }));

    alert(`¡Bienvenido, ${usuarioEncontrado.nombre}!`);
    window.location.href = 'paginaPrincipal.html';
}

// Al cargar
document.addEventListener('DOMContentLoaded', () => {
    inicializarUsuarios();

    // Si ya está logueado, redirigir directo
    const sesion = localStorage.getItem('dmela_sesion');
    if (sesion) {
        const datos = JSON.parse(sesion);
        if (datos.logueado) {
            window.location.href = 'index.html';
        }
    }
});