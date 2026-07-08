var STORAGE_KEY = 'dmela_carrito_compras';
var TARIFA_DELIVERY = 15.00;
document.addEventListener('DOMContentLoaded', () => {
    if (typeof requerirSesion === 'function') {
        const autenticado = requerirSesion();
        
        if (!autenticado) {
            const mainContent = document.querySelector('main');
            if(mainContent) mainContent.style.display = 'none';
            return; 
        }
    }

    if (typeof renderizarResumenCheckout === 'function') {
        renderizarResumenCheckout();
    }
});
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
        if (btnPagar) {
            btnPagar.classList.add('disabled');
            btnPagar.style.pointerEvents = 'none';
            btnPagar.style.opacity = '0.5';
        }
        if (document.getElementById('checkoutSubtotalText')) document.getElementById('checkoutSubtotalText').innerText = 'S/ 0.00';
        if (document.getElementById('checkoutCostoEnvioText')) document.getElementById('checkoutCostoEnvioText').innerText = 'S/ 0.00';
        if (document.getElementById('checkoutTotalFinalText')) document.getElementById('checkoutTotalFinalText').innerText = 'S/ 0.00';
        return;
    }

    if (btnPagar) {
        btnPagar.classList.remove('disabled');
        btnPagar.style.pointerEvents = 'auto';
        btnPagar.style.opacity = '1';
    }

    let sumaSubtotal = 0;
    let sumaPuntos = 0;
    
    carrito.forEach(prod => {
        const subtotalProd = prod.precio * prod.cantidad;
        sumaSubtotal += subtotalProd;
        const puntosProd = Math.floor(prod.precio) * prod.cantidad;
        sumaPuntos += puntosProd;
        
        let filasDetalle = '';
        if (prod.detalles && Object.keys(prod.detalles).length > 0) {
            filasDetalle = Object.entries(prod.detalles)
                .map(([clave, valor]) => `<span class="d-inline-block"><strong class="fw-bold">${clave}:</strong> ${valor}</span>`)
                .join('<span class="mx-1 opacity-50">|</span>');
        } else if (prod.tipo === 'combo') {
            filasDetalle = `<span class="d-inline-block"><strong class="fw-bold">Categoría:</strong> Combo Especial</span>`;
        } else {
            filasDetalle = `<span class="d-inline-block"><strong class="fw-bold">Categoría:</strong> Adicionales</span>`;
        }

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

    const esDelivery = document.getElementById('delivery') && document.getElementById('delivery').checked;
    const costoFinalEnvio = esDelivery ? TARIFA_DELIVERY : 0.00;
    const descuentoPendiente = parseFloat(localStorage.getItem('dmela_descuento_pendiente')) || 0;
    let totalPagar = sumaSubtotal + costoFinalEnvio - descuentoPendiente;
    if (totalPagar < 0) totalPagar = 0;

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
    if (event) event.preventDefault();

    if (typeof requerirSesion === 'function') {
        if (!requerirSesion()) return;
    }

    // LEER Y ORDENAR CARRITO 
    const carritoString = localStorage.getItem(STORAGE_KEY);
    let carrito = carritoString ? JSON.parse(carritoString) : [];
    if (carrito.length === 0) {
        alert("⚠️ No puedes finalizar el pago porque tu carrito está vacío.");
        return;
    }
    carrito.sort((a, b) => (b.favorito === true ? 1 : 0) - (a.favorito === true ? 1 : 0));

    // ===============================================================
    // VALIDACIONES ESTRICTAS DE FORMULARIO
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
        if (distrito && !distrito.value) {
            alert("⚠️ Lo sentimos, actualmente solo realizamos repartos en Chiclayo, La Victoria y Santa Victoria. Por favor selecciona tu zona.");
            distrito.focus();
            return;
        }
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
    // CAPTURA DE NOMBRE DINÁMICA
    // ===============================================================
    let nombreFormateado = 'Cliente';
    if (inputNombre && inputNombre.value.trim() !== '') {
        nombreFormateado = inputNombre.value.trim();
    }
    localStorage.setItem('nombreComprador', nombreFormateado);

    // ===============================================================
    // GENERAR ORDEN Y COSTOS
    // ===============================================================
    const numOrden = `${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 90000) + 10000}`;
    localStorage.setItem('numeroOrden', numOrden);
    localStorage.setItem('costoEnvio', esDelivery ? '15.00' : '0.00');

    // ===============================================================
    // CALCULAR PUNTOS Y SUBTOTALES
    // ===============================================================
    let puntosGanados = 0;
    let subtotalProductos = 0;
    carrito.forEach(prod => {
        puntosGanados += Math.floor(prod.precio) * prod.cantidad;
        subtotalProductos += prod.precio * prod.cantidad;
    });

    let puntosActuales = parseInt(localStorage.getItem('dmela_puntos_totales'));
    if (isNaN(puntosActuales)) puntosActuales = 0;
    localStorage.setItem('dmela_puntos_totales', puntosActuales + puntosGanados);

    // ===============================================================
    // GUARDAR HISTORIAL PARA EL DASHBOARD
    // ===============================================================
    let primerProducto = carrito[0];
    let nombreRef = primerProducto.nombre;
    if (primerProducto.cantidad > 1) {
        nombreRef += ` (x${primerProducto.cantidad})`;
    }
    if (carrito.length > 1) {
        nombreRef += ` (+${carrito.length - 1} más)`;
    }

    const hoy = new Date();
    const fechaFormat = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
    const costoEnvioNum = esDelivery ? TARIFA_DELIVERY : 0.00;
    const descuentoPendiente = parseFloat(localStorage.getItem('dmela_descuento_pendiente')) || 0;
    let totalPagarNum = subtotalProductos + costoEnvioNum - descuentoPendiente;
    if (totalPagarNum < 0) totalPagarNum = 0;

    const idPedidoGenerado = '#' + (Math.floor(Math.random() * 90000) + 10000);
    const nuevoPedido = {
        id: idPedidoGenerado,
        nombre: nombreRef,
        fecha: fechaFormat,
        estado: 'En Proceso',
        total: totalPagarNum,
        descuento: descuentoPendiente,
        productos: carrito    
    };

    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];
    historial.unshift(nuevoPedido);
    localStorage.setItem('dmela_historial_pedidos', JSON.stringify(historial));

    // ===============================================================
    // VACIAR CARRITO, PASAR DATOS A BOLETA Y QUEMAR CUPÓN
    // ===============================================================
    localStorage.setItem('carritoBoleta', JSON.stringify(carrito));
    localStorage.setItem('descuentoBoleta', descuentoPendiente);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('dmela_descuento_pendiente');

    const cuponUsado = localStorage.getItem('dmela_cupon_en_uso');
    if (cuponUsado) {
        let cuponesActivos = JSON.parse(localStorage.getItem('dmela_cupones_activos')) || [];
        cuponesActivos = cuponesActivos.filter(c => c.codigo !== cuponUsado);
        localStorage.setItem('dmela_cupones_activos', JSON.stringify(cuponesActivos));
        localStorage.removeItem('dmela_cupon_en_uso');
    }

    alert(`✅ ¡Pago procesado con éxito!\n🎉 Has ganado ${puntosGanados} puntos.\nRedirigiendo a tu boleta...`);
    window.location.href = 'confirmacion.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validar sesión
    if (typeof requerirSesion === 'function') {
        const autenticado = requerirSesion();
        if (!autenticado) {
            const mainContent = document.querySelector('main');
            if (mainContent) mainContent.style.display = 'none';
            return;
        }
    }

    // 2. Auto-completar datos del cliente desde su cuenta
    const sesionString = localStorage.getItem('dmela_sesion');
    if (sesionString) {
        try {
            const datosSesion = JSON.parse(sesionString);
            const inputNombre = document.getElementById('contactoNombre');
            const inputCorreo = document.getElementById('contactoEmail');
            const inputTelefono = document.getElementById('contactoTelefono');
            if (inputNombre && datosSesion.nombre) inputNombre.value = datosSesion.nombre;
            if (inputCorreo && datosSesion.correo) inputCorreo.value = datosSesion.correo;
            if (inputTelefono && datosSesion.telefono) inputTelefono.value = datosSesion.telefono;
        } catch(e) { console.error("Error al leer datos de sesión"); }
    }

    // 3. Renderizar vista de checkout (CORREGIDO: Llamamos a tu función real)
    renderizarResumenCheckout();

    // 4. Restricción de fecha de entrega
    const inputFecha = document.getElementById('fechaEntrega');
    if (inputFecha) {
        const hoy = new Date();
        const dd = String(hoy.getDate()).padStart(2, '0');
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const yyyy = hoy.getFullYear();
        inputFecha.min = `${yyyy}-${mm}-${dd}`;
        inputFecha.max = `${yyyy + 1}-12-31`;
    }

    // 5. Formato dinámico de tarjetas
    const inputTarjeta = document.getElementById('tarjetaNum');
    const iconoTarjeta = document.getElementById('iconoTarjeta');
    const inputVenc = document.getElementById('tarjetaVenc');
    const inputCVC = document.getElementById('tarjetaCVC');

    if (inputTarjeta && iconoTarjeta) {
        inputTarjeta.addEventListener('input', function (e) {
            let valorPuro = e.target.value.replace(/\D/g, '');
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

    if (inputVenc) {
        inputVenc.addEventListener('input', function (e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 2) {
                valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
            }
            e.target.value = valor;
        });
    }

    if (inputCVC) {
        inputCVC.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
});