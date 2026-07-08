document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPerfil();
});

function formatearFechaHermosa(fechaRaw) {
    if (!fechaRaw || fechaRaw === '-' || fechaRaw === 'undefined') return '-';

    if (fechaRaw.includes('-')) {
        const partes = fechaRaw.split('-');
        if (partes.length === 3) {
            let ano = partes[0];
            let mes = partes[1];
            let dia = partes[2];

            if (ano.length > 4) {
                ano = ano.endsWith('6') ? '2006' : ano.substring(0, 4);
            }
            return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
        }
    }

    if (fechaRaw.includes('/')) {
        const partes = fechaRaw.split('/');
        if (partes.length === 3) {
            let dia = partes[0].padStart(2, '0');
            let mes = partes[1].padStart(2, '0');
            let ano = partes[2];
            if (ano.length > 4) ano = ano.substring(0, 4);
            return `${dia}/${mes}/${ano}`;
        }
    }

    return fechaRaw;
}

function cargarDatosPerfil() {
    // 1. LEEMOS EXACTAMENTE LO QUE SE GUARDÓ AL CREAR LA CUENTA
    const sesionInfo = localStorage.getItem('dmela_sesion');

    // Si no hay cuenta iniciada, detenemos todo para no mostrar nada
    if (!sesionInfo) {
        if (document.getElementById('dashboardSaludo')) document.getElementById('dashboardSaludo').innerText = "Hola!";
        return;
    }

    try {
        // 2. EXTRAEMOS LA DATA REAL DEL USUARIO
        const sesion = JSON.parse(sesionInfo);

        const nombresReales = sesion.nombres || sesion.nombre || '-';
        const apellidosReales = sesion.apellidos || '-';
        const tipoDocReal = sesion.tipoDoc || '-';
        const numDocReal = sesion.numDoc || '-';
        const telefonoReal = sesion.telefono || '-';
        const correoReal = sesion.correo || '-';
        const fechaNacReal = sesion.fechaNacimiento || '-';

        // 3. ACTUALIZAMOS LOS TEXTOS EN PANTALLA
        const saludo = document.getElementById('dashboardSaludo');
        if (saludo && nombresReales !== '-') {
            saludo.innerText = `Hola, ${nombresReales.split(' ')[0]}!`;
        }

        // Título central
        const tituloPerfil = document.getElementById('tituloPerfilCompleto');
        if (tituloPerfil && nombresReales !== '-') {
            let primerNombre = nombresReales.split(' ')[0];
            let primerApellido = apellidosReales !== '-' ? apellidosReales.split(' ')[0] : '';
            tituloPerfil.innerText = `Perfil de ${primerNombre} ${primerApellido}`.trim();
        }

        // Pintar las cajas del perfil con la data 100% real
        if (document.getElementById('perfilNombres')) document.getElementById('perfilNombres').innerText = nombresReales;
        if (document.getElementById('perfilApellidos')) document.getElementById('perfilApellidos').innerText = apellidosReales;
        if (document.getElementById('perfilTipoDoc')) document.getElementById('perfilTipoDoc').innerText = tipoDocReal;
        if (document.getElementById('perfilNumDoc')) document.getElementById('perfilNumDoc').innerText = numDocReal;
        if (document.getElementById('perfilTelefono')) document.getElementById('perfilTelefono').innerText = telefonoReal;

        // Pasamos la fecha real por nuestro formateador
        if (document.getElementById('perfilNacimiento')) {
            document.getElementById('perfilNacimiento').innerText = formatearFechaHermosa(fechaNacReal);
        }

        if (document.getElementById('perfilCorreo')) document.getElementById('perfilCorreo').innerText = correoReal;

    } catch (e) {
        console.error("Error al cargar los datos del perfil:", e);
    }
}