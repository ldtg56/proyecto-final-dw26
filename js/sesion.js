function cerrarSesion() {
    localStorage.removeItem('dmela_sesion');
    window.location.href = 'login.html';
}

function actualizarHeaderSegunSesion() {
    const sesion = localStorage.getItem('dmela_sesion');
    const menuUsuario = document.getElementById('menuUsuarioDropdown');

    if (!menuUsuario) return;

    if (sesion) {
        try {
            const datos = JSON.parse(sesion);
            if (datos.logueado) {
                menuUsuario.innerHTML = `
                    <li class="dropdown-header text-muted small px-3">Hola, ${datos.nombre}</li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="usuario_dashboard_inicio.html">Mi Cuenta</a></li>
                    <li><a class="dropdown-item" href="#">Historial de Compras</a></li>
                    <li><a class="dropdown-item" href="#">Mis Cupones</a></li>
                    <li><a class="dropdown-item" href="editarcontraseña.html">Editar Contraseña</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger fw-semibold" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
                `;
                return;
            }
        } catch(e) {
            localStorage.removeItem('dmela_sesion');
        }
    }

    menuUsuario.innerHTML = `
        <li><a class="dropdown-item" href="login.html">Iniciar Sesión</a></li>
        <li><a class="dropdown-item" href="crearCuenta.html">Crear Cuenta</a></li>
        <li><a class="dropdown-item" href="editarcontraseña.html">Editar Contraseña</a></li>
        <li><a class="dropdown-item" href="recuperarcontraseña.html">Recuperar Contraseña</a></li>
    `;
}

document.addEventListener('DOMContentLoaded', actualizarHeaderSegunSesion);