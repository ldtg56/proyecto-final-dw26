document.addEventListener('DOMContentLoaded', () => {
    // 1. Validar si el usuario tiene sesión activa ANTES de dejarlo ver la página
    if (typeof requerirSesion === 'function') {
        const autenticado = requerirSesion();
        
        // Si NO está autenticado, ocultamos todo el contenido principal y detenemos el código
        if (!autenticado) {
            const mainContent = document.querySelector('main');
            if(mainContent) mainContent.style.display = 'none';
            return; 
        }
    }

    // 2. Inicializar los cálculos y la vista del carrito (solo si hay sesión)
    cargarResumenPedido();
    actualizarTotal();
});

// --- FUNCIONES DE INTERFAZ ---
function alternarDelivery() {
    const checkDelivery = document.getElementById('delivery').checked;
    const camposDelivery = document.getElementById('camposDelivery');
    const costoEnvioText = document.getElementById('checkoutCostoEnvioText');
    const etiquetaEnvio = document.getElementById('checkoutEtiquetaEnvio');

    if (checkDelivery) {
        camposDelivery.classList.remove('d-none');
        costoEnvioText.innerText = 'S/ 15.00';
        etiquetaEnvio.innerText = 'Costo de envío (Delivery)';
    } else {
        camposDelivery.classList.add('d-none');
        costoEnvioText.innerText = 'S/ 0.00';
        etiquetaEnvio.innerText = 'Recojo en tienda';
    }
    actualizarTotal();
}

function alternarPago() {
    const radioTarjeta = document.getElementById('tarjeta').checked;
    const radioBilletera = document.getElementById('billetera').checked;
    const radioEfectivo = document.getElementById('efectivo').checked;

    const cajaTarjeta = document.getElementById('cajaTarjeta');
    const cajaBilletera = document.getElementById('cajaBilletera');
    const cajaEfectivo = document.getElementById('cajaEfectivo');

    cajaTarjeta.classList.add('d-none');
    cajaBilletera.classList.add('d-none');
    cajaEfectivo.classList.add('d-none');

    if (radioTarjeta) {
        cajaTarjeta.classList.remove('d-none');
    } else if (radioBilletera) {
        cajaBilletera.classList.remove('d-none');
    } else if (radioEfectivo) {
        cajaEfectivo.classList.remove('d-none');
    }
}

// --- LÓGICA DEL CARRITO Y TOTALES ---
function cargarResumenPedido() {
    const subtotalText = document.getElementById('checkoutSubtotalText');
    const subtotal = 45.00; 
    subtotalText.innerText = `S/ ${subtotal.toFixed(2)}`;
}

function actualizarTotal() {
    const subtotalStr = document.getElementById('checkoutSubtotalText').innerText.replace('S/ ', '');
    const subtotal = parseFloat(subtotalStr) || 0;

    const costoEnvioStr = document.getElementById('checkoutCostoEnvioText').innerText.replace('S/ ', '');
    const costoEnvio = parseFloat(costoEnvioStr) || 0;

    const total = subtotal + costoEnvio;

    const puntosText = document.getElementById('checkoutPuntosText');
    puntosText.innerText = `+ ${Math.floor(total)} pts`;

    const totalFinalText = document.getElementById('checkoutTotalFinalText');
    totalFinalText.innerText = `S/ ${total.toFixed(2)}`;
}

// --- PROCESAR PAGO ---
function procesarPago(event) {
    event.preventDefault();

    // DOBLE CANDADO: Verificamos de nuevo la sesión justo al hacer clic
    if (typeof requerirSesion === 'function') {
        if (!requerirSesion()) return;
    }

    const nombre = document.getElementById('contactoNombre').value.trim();
    const email = document.getElementById('contactoEmail').value.trim();
    
    if (nombre === '' || email === '') {
        alert('Por favor, completa tu nombre y correo electrónico.');
        return;
    }

    if (document.getElementById('delivery').checked) {
        const direccion = document.getElementById('dirEnvio').value.trim();
        const distrito = document.getElementById('dirDistrito').value;
        
        if (direccion === '' || distrito === '') {
            alert('Por favor, ingresa tu dirección y selecciona un distrito para el delivery.');
            return;
        }
    }

    const botonPagar = document.getElementById('btnPagarFinal');
    botonPagar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    botonPagar.disabled = true;

    setTimeout(() => {
        alert(`¡Gracias por tu compra, ${nombre}! Tu pedido en D'Mela ha sido confirmado.`);
        localStorage.removeItem('dmela_carrito'); 
        window.location.href = 'index.html'; 
    }, 2000);
}