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
                    <li><a class="dropdown-item" href="usuario_dashboard_pedidos">Historial de Compras</a></li>
                    <li><a class="dropdown-item" href="usuario_dashboard_cupones">Mis Cupones</a></li>
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
    `;
}

function requerirSesion() {
    const sesion = localStorage.getItem('dmela_sesion');
    let usuarioAutenticado = false;

    if (sesion) {
        try {
            const datos = JSON.parse(sesion);
            if (datos.logueado) {
                usuarioAutenticado = true;
                
                const inputNombre = document.getElementById('contactoNombre');
                const inputEmail = document.getElementById('contactoEmail');
                
                if (inputNombre && datos.nombre) inputNombre.value = datos.nombre;
                if (inputEmail && datos.email) inputEmail.value = datos.email; 
            }
        } catch(e) {
            console.error("Error al leer la sesión", e);
            localStorage.removeItem('dmela_sesion');
        }
    }

    if (!usuarioAutenticado) {
        alert("¡Hola! Para finalizar tu compra, primero debes iniciar sesión.");
        window.location.href = 'login.html';
        return false; 
    }
    
    return true;
}

document.addEventListener('DOMContentLoaded', actualizarHeaderSegunSesion);