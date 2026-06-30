const STORAGE_KEY = 'dmela_carrito_compras';
const TARIFA_DELIVERY = 15.00;

function alternarPago() {
    const esTarjeta = document.getElementById('tarjeta').checked;
    const esBilletera = document.getElementById('billetera').checked;
    const esEfectivo = document.getElementById('efectivo').checked;

    document.getElementById('cajaTarjeta').classList.toggle('d-none', !esTarjeta);
    document.getElementById('cajaBilletera').classList.toggle('d-none', !esBilletera);
    document.getElementById('cajaEfectivo').classList.toggle('d-none', !esEfectivo);
}

function alternarDelivery() {
    const esDelivery = document.getElementById('delivery').checked;
    const camposDir = document.getElementById('camposDelivery');

    if (esDelivery) {
        camposDir.classList.remove('d-none');
    } else {
        camposDir.classList.add('d-none');
    }

    renderizarResumenCheckout();
}

function renderizarResumenCheckout() {
    const memoria = localStorage.getItem(STORAGE_KEY);
    const carrito = memoria ? JSON.parse(memoria) : [];

    const contenedor = document.getElementById('contenedorResumenCheckout');
    const btnPagar = document.getElementById('btnPagarFinal');

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4">
                <i class="fa-solid fa-basket-shopping fs-1 text-secondary mb-3 opacity-50"></i>
                <p class="text-muted fw-bold mb-0">No hay productos en tu pedido.</p>
                <a href="producto.html" class="small text-danger text-decoration-underline mt-2 d-inline-block">Volver al catálogo</a>
            </div>
        `;
        btnPagar.classList.add('disabled');
        btnPagar.style.pointerEvents = 'none';
        btnPagar.style.opacity = '0.5';

        document.getElementById('checkoutSubtotalText').innerText = 'S/ 0.00';
        document.getElementById('checkoutCostoEnvioText').innerText = 'S/ 0.00';
        document.getElementById('checkoutTotalFinalText').innerText = 'S/ 0.00';
        return;
    }

    btnPagar.classList.remove('disabled');
    btnPagar.style.pointerEvents = 'auto';
    btnPagar.style.opacity = '1';

    let sumaSubtotal = 0;
    let sumaPuntos = 0; // NUEVA VARIABLE PARA LOS PUNTOS

    carrito.forEach(prod => {
        const subtotalProd = prod.precio * prod.cantidad;
        sumaSubtotal += subtotalProd;

        // Calculamos los puntos
        const puntosProd = Math.floor(prod.precio) * prod.cantidad;
        sumaPuntos += puntosProd;

        // =========================================================
        // 1. NUEVA LÓGICA DE DETALLES (Dinámica y sin saltos de línea)
        // =========================================================
        let filasDetalle = '';

        if (prod.detalles && Object.keys(prod.detalles).length > 0) {
            // Convierte los detalles en texto continuo separado por barras (|)
            filasDetalle = Object.entries(prod.detalles)
                .map(([clave, valor]) => `<span class="d-inline-block"><strong class="fw-bold">${clave}:</strong> ${valor}</span>`)
                .join('<span class="mx-1 opacity-50">|</span>');
        } else if (prod.tipo === 'combo') {
            filasDetalle = `<span class="d-inline-block"><strong class="fw-bold">Categoría:</strong> Combo Especial</span>`;
        } else {
            filasDetalle = `<span class="d-inline-block"><strong class="fw-bold">Categoría:</strong> Adicionales</span>`;
        }

        // =========================================================
        // 2. NUEVO DISEÑO DE TARJETA (Estructura más compacta)
        // =========================================================
        const tarjetaMini = `
            <div class="d-flex gap-3 align-items-start mb-3 pb-3 border-bottom border-light">
                
                <div style="flex-shrink: 0;">
                    <img src="${prod.imagen}" alt="${prod.nombre}" class="img-fluid rounded border shadow-sm" style="width: 65px; height: 65px; object-fit: cover; background-color: #f8f9fa;">
                </div>
                
                <div class="flex-grow-1 min-vw-0">
                    <div class="d-flex justify-content-between align-items-start mb-1 gap-2">
                        <h6 class="mb-0 fw-bold text-dark lh-sm" style="font-size: 0.95rem;">${prod.nombre}</h6>
                        <span class="fw-bold text-nowrap" style="color: #8C1616; font-size: 0.95rem;">S/ ${subtotalProd.toFixed(2)}</span>
                    </div>
                    
                    <div class="text-secondary mb-2 text-wrap" style="font-size: 0.78rem; line-height: 1.5;">
                        ${filasDetalle}
                    </div>
                    
                    <div class="d-flex align-items-center">
                        <span class="fw-bold text-dark px-2 py-1 rounded bg-light border shadow-sm" style="font-size: 0.75rem;">Cant: ${prod.cantidad}</span>
                    </div>
                </div>
                
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', tarjetaMini);
    });

    const esDelivery = document.getElementById('delivery').checked;
    const costoFinalEnvio = esDelivery ? TARIFA_DELIVERY : 0.00;
    const totalPagar = sumaSubtotal + costoFinalEnvio;

    document.getElementById('checkoutSubtotalText').innerText = `S/ ${sumaSubtotal.toFixed(2)}`;
    document.getElementById('checkoutEtiquetaEnvio').innerText = esDelivery ? 'Costo de envío (Delivery)' : 'Recojo en tienda';
    document.getElementById('checkoutCostoEnvioText').innerText = esDelivery ? `S/ ${costoFinalEnvio.toFixed(2)}` : 'Gratis';
    document.getElementById('checkoutTotalFinalText').innerText = `S/ ${totalPagar.toFixed(2)}`;

    const elemPuntos = document.getElementById('checkoutPuntosText');
    if (elemPuntos) {
        elemPuntos.innerText = `+ ${sumaPuntos} pts`;
    }
    localStorage.setItem('dmela_puntos_pendientes', sumaPuntos);
}


function procesarPago() {

    const email = document.getElementById('contactoEmail');
    const telefono = document.getElementById('contactoTelefono');

    if (!email.value.trim() || !telefono.value.trim()) {
        alert("⚠️ Por favor, ingresa tu correo electrónico y teléfono de contacto.");
        if (!email.value.trim()) email.focus();
        else telefono.focus();
        return;
    }

    const esDelivery = document.getElementById('delivery').checked;
    if (esDelivery) {
        const envio = document.getElementById('dirEnvio');
        const calle = document.getElementById('dirCalle');
        const distrito = document.getElementById('dirDistrito');

        if (!envio.value.trim() || !calle.value.trim() || !distrito.value.trim()) {
            alert("⚠️ Por favor, completa los campos obligatorios de tu dirección (Dirección, Calle/Avenida y Distrito).");
            if (!envio.value.trim()) envio.focus();
            else if (!calle.value.trim()) calle.focus();
            else distrito.focus();
            return;
        }
    }

    const fecha = document.getElementById('fechaEntrega');
    if (!fecha.value) {
        alert("⚠️ Por favor, selecciona la fecha para la entrega o recojo de tu pedido.");
        fecha.focus();
        return;
    }

    const esTarjeta = document.getElementById('tarjeta').checked;
    if (esTarjeta) {
        const numTarjeta = document.getElementById('tarjetaNum');
        const vencTarjeta = document.getElementById('tarjetaVenc');
        const cvcTarjeta = document.getElementById('tarjetaCVC');

        if (!numTarjeta.value.trim() || !vencTarjeta.value.trim() || !cvcTarjeta.value.trim()) {
            alert("⚠️ Por favor, completa todos los datos de tu Tarjeta de Crédito/Débito.");
            if (!numTarjeta.value.trim()) numTarjeta.focus();
            else if (!vencTarjeta.value.trim()) vencTarjeta.focus();
            else cvcTarjeta.focus();
            return;
        }
    }

    alert("✅ Todos los datos son correctos. Procesando pago seguro... ¡Redirigiendo a la confirmación!");

    // Guardar nombre desde el email
    const emailValue = document.getElementById('contactoEmail').value;
    const nombreFormateado = emailValue.split('@')[0].charAt(0).toUpperCase() + emailValue.split('@')[0].slice(1);
    localStorage.setItem('nombreComprador', nombreFormateado);

    // Generar y guardar número de orden al momento de pagar
    const fecha2 = new Date();
    const numOrden = `${fecha2.getFullYear().toString().slice(2)}${(fecha2.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 90000) + 10000}`;
    localStorage.setItem('numeroOrden', numOrden);

    // Copiar carrito al puente
    const carritoActual = localStorage.getItem(STORAGE_KEY);
    if (carritoActual) {
        localStorage.setItem('carritoBoleta', carritoActual);
    }

    // Guardar costo de envío real
    localStorage.setItem('costoEnvio', esDelivery ? '15.00' : '0.00');

    const puntosPendientes = parseInt(localStorage.getItem('dmela_puntos_pendientes')) || 0;
    const puntosActuales = parseInt(localStorage.getItem('dmela_puntos_totales')) || 0;

    // Sumamos los puntos actuales con los que acaba de ganar
    localStorage.setItem('dmela_puntos_totales', puntosActuales + puntosPendientes);

    // Limpiamos los puntos en tránsito para que no se dupliquen
    localStorage.removeItem('dmela_puntos_pendientes');

    window.location.href = 'confirmacion.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarResumenCheckout();
});