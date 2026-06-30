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

    // 4. Pintar productos
    if (carritoGuardado.length > 0) {
        contenedorLista.innerHTML = '';
        carritoGuardado.forEach(item => {
            const nombreProd = item.nombre || item.titulo || item.producto || 'Producto';
            const cantProd = item.cantidad || item.qty || 1;
            const precioProd = parseFloat(item.precio) || 0;
            const totalProd = precioProd * cantProd;

            sumaTotal += totalProd;

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

    // 5. Total con costo de envío real
    const costoEnvio = parseFloat(localStorage.getItem('costoEnvio')) || 0;
    const totalFinal = sumaTotal + costoEnvio;
    document.getElementById('totalPagadoConfirmacion').textContent = `S/ ${totalFinal.toFixed(2)}`;

    // 6. Limpieza opcional (descomenta cuando quieras activarlo)
    // localStorage.removeItem('carritoBoleta');
    // localStorage.removeItem('nombreComprador');
    // localStorage.removeItem('costoEnvio');
    // localStorage.removeItem('numeroOrden');
});