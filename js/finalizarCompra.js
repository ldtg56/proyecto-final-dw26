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

    // ... (Lo pegas reemplazando desde la variable esDelivery hasta el final de la función) ...
    const esDelivery = document.getElementById('delivery') && document.getElementById('delivery').checked;
    const costoFinalEnvio = esDelivery ? TARIFA_DELIVERY : 0.00;

    // NUEVO: Leer el descuento guardado y restarlo
    const descuentoPendiente = parseFloat(localStorage.getItem('dmela_descuento_pendiente')) || 0;

    let totalPagar = sumaSubtotal + costoFinalEnvio - descuentoPendiente;
    if (totalPagar < 0) totalPagar = 0; // Evitar cobros negativos

    // Mostrar u ocultar la fila de descuento
    const filaDesc = document.getElementById('filaDescuentoCheckout');
    if (filaDesc) {
        if (descuentoPendiente > 0) {
            filaDesc.classList.remove('d-none');
            document.getElementById('checkoutDescuentoText').innerText = `- S/ ${descuentoPendiente.toFixed(2)}`;
        } else {
            filaDesc.classList.add('d-none');
        }
    }

    if (document.getElementById('checkoutSubtotalText')) document.getElementById('checkoutSubtotalText').innerText = `S/ ${sumaSubtotal.toFixed(2)}`;
    if (document.getElementById('checkoutEtiquetaEnvio')) document.getElementById('checkoutEtiquetaEnvio').innerText = esDelivery ? 'Costo de envío (Delivery)' : 'Recojo en tienda';
    if (document.getElementById('checkoutCostoEnvioText')) document.getElementById('checkoutCostoEnvioText').innerText = esDelivery ? `S/ ${costoFinalEnvio.toFixed(2)}` : 'Gratis';
    if (document.getElementById('checkoutTotalFinalText')) document.getElementById('checkoutTotalFinalText').innerText = `S/ ${totalPagar.toFixed(2)}`;

    const elemPuntos = document.getElementById('checkoutPuntosText');
    if (elemPuntos) elemPuntos.innerText = `+ ${sumaPuntos} pts`;

    localStorage.setItem('dmela_puntos_pendientes', sumaPuntos);
}


function procesarPago(event) {
    // 1. Detenemos la recarga automática del formulario
    if (event) event.preventDefault();

    // 2. LEER CARRITO
    const carritoString = localStorage.getItem('dmela_carrito_compras');
    const carritoGuardado = carritoString ? JSON.parse(carritoString) : [];

    if (carritoGuardado.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
    }

    // ===============================================================
    // 3. VALIDACIONES ESTRICTAS DE FORMULARIO
    // ===============================================================
    const inputNombre = document.getElementById('contactoNombre');
    const inputCorreo = document.getElementById('contactoEmail');

    if (inputNombre && !inputNombre.value.trim()) {
        alert("⚠️ Por favor, ingresa tu Nombre o Apodo.");
        inputNombre.focus();
        return;
    }

    if (inputCorreo && !inputCorreo.value.trim()) {
        alert("⚠️ Por favor, ingresa tu correo electrónico.");
        inputCorreo.focus();
        return;
    }

    const checkDelivery = document.getElementById('delivery');
    const esDelivery = checkDelivery ? checkDelivery.checked : false;

    if (esDelivery) {
        const envio = document.getElementById('dirEnvio');
        const calle = document.getElementById('dirCalle');
        const distrito = document.getElementById('dirDistrito');

        // Validación de Zona Exacta
        if (distrito && !distrito.value) {
            alert("⚠️ Lo sentimos, actualmente solo realizamos repartos en Chiclayo, La Victoria y Santa Victoria. Por favor selecciona tu zona.");
            distrito.focus();
            return;
        }

        // Validación anti direcciones falsas (Debe tener más de 8 letras/números y no ser solo números)
        if (envio && (!envio.value.trim() || envio.value.trim().length < 8 || !/[a-zA-Z]/.test(envio.value))) {
            alert("⚠️ Por favor, ingresa una dirección real y detallada (Mínimo 8 caracteres, incluyendo letras).");
            envio.focus();
            return;
        }

        if (calle && !calle.value.trim()) {
            alert("⚠️ Por favor, ingresa la calle, avenida o referencia.");
            calle.focus();
            return;
        }
    }

    const fecha = document.getElementById('fechaEntrega');
    const hora = document.getElementById('horaEntrega');

    if (fecha && !fecha.value) {
        alert("⚠️ Por favor, selecciona la fecha para tu pedido.");
        fecha.focus();
        return;
    }

    if (hora && !hora.value) {
        alert("⚠️ Por favor, selecciona la hora para tu pedido.");
        hora.focus();
        return;
    }

    // Validación estricta de tarjeta
    const esTarjeta = document.getElementById('tarjeta') && document.getElementById('tarjeta').checked;
    if (esTarjeta) {
        const numTarjeta = document.getElementById('tarjetaNum');
        const vencTarjeta = document.getElementById('tarjetaVenc');
        const cvcTarjeta = document.getElementById('tarjetaCVC');

        const numeroLimpio = numTarjeta ? numTarjeta.value.replace(/\s/g, '') : '';

        if (numeroLimpio.length < 13) {
            alert("⚠️ El número de tarjeta es inválido o demasiado corto.");
            if (numTarjeta) numTarjeta.focus();
            return;
        }

        // NUEVA VALIDACIÓN PARA FECHA Y CVC
        if (!vencTarjeta.value || vencTarjeta.value.length < 5) {
            alert("⚠️ Por favor, ingresa una fecha de vencimiento válida (Ej: 09/30).");
            if (vencTarjeta) vencTarjeta.focus();
            return;
        }

        if (!cvcTarjeta.value || cvcTarjeta.value.length < 3) {
            alert("⚠️ El código CVC debe tener exactamente 3 dígitos.");
            if (cvcTarjeta) cvcTarjeta.focus();
            return;
        }
    }

    // ===============================================================
    // 4. CAPTURA DE NOMBRE DINÁMICA
    // ===============================================================
    let nombreFormateado = 'Cliente';
    if (inputNombre && inputNombre.value.trim() !== '') {
        let primerNombre = inputNombre.value.trim().split(' ')[0];
        nombreFormateado = primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
    }
    localStorage.setItem('nombreComprador', nombreFormateado);

    // ===============================================================
    // 5. GENERAR ORDEN Y COSTOS
    // ===============================================================
    const numOrden = `${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 90000) + 10000}`;
    localStorage.setItem('numeroOrden', numOrden);
    localStorage.setItem('costoEnvio', esDelivery ? '15.00' : '0.00');

    // ===============================================================
    // 6. CALCULAR PUNTOS (100% SEGURO)
    // ===============================================================
    let puntosGanados = 0;
    let subtotalProductos = 0;

    carritoGuardado.forEach(prod => {
        puntosGanados += Math.floor(prod.precio) * prod.cantidad;
        subtotalProductos += prod.precio * prod.cantidad;
    });

    // Forzamos a que si la memoria está vacía, empiece en 0 numérico
    let puntosActuales = parseInt(localStorage.getItem('dmela_puntos_totales'));
    if (isNaN(puntosActuales)) puntosActuales = 0;

    localStorage.setItem('dmela_puntos_totales', puntosActuales + puntosGanados);
    // ===============================================================
    // 7. GUARDAR HISTORIAL PARA EL DASHBOARD
    // ===============================================================
    let primerProducto = carritoGuardado[0];
    let nombreRef = primerProducto.nombre;

    // NUEVO: Si compró más de 1 unidad de este producto, le agregamos el (xN)
    if (primerProducto.cantidad > 1) {
        nombreRef += ` (x${primerProducto.cantidad})`;
    }

    // Mantenemos la lógica por si hay otros productos diferentes en el carrito
    if (carritoGuardado.length > 1) {
        nombreRef += ` (+${carritoGuardado.length - 1} más)`;
    }

    const hoy = new Date();
    const fechaFormat = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

    const costoEnvioNum = esDelivery ? 15.00 : 0.00;
    const descuentoPendiente = parseFloat(localStorage.getItem('dmela_descuento_pendiente')) || 0;

    let totalPagarNum = subtotalProductos + costoEnvioNum - descuentoPendiente;
    if (totalPagarNum < 0) totalPagarNum = 0;

    const nuevoPedido = {
        id: `#${numOrden}`,
        nombre: nombreRef,
        fecha: fechaFormat,
        estado: 'En Proceso',
        total: totalPagarNum
    };

    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];
    historial.unshift(nuevoPedido);
    localStorage.setItem('dmela_historial_pedidos', JSON.stringify(historial));

    // ===============================================================
    // 8. VACIAR CARRITO, PASAR DATOS A LA BOLETA Y QUEMAR CUPÓN
    // ===============================================================
    localStorage.setItem('carritoBoleta', carritoString);
    localStorage.setItem('descuentoBoleta', descuentoPendiente); // Pasamos el descuento a la confirmación

    localStorage.removeItem('dmela_carrito_compras');
    localStorage.removeItem('dmela_descuento_pendiente'); // Limpiamos la memoria temporal

    //QUEMAR EL CUPÓN USADO PARA QUE NO SE REPITA
    const cuponUsado = localStorage.getItem('dmela_cupon_en_uso');
    if (cuponUsado) {
        let cuponesActivos = JSON.parse(localStorage.getItem('dmela_cupones_activos')) || [];
        // Filtramos la lista para dejar todos menos el que acabamos de usar
        cuponesActivos = cuponesActivos.filter(c => c.codigo !== cuponUsado);
        localStorage.setItem('dmela_cupones_activos', JSON.stringify(cuponesActivos));
        localStorage.removeItem('dmela_cupon_en_uso'); // Limpiamos la bandera
    }

    // 9. REDIRECCIÓN
    alert(`✅ ¡Pago procesado con éxito!\n🎉 Has ganado ${puntosGanados} puntos.\nRedirigiendo a tu boleta...`);
    window.location.href = 'confirmacion.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarResumenCheckout();

    // ===============================================================
    // DETECTOR DINÁMICO Y FORMATO DE TARJETAS
    // ===============================================================
    const inputTarjeta = document.getElementById('tarjetaNum');
    const iconoTarjeta = document.getElementById('iconoTarjeta');
    const inputVenc = document.getElementById('tarjetaVenc');
    const inputCVC = document.getElementById('tarjetaCVC');

    // 1. Formato para Número de Tarjeta y Cambio de Logo
    if (inputTarjeta && iconoTarjeta) {
        inputTarjeta.addEventListener('input', function (e) {
            let valorPuro = e.target.value.replace(/\D/g, ''); // Solo números
            iconoTarjeta.className = 'fs-4 ';

            if (valorPuro.startsWith('4')) {
                iconoTarjeta.className += 'fa-brands fa-cc-visa text-primary';
            } else if (valorPuro.startsWith('5')) {
                iconoTarjeta.className += 'fa-brands fa-cc-mastercard text-danger';
            } else if (valorPuro.startsWith('34') || valorPuro.startsWith('37')) {
                iconoTarjeta.className += 'fa-brands fa-cc-amex text-info';
            } else {
                iconoTarjeta.className += 'fa-solid fa-credit-card text-secondary';
            }

            if (valorPuro.length > 0) {
                valorPuro = valorPuro.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = valorPuro;
        });
    }

    // 2. Formato automático para Fecha de Vencimiento (MM/AA)
    if (inputVenc) {
        inputVenc.addEventListener('input', function (e) {
            let valor = e.target.value.replace(/\D/g, ''); // Borra letras al instante

            if (valor.length > 2) {
                // Si ya escribió más de 2 números, pone la barrita automáticamente
                valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
            }
            e.target.value = valor;
        });
    }

    // 3. Formato estricto para CVC (Solo números)
    if (inputCVC) {
        inputCVC.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
});