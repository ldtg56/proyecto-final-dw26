// Mostrar/Ocultar contraseña de manera dinámica
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icono = document.getElementById(iconId);
    
    if (input.type === "password") {
        input.type = "text";
        icono.classList.remove("fa-eye");
        icono.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icono.classList.remove("fa-eye-slash");
        icono.classList.add("fa-eye");
    }
}

// Validaciones dinámicas según el tipo de documento
function actualizarReglasDocumento() {
    const tipoDoc = document.getElementById('regTipoDoc').value;
    const inputDoc = document.getElementById('regNumDoc');
    
    inputDoc.value = ""; 
    
    if (tipoDoc === 'DNI') {
        inputDoc.maxLength = 8;
        inputDoc.pattern = "\\d{8}";
        inputDoc.title = "El DNI debe tener exactamente 8 números";
        inputDoc.setAttribute("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
    } else if (tipoDoc === 'CE') {
        inputDoc.maxLength = 9;
        inputDoc.pattern = "\\d{9}";
        inputDoc.title = "El CE debe tener exactamente 9 números";
        inputDoc.setAttribute("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
    } else {
        inputDoc.maxLength = 12;
        inputDoc.pattern = "[a-zA-Z0-9]{8,12}";
        inputDoc.title = "El Pasaporte debe tener entre 8 y 12 caracteres alfanuméricos";
        inputDoc.setAttribute("oninput", "this.value = this.value.replace(/[^a-zA-Z0-9]/g, '')");
    }
}

// Lógica de registro enfocada SOLO en dmela_sesion
function registrarUsuario(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Capturamos los datos del formulario
    const nombres = document.getElementById('regNombres').value;
    const apellidos = document.getElementById('regApellidos').value;
    const tipoDoc = document.getElementById('regTipoDoc').value;
    const numDoc = document.getElementById('regNumDoc').value;
    const telefono = document.getElementById('regTelefono').value;
    const fechaNac = document.getElementById('regFechaNac').value;
    const correo = document.getElementById('regCorreo').value;
    const pass1 = document.getElementById('regPassword').value;
    const pass2 = document.getElementById('regConfirmPassword').value;

    // Validación de contraseñas
    if (pass1 !== pass2) {
        alert("Las contraseñas no coinciden. Por favor, verifica.");
        return;
    }

    if (pass1.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    // Construimos EXACTAMENTE la estructura de dmela_sesion que proporcionaste
    const sesionUnica = {
        logueado: true,
        nombre: `${nombres} ${apellidos}`,
        nombres: nombres,
        apellidos: apellidos,
        tipoDoc: tipoDoc,
        numDoc: numDoc,
        telefono: telefono,
        fechaNacimiento: fechaNac,
        correo: correo
    };

    // Guardamos y sobrescribimos directamente dmela_sesion
    localStorage.setItem('dmela_sesion', JSON.stringify(sesionUnica));

    // (Opcional) Si tu vista de login requiere validar contra algo, puedes guardarlo 
    // también en dmela_usuarios, de lo contrario esto es suficiente para el dashboard.
    let usuariosBD = JSON.parse(localStorage.getItem('dmela_usuarios')) || [];
    const nuevoUsuarioParaBD = { ...sesionUnica, password: pass1, email: correo };
    usuariosBD.push(nuevoUsuarioParaBD);
    localStorage.setItem('dmela_usuarios', JSON.stringify(usuariosBD));

    alert("¡Cuenta creada con éxito! Bienvenido a D'Mela.");
    
    // Redirigir al dashboard (donde las otras vistas ya leen dmela_sesion)
    window.location.href = "usuario_dashboard_inicio.html";
}