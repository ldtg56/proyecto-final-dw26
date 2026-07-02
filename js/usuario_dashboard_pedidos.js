document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario(); // Reutilizamos la función que ya tienes para el saludo
    cargarPaginaMisPedidos();
});

function cargarPaginaMisPedidos() {
    const tbody = document.getElementById('tablaMisPedidosCuerpo');
    const cajaTotal = document.getElementById('granTotalPedidos');
    if (!tbody) return;

    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];
    let sumaTotal = 0;

    if (historial.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-4 text-muted">Aún no tienes pedidos registrados.</td></tr>`;
        if(cajaTotal) cajaTotal.innerText = "S/ 0.00";
        return;
    }

    tbody.innerHTML = '';

    historial.forEach(pedido => {
        // Asignación de clases por estado
        let claseBadge = 'estado-pendiente';
        if (pedido.estado === 'Entregado') claseBadge = 'estado-entregado';
        else if (pedido.estado === 'En Proceso') claseBadge = 'estado-proceso';

        // Lógica matemática
        let totalPedido = parseFloat(pedido.total);
        sumaTotal += totalPedido;
        let puntosGanados = Math.floor(totalPedido); // Ejemplo: 1 sol = 1 punto

        // Se usa solo el código del ID (ej: PED-1234) en lugar del nombre del producto
        const codigoPedido = pedido.id.split('-')[1] ? pedido.id : `PED-${Math.floor(Math.random()*9000)+1000}`;

        const fila = `
            <tr>
                <td class="py-3 text-start ps-3 fw-medium" style="color: #555;">${codigoPedido}</td>
                <td class="py-3 text-muted">${pedido.fecha}</td>
                <td class="py-3">
                    <span class="badge-estado ${claseBadge}">${pedido.estado}</span>
                </td>
                <td class="py-3">
                    <button class="btn btn-sm btn-light border" onclick="verDetallesPedido('${codigoPedido}')" title="Ver Detalle">
                        <i class="fa-solid fa-eye text-secondary"></i>
                    </button>
                </td>
                <td class="py-3 text-success fw-bold">+${puntosGanados}</td>
                <td class="py-3 text-secondary fw-bold">S/ ${totalPedido.toFixed(2)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });

    // Actualizar el bloque gris inferior
    if (cajaTotal) {
        cajaTotal.innerText = `S/ ${sumaTotal.toFixed(2)}`;
    }
}

function verDetallesPedido(idPedido) {
    // Función WIP para el botón del ojo (Detalles)
    alert(`Aquí se abriría un modal mostrando los productos específicos del pedido: ${idPedido}`);
}