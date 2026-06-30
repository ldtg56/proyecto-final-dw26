const USUARIOS_KEY = 'dmela_usuarios';
const SESION_KEY = 'dmela_sesion';

function togglePassword(inputId, iconoId) {
    const input = document.getElementById(inputId);
    const icono = document.getElementById(iconoId);

    if (input.type === 'password') {
        input.type = 'text';
        icono.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icono.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function realizarCambioContrasena() {
    const passActual = document.getElementById('passActual').value.trim();
    const passNueva = document.getElementById('passNueva').value.trim();

    if (!passActual || !passNueva) {
        alert('⚠️ Por favor, completa ambos campos.');
        return;
    }

    if (passNueva.length < 6) {
        alert('⚠️ La nueva contraseña debe tener al menos 6 caracteres.');
        return;
    }

    if (passActual === passNueva) {
        alert('⚠️ La nueva contraseña debe ser diferente a la actual.');
        return;
    }

    const sesion = JSON.parse(localStorage.getItem(SESION_KEY));
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

    const indiceUsuario = usuarios.findIndex(u => u.email === sesion.email);

    if (indiceUsuario === -1) {
        alert('❌ No se encontró tu cuenta. Vuelve a iniciar sesión.');
        window.location.href = 'login.html';
        return;
    }

    if (usuarios[indiceUsuario].password !== passActual) {
        alert('❌ La contraseña actual no es correcta.');
        document.getElementById('passActual').focus();
        return;
    }

    // Actualizar la contraseña
    usuarios[indiceUsuario].password = passNueva;
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));

    alert('✅ Tu contraseña se actualizó correctamente.');

    document.getElementById('passActual').value = '';
    document.getElementById('passNueva').value = '';
}

// Protección: si no hay sesión activa, redirige a login
document.addEventListener('DOMContentLoaded', () => {
    const sesion = localStorage.getItem(SESION_KEY);
    if (!sesion) {
        window.location.href = 'login.html';
    }
});