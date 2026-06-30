// =================================================================
// MANEJO GLOBAL DE SESIÓN - D'MELA
// Este script revisa si hay sesión activa y actualiza el header
// Debe incluirse en TODAS las páginas que tengan el header con
// el dropdown de usuario (id="menuUsuarioDropdown")
// =================================================================

function cerrarSesion() {
    localStorage.removeItem('dmela_sesion');
    window.location.href = 'login.html';
}

function actualizarHeaderSegunSesion() {
    const sesion = localStorage.getItem('dmela_sesion');
    const menuUsuario = document.getElementById('menuUsuarioDropdown');

    if (!menuUsuario) return; // si la página no tiene ese dropdown, no hace nada

    if (sesion) {
        const datos = JSON.parse(sesion);

        menuUsuario.innerHTML = `
            <li class="dropdown-header text-muted small px-3">Hola, ${datos.nombre}</li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="usuario_dashboard_inicio.html">Mi Cuenta</a></li>
            <li><a class="dropdown-item" href="#">Historial de Compras</a></li>
            <li><a class="dropdown-item" href="#">Mis Cupones</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger fw-semibold" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
        `;
    } else {
        menuUsuario.innerHTML = `
            <li><a class="dropdown-item" href="login.html">Iniciar Sesión</a></li>
            <li><a class="dropdown-item" href="registro.html">Crear Cuenta</a></li>
            <li><a class="dropdown-item" href="#">Editar Contraseña</a></li>
            <li><a class="dropdown-item" href="#">Recuperar Contraseña</a></li>
        `;
    }
}

document.addEventListener('DOMContentLoaded', actualizarHeaderSegunSesion);