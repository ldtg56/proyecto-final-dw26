document.addEventListener('DOMContentLoaded', () => {
    // 1. Número de orden generado al pagar (fijo, no cambia al recargar)
    const numOrden = localStorage.getItem('numeroOrden') || Math.floor(Math.random() * 90000) + 10000;
    const elemOrden = document.getElementById('numeroOrden');
    if (elemOrden) elemOrden.textContent = `Orden #${numOrden}`;

    // 2. Saludar al cliente
    const nombre = localStorage.getItem('nombreComprador') || 'Cliente';
    const elemSaludo = document.getElementById('tituloGracias');
    if (elemSaludo) elemSaludo.textContent = `¡Gracias por tu compra, ${nombre}!`;

    // 3. Leer carrito del puente
    const datosCarrito = localStorage.getItem('carritoBoleta');
    const carritoGuardado = datosCarrito ? JSON.parse(datosCarrito) : [];
    const contenedorLista = document.getElementById('listaConfirmacion');

    let sumaTotal = 0;
    let puntosGanados = 0;

    // 4. Pintar productos (Con Favorito ❤️ y Desglose de Personalizados)
    if (contenedorLista) {
        if (carritoGuardado.length > 0) {
            contenedorLista.innerHTML = '';
            carritoGuardado.forEach(item => {
                const nombreProd = item.nombre || item.titulo || item.producto || 'Producto';
                const cantProd = item.cantidad || item.qty || 1;
                const precioProd = parseFloat(item.precio) || 0;
                const totalProd = precioProd * cantProd;

                // Corazón rojo si es favorito
                const iconoFav = item.favorito ? '<i class="fa-solid fa-heart text-danger ms-1" title="Producto Favorito"></i>' : '';

                // 🌟 NUEVO: Si es un pedido personalizado, generamos el submenú con su desglose de precios
                let htmlDesglose = '';
                if (item.tipo === 'personalizado' && item.desglose) {
                    htmlDesglose = `<div class="ps-3 mt-2 mb-1" style="font-size: 0.8rem; border-left: 2px solid #BF8484;">`;
                    item.desglose.forEach(sub => {
                        if (sub.precio > 0) {
                            htmlDesglose += `
                            <div class="d-flex justify-content-between mb-1 pe-2">
                                <span class="text-muted"><i class="fa-solid fa-caret-right me-1 opacity-50"></i> ${sub.nombre}</span>
                                <span class="text-dark fw-medium">S/ ${sub.precio.toFixed(2)}</span>
                            </div>`;
                        } else {
                            htmlDesglose += `
                            <div class="mb-1 text-muted">
                                <i class="fa-solid fa-caret-right me-1 opacity-50"></i> ${sub.nombre}
                            </div>`;
                        }
                    });
                    htmlDesglose += `</div>`;
                }

                sumaTotal += totalProd;
                puntosGanados += Math.floor(precioProd) * cantProd;

                // Dibujamos la fila completa con el producto y su desglose debajo
                contenedorLista.innerHTML += `
                    <div class="border-bottom border-light pb-2 mb-2">
                        <div class="d-flex justify-content-between align-items-start">
                            <span class="text-secondary"><strong class="text-dark">${cantProd}x</strong> ${nombreProd} ${iconoFav}</span>
                            <span class="text-nowrap fw-bold text-dark ms-2">S/ ${totalProd.toFixed(2)}</span>
                        </div>
                        ${htmlDesglose} </div>
                `;
            });
        } else {
            contenedorLista.innerHTML = `<p class="text-center text-danger">No se encontraron productos en el resumen.</p>`;
        }
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
        const elemDesc = document.getElementById('descuentoAplicadoConfirmacion');
        if (elemDesc) elemDesc.textContent = `- S/ ${descuentoAplicado.toFixed(2)}`;
    }

    const elemTotal = document.getElementById('totalPagadoConfirmacion');
    if (elemTotal) elemTotal.textContent = `S/ ${totalFinal.toFixed(2)}`;

    // 6. Imprimir los puntos en el recibo
    const elemPuntos = document.getElementById('puntosGanadosConfirmacion');
    if (elemPuntos) {
        elemPuntos.textContent = `+ ${puntosGanados} pts`;
    }
});