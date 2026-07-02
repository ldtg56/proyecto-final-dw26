const USUARIOS_KEY = 'dmela_usuarios';
const SESION_KEY = 'dmela_sesion';

function togglePassword(inputId, iconoId) {
    const input = document.getElementById(inputId);
    const icono = document.getElementById(iconoId);

    if (input.type === 'password') {
        input.type = 'text';
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
    }
}

function realizarCambioContrasena() {
    const passActual = document.getElementById('passActual').value.trim();
    const passNueva = document.getElementById('passNueva').value.trim();

    // Validaciones básicas
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

    // Traer datos de sesión y base de datos
    const sesion = JSON.parse(localStorage.getItem(SESION_KEY));
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

    // CORRECCIÓN: Compatibilidad para buscar por 'correo' o por 'email'
    const correoUsuarioActivo = sesion.correo || sesion.email;
    const indiceUsuario = usuarios.findIndex(u => u.correo === correoUsuarioActivo || u.email === correoUsuarioActivo);

    if (indiceUsuario === -1) {
        alert('❌ No se encontró tu cuenta en la base de datos. Vuelve a iniciar sesión.');
        window.location.href = 'login.html';
        return;
    }

    // Verificar que la contraseña actual sea la correcta
    if (usuarios[indiceUsuario].password !== passActual) {
        alert('❌ La contraseña actual no es correcta.');
        document.getElementById('passActual').focus();
        return;
    }

    // Actualizar la contraseña en la base de datos
    usuarios[indiceUsuario].password = passNueva;
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));

    alert('✅ Tu contraseña se actualizó correctamente.');

    // Limpiar campos
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