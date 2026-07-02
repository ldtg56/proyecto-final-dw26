document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPerfil();
});

function cargarDatosPerfil() {
    const sesionInfo = localStorage.getItem('dmela_sesion');
    
    // Objeto por defecto simulando tu Mockup
    let datosUsuario = {
        nombres: "Eduardo Arturo",
        apellidos: "Samame Larrain",
        tipoDoc: "DNI",
        numDoc: "123456789",
        telefono: "987654321",
        fechaNacimiento: "6/7/6767", // Se deja como en el mockup, aunque el año es irreal 
        correo: "eduGamer67@gmail.com"
    };

    // Si tu inicio de sesión guarda más datos, los combinamos aquí
    if (sesionInfo) {
        try {
            const sesionParseada = JSON.parse(sesionInfo);
            // Si hay un nombre registrado en sesión, sobreescribimos los datos base
            if (sesionParseada.nombre) {
                // Lógica simple para dividir nombre completo en nombres y apellidos si es necesario
                let partesNombre = sesionParseada.nombre.split(' ');
                datosUsuario.nombres = partesNombre.slice(0, Math.ceil(partesNombre.length / 2)).join(' ');
                datosUsuario.apellidos = partesNombre.slice(Math.ceil(partesNombre.length / 2)).join(' ') || "Samame";
                datosUsuario.correo = sesionParseada.correo || datosUsuario.correo;
            }
        } catch (e) {
            console.error("Error leyendo datos de sesión para el perfil.");
        }
    }

    // 1. Actualizar Saludo Lateral
    const saludo = document.getElementById('dashboardSaludo');
    if (saludo) {
        // Tomamos solo el primer nombre
        saludo.innerText = `Hola, ${datosUsuario.nombres.split(' ')[0]}!`;
    }

    // 2. Actualizar Título Principal
    const tituloPerfil = document.getElementById('tituloPerfilCompleto');
    if (tituloPerfil) {
        tituloPerfil.innerText = `Perfil de ${datosUsuario.nombres.split(' ')[0]} ${datosUsuario.apellidos.split(' ')[0]}`;
    }

    // 3. Pintar Cajas de Información
    document.getElementById('perfilNombres').innerText = datosUsuario.nombres;
    document.getElementById('perfilApellidos').innerText = datosUsuario.apellidos;
    document.getElementById('perfilTipoDoc').innerText = datosUsuario.tipoDoc;
    document.getElementById('perfilNumDoc').innerText = datosUsuario.numDoc;
    document.getElementById('perfilTelefono').innerText = datosUsuario.telefono;
    document.getElementById('perfilNacimiento').innerText = datosUsuario.fechaNacimiento;
    document.getElementById('perfilCorreo').innerText = datosUsuario.correo;
}