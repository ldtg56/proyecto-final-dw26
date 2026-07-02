/**
 * Proceso de validación para la recuperación de contraseña
 */
function restablecerContrasena() {
    const email = document.getElementById('recuperarEmail').value.trim();
    const recaptcha = document.getElementById('recaptchaRecuperar').checked;

    // 1. Validar que el campo no esté vacío
    if (!email) {
        alert('Ingresa tu correo electrónico primero para poder enviarte el enlace.');
        document.getElementById('recuperarEmail').focus();
        return;
    }

    // 2. Validar una estructura básica de correo electrónico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert('Por favor, ingresa un formato de correo válido (ejemplo: cliente@correo.com).');
        document.getElementById('recuperarEmail').focus();
        return;
    }

    // 3. Validar el reCAPTCHA simulado
    if (!recaptcha) {
        alert('No te olvides de marcar la casilla de "No soy un robot".');
        return;
    }

    // 4. Éxito: Simulación del envío de datos
    alert(`¡Todo listo! Hemos enviado un enlace de restauración a: ${email}\nRevisa tu bandeja de entrada o la carpeta de spam.`);
    
    // Redirigir automáticamente al Login tras aceptar la alerta
    window.location.href = 'login.html';
}