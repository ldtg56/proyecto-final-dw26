document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    cargarPuntosYRango();
    cargarHistorialPedidos();
});

// 1. CARGAR NOMBRE DEL CLIENTE 
function cargarDatosUsuario() {
    const sesion = localStorage.getItem('dmela_sesion');
    const nombreCheckout = localStorage.getItem('nombreComprador');
    const saludo = document.getElementById('dashboardSaludo');

    let nombreMostrar = "Cliente";

    if (sesion) {
        try {
            const datos = JSON.parse(sesion);
            if (datos.nombre) nombreMostrar = datos.nombre.split(' ')[0];
        } catch (e) {
            console.error("Error al leer sesión");
        }
    } else if (nombreCheckout) {
        // Si no inició sesión, usa el nombre que puso al finalizar la compra
        nombreMostrar = nombreCheckout;
    }

    if (saludo) saludo.innerText = `Hola, ${nombreMostrar}!`;
}

// 2. SISTEMA DE PUNTOS Y RANGOS
function cargarPuntosYRango() {
    let puntos = parseInt(localStorage.getItem('dmela_puntos_totales'));
    if (isNaN(puntos)) puntos = 0;

    const elemPuntos = document.getElementById('dashboardPuntosText');
    if (elemPuntos) elemPuntos.innerText = `${puntos} pts.`;

    let rango = "Nuevo";
    let meta = `Faltan ${500 - puntos} pts. para subir!`;

    if (puntos >= 1500) {
        rango = "D'Mela VIP 👑";
        meta = "¡Has alcanzado el máximo nivel!";
    } else if (puntos >= 500) {
        rango = "D'Mela Lover";
        meta = `Faltan ${1500 - puntos} pts. para VIP`;
    }

    const elemRango = document.getElementById('dashboardRangoText');
    const elemMeta = document.getElementById('dashboardSiguienteRango');

    if (elemRango) elemRango.innerText = rango;
    if (elemMeta) elemMeta.innerText = meta;
}

// 3. SISTEMA DE CANJE DE PUNTOS (VERSIÓN SEGURA)
function canjearPuntos() {
    let puntosActuales = parseInt(localStorage.getItem('dmela_puntos_totales')) || 0;

    if (puntosActuales < 100) {
        alert("Necesitas al menos 100 puntos para realizar un canje. (100 pts = S/ 1.00 de descuento)");
        return;
    }

    let input = prompt(`Tienes ${puntosActuales} puntos.\n¿Cuántos puntos deseas canjear? (Mínimo 100, en múltiplos de 100)`);
    if (input === null) return;

    let puntosACanjear = parseInt(input);

    if (isNaN(puntosACanjear) || puntosACanjear < 100 || puntosACanjear % 100 !== 0) {
        alert("Por favor, ingresa una cantidad válida en múltiplos de 100 (Ej: 100, 200, 300).");
        return;
    }

    if (puntosACanjear > puntosActuales) {
        alert("No tienes suficientes puntos para esa cantidad.");
        return;
    }

    const valorDescuento = puntosACanjear / 100;
    const puntosRestantes = puntosActuales - puntosACanjear;

    localStorage.setItem('dmela_puntos_totales', puntosRestantes);

    // =========================================================
    // NUEVO: GENERAR CÓDIGO ÚNICO Y GUARDARLO EN LA BÓVEDA
    // =========================================================
    // Genera un sufijo aleatorio de 4 letras/números (Ej: X7B2)
    const sufijoAleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
    const codigoUnico = `PUNTOS-${valorDescuento}-${sufijoAleatorio}`;

    // Leemos la lista de cupones activos o creamos una nueva
    let cuponesGuardados = JSON.parse(localStorage.getItem('dmela_cupones_activos')) || [];

    // Guardamos el código y su valor en dinero
    cuponesGuardados.push({ codigo: codigoUnico, valor: valorDescuento });
    localStorage.setItem('dmela_cupones_activos', JSON.stringify(cuponesGuardados));

    alert(`🎉 ¡Canje exitoso!\nHas canjeado ${puntosACanjear} puntos por S/ ${valorDescuento.toFixed(2)} de descuento.\n\nGuarda este código ÚNICO para tu próxima compra:\n\n${codigoUnico}`);

    cargarPuntosYRango();
}

// 4. HISTORIAL DE COMPRAS 
function cargarHistorialPedidos() {
    const tbody = document.getElementById('tablaPedidosCuerpo');
    if (!tbody) return;

    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];

    // Adiós a los datos falsos. Ahora mostramos la realidad:
    if (historial.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-muted">Aún no tienes pedidos registrados. ¡Anímate a probar nuestras delicias!</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    historial.forEach(pedido => {
        let claseBadge = 'estado-pendiente';
        if (pedido.estado === 'Entregado') claseBadge = 'estado-entregado';
        else if (pedido.estado === 'En Proceso') claseBadge = 'estado-proceso';

        const fila = `
            <tr>
                <td class="py-3 text-start ps-3 fw-medium">${pedido.id} - ${pedido.nombre}</td>
                <td class="py-3 text-muted">${pedido.fecha}</td>
                <td class="py-3">
                    <span class="badge-estado ${claseBadge}" style="cursor: pointer; user-select: none;" onclick="simularCambioEstado('${pedido.id}')" title="Clic para simular cambio (Solo Demo)">${pedido.estado}</span>
                </td>
                <td class="py-3 text-secondary fw-bold">S/ ${parseFloat(pedido.total).toFixed(2)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });
}                     // <span class="badge-estado ${claseBadge}">${pedido.estado}</span> --debajo de  <td class="py-3">

// 5. SIMULADOR DE ESTADOS (Solo para la presentación)
function simularCambioEstado(idPedido) {
    let historial = JSON.parse(localStorage.getItem('dmela_historial_pedidos')) || [];

    // Buscamos el pedido exacto al que le dimos clic
    let index = historial.findIndex(p => p.id === idPedido);

    if (index !== -1) {
        // Lógica cíclica para cambiar el estado
        let estadoActual = historial[index].estado;

        if (estadoActual === 'En Proceso') {
            historial[index].estado = 'Entregado';
        } else if (estadoActual === 'Entregado') {
            historial[index].estado = 'Pendiente';
        } else {
            historial[index].estado = 'En Proceso';
        }

        // Guardamos el cambio y recargamos la tabla para ver el nuevo color
        localStorage.setItem('dmela_historial_pedidos', JSON.stringify(historial));
        cargarHistorialPedidos();
    }
}
