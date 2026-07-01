document.addEventListener('DOMContentLoaded', () => {
    // 1. Número de orden generado al pagar (fijo, no cambia al recargar)
    const numOrden = localStorage.getItem('numeroOrden') || Math.floor(Math.random() * 90000) + 10000;
    document.getElementById('numeroOrden').textContent = `Orden #${numOrden}`;

    // 2. Saludar al cliente
    const nombre = localStorage.getItem('nombreComprador') || 'Cliente';
    document.getElementById('tituloGracias').textContent = `¡Gracias por tu compra, ${nombre}!`;

    // 3. Leer carrito del puente
    const datosCarrito = localStorage.getItem('carritoBoleta');
    const carritoGuardado = datosCarrito ? JSON.parse(datosCarrito) : [];
    const contenedorLista = document.getElementById('listaConfirmacion');

    let sumaTotal = 0;
    let puntosGanados = 0; // NUEVA VARIABLE PARA LOS PUNTOS

    // 4. Pintar productos
    if (carritoGuardado.length > 0) {
        contenedorLista.innerHTML = '';
        carritoGuardado.forEach(item => {
            const nombreProd = item.nombre || item.titulo || item.producto || 'Producto';
            const cantProd = item.cantidad || item.qty || 1;
            const precioProd = parseFloat(item.precio) || 0;
            const totalProd = precioProd * cantProd;

            // Sumamos el total de dinero y el total de puntos de la compra
            sumaTotal += totalProd;
            puntosGanados += Math.floor(precioProd) * cantProd;

            contenedorLista.innerHTML += `
                <div class="d-flex justify-content-between mb-2 pb-2 border-bottom border-light">
                    <span>${cantProd}x ${nombreProd}</span>
                    <span class="text-nowrap fw-medium text-dark">S/ ${totalProd.toFixed(2)}</span>
                </div>
            `;
        });
    } else {
        contenedorLista.innerHTML = `<p class="text-center text-danger">No se encontraron productos en el resumen.</p>`;
    }

    // 5. Total con costo de envío real y descuentos
    const costoEnvio = parseFloat(localStorage.getItem('costoEnvio')) || 0;
    const descuentoAplicado = parseFloat(localStorage.getItem('descuentoBoleta')) || 0;

    let totalFinal = sumaTotal + costoEnvio - descuentoAplicado;
    if (totalFinal < 0) totalFinal = 0;

    // Mostrar el descuento en pantalla si hubo
    const filaDescConf = document.getElementById('filaDescuentoConfirmacion');
    if (filaDescConf && descuentoAplicado > 0) {
        filaDescConf.classList.remove('d-none');
        document.getElementById('descuentoAplicadoConfirmacion').textContent = `- S/ ${descuentoAplicado.toFixed(2)}`;
    }

    document.getElementById('totalPagadoConfirmacion').textContent = `S/ ${totalFinal.toFixed(2)}`;

    // 6. Imprimir los puntos en el recibo
    const elemPuntos = document.getElementById('puntosGanadosConfirmacion');
    if (elemPuntos) {
        elemPuntos.textContent = `+ ${puntosGanados} pts`;
    }

    // 7. Limpieza opcional (descomenta cuando quieras activarlo en producción)
    localStorage.removeItem('carritoBoleta');
    localStorage.removeItem('descuentoBoleta');
});