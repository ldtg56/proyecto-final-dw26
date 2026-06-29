// =================================================================
// MOTOR DE CHECKOUT Y VALIDACIONES - D'MELA
// =================================================================
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

// Oculta las cajas de dirección si eligen Recojo en Tienda y recalcula totales
function alternarDelivery() {
    const esDelivery = document.getElementById('delivery').checked;
    const camposDir = document.getElementById('camposDelivery');

    if (esDelivery) {
        camposDir.classList.remove('d-none');
    } else {
        camposDir.classList.add('d-none');
    }

    // Al cambiar la opción de entrega, se debe volver a calcular la matemática
    renderizarResumenCheckout();
}

// Lee el carrito y pinta la columna derecha
function renderizarResumenCheckout() {
    const memoria = localStorage.getItem(STORAGE_KEY);
    const carrito = memoria ? JSON.parse(memoria) : [];

    const contenedor = document.getElementById('contenedorResumenCheckout');
    const btnPagar = document.getElementById('btnPagarFinal');

    contenedor.innerHTML = '';

    // 1. SI ESTÁ VACÍO
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

    // 2. SI HAY PRODUCTOS
    btnPagar.classList.remove('disabled');
    btnPagar.style.pointerEvents = 'auto';
    btnPagar.style.opacity = '1';

    let sumaSubtotal = 0;

    carrito.forEach(prod => {
        const subtotalProd = prod.precio * prod.cantidad;
        sumaSubtotal += subtotalProd;

        let filasDetalle = '';

        if (prod.tipo === 'torta' || !prod.tipo) {
            const tam = prod.detalles?.Tamaño || 'Mediano';
            const masa = prod.detalles?.Masa || 'Clásica';
            const rel = prod.detalles?.Relleno || 'Fudge';
            const msj = prod.detalles?.Mensaje || 'Sin mensaje';
            filasDetalle = `
                <div><strong class="fw-bold">Tamaño:</strong> ${tam}</div>
                <div><strong class="fw-bold">Masa:</strong> ${masa}</div>
                <div><strong class="fw-bold">Relleno:</strong> ${rel}</div>
                <div><strong class="fw-bold">Mensaje:</strong> "${msj}"</div>
            `;
        } else if (prod.tipo === 'combo') {
            filasDetalle = `<div><strong class="fw-bold">Incluye:</strong> ${prod.detalles?.Incluye}</div>`;
        } else {
            filasDetalle = `<div><strong class="fw-bold">Categoría:</strong> Adicionales</div>`;
        }

        // Maquetación idéntica a tu captura (Imagen pequeña, textos limpios, sin botones de + y -)
        const tarjetaMini = `
            <div class="d-flex gap-3 align-items-start mb-3 pb-3 border-bottom border-light">
                <img src="${prod.imagen}" alt="${prod.nombre}" class="img-fluid rounded border shadow-sm" style="width: 75px; height: 75px; object-fit: cover; background-color: #fff;">
                <div class="flex-grow-1">
                    <p class="mb-1 fw-bold text-dark lh-sm" style="font-size: 0.9rem;">${prod.nombre}</p>
                    <div class="text-secondary mb-2" style="font-size: 0.78rem; line-height: 1.35;">
                        ${filasDetalle}
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="fw-bold text-dark px-2 py-1 rounded bg-light border" style="font-size: 0.75rem;">Cant: ${prod.cantidad}</span>
                        <span class="fw-bold" style="color: #8C1616; font-size: 0.9rem;">S/ ${subtotalProd.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', tarjetaMini);
    });

    // 3. MATEMÁTICA FINAL (Evaluando si el delivery está activo)
    const esDelivery = document.getElementById('delivery').checked;
    const costoFinalEnvio = esDelivery ? TARIFA_DELIVERY : 0.00;
    const totalPagar = sumaSubtotal + costoFinalEnvio;

    document.getElementById('checkoutSubtotalText').innerText = `S/ ${sumaSubtotal.toFixed(2)}`;

    // Cambia la palabra y el monto según el método
    document.getElementById('checkoutEtiquetaEnvio').innerText = esDelivery ? 'Costo de envío (Delivery)' : 'Recojo en tienda';
    document.getElementById('checkoutCostoEnvioText').innerText = esDelivery ? `S/ ${costoFinalEnvio.toFixed(2)}` : 'Gratis';

    document.getElementById('checkoutTotalFinalText').innerText = `S/ ${totalPagar.toFixed(2)}`;
}

// Simulación de pasarela con validación estricta
function procesarPago() {

    // 1. Validar Datos de Contacto (Siempre obligatorios)
    const email = document.getElementById('contactoEmail');
    const telefono = document.getElementById('contactoTelefono');

    if (!email.value.trim() || !telefono.value.trim()) {
        alert("⚠️ Por favor, ingresa tu correo electrónico y teléfono de contacto.");
        if (!email.value.trim()) email.focus();
        else telefono.focus();
        return; // Detiene el código aquí
    }

    // 2. Validar Datos de Dirección (Solo si es Delivery)
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

    // 3. Validar Fecha de Entrega/Recojo (Siempre obligatoria)
    const fecha = document.getElementById('fechaEntrega');
    if (!fecha.value) {
        alert("⚠️ Por favor, selecciona la fecha para la entrega o recojo de tu pedido.");
        fecha.focus();
        return;
    }

    // 4. Validar Método de Pago (Solo si eligen Tarjeta)
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

    // Si llega hasta aquí, significa que pasó todas las pruebas con éxito
    alert("✅ Todos los datos son correctos. Procesando pago seguro... ¡Redirigiendo a la confirmación!");

    // Aquí podemos vaciar el carrito automáticamente tras una compra exitosa
    // localStorage.removeItem(STORAGE_KEY);

    window.location.href = 'confirmacion.html';
}

// Al cargar la página, ejecuta los motores de render
document.addEventListener('DOMContentLoaded', () => {
    renderizarResumenCheckout();
});