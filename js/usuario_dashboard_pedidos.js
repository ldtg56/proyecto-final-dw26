document.addEventListener('DOMContentLoaded', () => {
    if (typeof cargarDatosUsuario === 'function') cargarDatosUsuario();
    cargarPaginaMisPedidos();
});

function cargarPaginaMisPedidos() {
    const tbody = document.getElementById('tablaMisPedidosCuerpo');
    const cajaTotal = document.getElementById('granTotalPedidos');
    if (!tbody) return;

    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];
    let sumaTotal = 0;
    let puntosTotalesReales = 0;

    if (historial.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-4 text-muted">Aún no tienes pedidos registrados.</td></tr>`;
        if (cajaTotal) cajaTotal.innerText = "S/ 0.00";
        return;
    }

    tbody.innerHTML = '';

    historial.forEach(pedido => {
        let claseBadge = 'estado-pendiente';
        if (pedido.estado === 'Entregado') claseBadge = 'estado-entregado';
        else if (pedido.estado === 'En Proceso') claseBadge = 'estado-proceso';
        else if (pedido.estado === 'Cancelado') claseBadge = 'estado-cancelado';

        let totalPedido = parseFloat(pedido.total) || 0;
        let puntosGanados = 0;
        let textoPuntos = '';

        if (pedido.estado === 'Cancelado') {
            puntosGanados = 0;
            textoPuntos = `<span class="text-muted fw-normal">0 pts</span>`;
        } else {
            sumaTotal += totalPedido;
            puntosGanados = Math.floor(totalPedido);
            puntosTotalesReales += puntosGanados;
            textoPuntos = `<span class="text-success fw-bold">+${puntosGanados} pts</span>`;
        }

        let botonBoleta = '';
        if (pedido.estado === 'Cancelado') {
            botonBoleta = `<span class="text-muted d-flex align-items-center justify-content-center gap-1" style="font-size: 0.85rem;"><i class="fa-solid fa-ban"></i> No disponible</span>`;
        } else {
            botonBoleta = `<a href="#" onclick="abrirBoleta('${pedido.id}'); return false;" class="text-secondary text-decoration-underline text-nowrap d-flex align-items-center justify-content-center gap-1" style="font-size: 0.85rem;"><i class="fa-solid fa-eye"></i> Ver boleta</a>`;
        }

        const fila = `
            <tr>
                <td class="py-3 text-start ps-3 fw-medium text-dark" style="font-size: 0.95rem;">
                    ${pedido.id} - ${pedido.nombre}
                </td>
                <td class="py-3 text-muted" style="font-size: 0.9rem;">${pedido.fecha}</td>
                <td class="py-3">
                    <span class="badge-estado ${claseBadge}" style="cursor:pointer; user-select:none;" onclick="simularCambioEstado('${pedido.id}')" title="Clic para cambiar estado">${pedido.estado}</span>
                </td>
                <td class="py-3">
                    ${botonBoleta}
                </td>
                <td class="py-3" style="font-size: 0.9rem;">${textoPuntos}</td>
                <td class="py-3 text-dark fw-bold" style="font-size: 0.95rem;">S/ ${totalPedido.toFixed(2)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });

    if (cajaTotal) cajaTotal.innerText = `S/ ${sumaTotal.toFixed(2)}`;
    localStorage.setItem('dmela_puntos_totales', puntosTotalesReales);
}

function simularCambioEstado(idPedido) {
    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];
    let index = historial.findIndex(p => p.id === idPedido);

    if (index !== -1) {
        let estadoActual = historial[index].estado;
        if (estadoActual === 'Pendiente') historial[index].estado = 'En Proceso';
        else if (estadoActual === 'En Proceso') historial[index].estado = 'Entregado';
        else if (estadoActual === 'Entregado') historial[index].estado = 'Cancelado';
        else historial[index].estado = 'Pendiente';

        localStorage.setItem('dmela_historial_pedidos', JSON.stringify(historial));
        cargarPaginaMisPedidos();
    }
}

// DESGLOSE EN LA BOLETA
function abrirBoleta(idPedido) {
    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];
    let pedido = historial.find(p => p.id === idPedido);

    if (pedido) {
        const cuerpoModal = document.getElementById('cuerpoBoletaModal');
        let puntosGanados = Math.floor(parseFloat(pedido.total));
        let nombreComprador = localStorage.getItem('nombreComprador') || 'Cliente D\'Mela';

        let listaProductosHTML = '';
        if (pedido.productos && pedido.productos.length > 0) {
            listaProductosHTML = pedido.productos.map(p => {
                const iconoFav = p.favorito ? '<i class="fa-solid fa-heart text-danger ms-1" title="Producto Favorito"></i>' : '';

                let htmlDesglose = '';
                if (p.tipo === 'personalizado' && p.desglose) {
                    htmlDesglose = `<div class="ps-3 mt-2 mb-1" style="font-size: 0.8rem; border-left: 2px solid #BF8484;">`;
                    p.desglose.forEach(item => {
                        if (item.precio > 0) {
                            htmlDesglose += `
                            <div class="d-flex justify-content-between mb-1 pe-2">
                                <span class="text-muted"><i class="fa-solid fa-caret-right me-1 opacity-50"></i> ${item.nombre}</span>
                                <span class="text-dark fw-medium">S/ ${item.precio.toFixed(2)}</span>
                            </div>`;
                        } else {
                            htmlDesglose += `
                            <div class="mb-1 text-muted">
                                <i class="fa-solid fa-caret-right me-1 opacity-50"></i> ${item.nombre}
                            </div>`;
                        }
                    });
                    htmlDesglose += `</div>`;
                }

                return `
                <div class="border-bottom border-light pb-2 mb-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="text-secondary"><strong class="text-dark">${p.cantidad}x</strong> ${p.nombre} ${iconoFav}</span>
                        <span class="text-dark fw-bold text-nowrap ms-2">S/ ${(parseFloat(p.precio) * p.cantidad).toFixed(2)}</span>
                    </div>
                    ${htmlDesglose} <!-- Aquí se inserta el submenú de precios -->
                </div>`;
            }).join('');
        } else {
            listaProductosHTML = `<div class="text-secondary">${pedido.nombre}</div>`;
        }

        let descuentoHTML = '';
        if (pedido.descuento && parseFloat(pedido.descuento) > 0) {
            descuentoHTML = `
            <div class="d-flex justify-content-between pt-2 border-top text-danger fw-bold" style="font-size: 0.95rem;">
                <span>Descuento aplicado:</span>
                <span>- S/ ${parseFloat(pedido.descuento).toFixed(2)}</span>
            </div>`;
        }

        cuerpoModal.innerHTML = `
            <div class="text-center mb-4">
                <img src="img/logoD'Mela - copia.jpg" alt="D'Mela" style="max-height: 60px;" class="mb-2">
                <h6 class="fw-bold mb-0 text-dark">Recibo Electrónico</h6>
                <p class="text-muted small mb-0">Orden ${pedido.id}</p>
            </div>
            
            <div class="border-top border-bottom py-3 mb-3">
                <div class="d-flex justify-content-between mb-1 small">
                    <span class="fw-bold text-dark">Fecha de emisión:</span>
                    <span class="text-muted">${pedido.fecha}</span>
                </div>
                <div class="d-flex justify-content-between mb-1 small">
                    <span class="fw-bold text-dark">Estado del pedido:</span>
                    <span class="fw-bold" style="color: #8C1616;">${pedido.estado}</span>
                </div>
                <div class="d-flex justify-content-between small">
                    <span class="fw-bold text-dark">A nombre de:</span>
                    <span class="text-muted">${nombreComprador}</span>
                </div>
            </div>
            
            <div class="mb-3">
                <span class="fw-bold text-dark small d-block mb-2">Detalle de productos:</span>
                <div class="bg-light p-2 border rounded small">
                    ${listaProductosHTML}
                </div>
            </div>
            
            ${descuentoHTML}
            
            <div class="d-flex justify-content-between pt-2 border-top fw-bold" style="font-size: 1.1rem;">
                <span class="text-dark">TOTAL PAGADO:</span>
                <span style="color: #8C1616;">S/ ${parseFloat(pedido.total).toFixed(2)}</span>
            </div>
            
            <div class="d-flex justify-content-between pt-1 fw-bold text-success" style="font-size: 0.85rem;">
                <span>Puntos acumulados:</span>
                <span>+${puntosGanados} pts</span>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('modalBoleta'));
        modal.show();
    }
}