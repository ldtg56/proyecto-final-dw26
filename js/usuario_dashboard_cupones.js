document.addEventListener('DOMContentLoaded', () => {
    if (typeof cargarDatosUsuario === 'function') cargarDatosUsuario(); // Reutiliza el saludo base
    cargarTablaCupones();
});

function cargarTablaCupones() {
    const tbody = document.getElementById('tablaCuponesCuerpo');
    if (!tbody) return;

    let cuponesGuardados = JSON.parse(localStorage.getItem('dmela_cupones_activos')) || [];

    if (cuponesGuardados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-muted">No tienes cupones generados por puntos actualmente. ¡Canjea tus puntos en la sección de Inicio!</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    cuponesGuardados.forEach(cupon => {
        let textoDescuento = cupon.descuento || (cupon.valor ? `S/ ${parseFloat(cupon.valor).toFixed(2)}` : '10%');

        let textoFecha = cupon.fechaExp;
        if (!textoFecha) {
            const fechaValida = new Date();
            fechaValida.setDate(fechaValida.getDate() + 30); 
            textoFecha = fechaValida.toLocaleDateString('es-PE');
        }

        let estadoActual = cupon.estado || 'VIGENTE';
        let claseEstado = estadoActual === 'VIGENTE' ? 'badge-vigente' : 'badge-expirado';

        let detalleCupon = cupon.detalle || (cupon.valor ? `Canje de puntos en Dashboard` : 'Cupón promocional de bienvenida');

        const fila = `
            <tr>
                <td class="py-3 text-center fw-bold text-dark" style="font-size: 0.95rem; letter-spacing: 0.5px;">
                    <code>${cupon.codigo}</code>
                </td>
                <td class="py-3 text-center text-danger fw-bold" style="font-size: 0.95rem;">${textoDescuento}</td>
                <td class="py-3 text-center text-muted" style="font-size: 0.9rem;">${textoFecha}</td>
                <td class="py-3 text-center">
                    <div class="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                        <span class="small text-secondary fw-medium">${detalleCupon}</span>
                        <span class="badge-estado ${claseEstado}" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">${estadoActual}</span>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });
}