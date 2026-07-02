document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario(); // Reutilizamos tu función base para el nombre del saludo
    cargarTablaCupones();
});

function cargarTablaCupones() {
    const tbody = document.getElementById('tablaCuponesCuerpo');
    if (!tbody) return;

    // Extraemos los cupones guardados (por ejemplo, los canjeados por puntos)
    let cuponesGuardados = JSON.parse(localStorage.getItem('dmela_cupones_activos')) || [];

    

    tbody.innerHTML = '';

    cuponesGuardados.forEach(cupon => {
        // Validamos el formato del descuento (si viene de puntos es dinero "S/ X.XX", si es del mockup es porcentaje "10%")
        let textoDescuento = cupon.descuento || (cupon.valor ? `S/ ${parseFloat(cupon.valor).toFixed(2)}` : 'N/A');
        
        // Validamos la fecha
        let textoFecha = cupon.fechaExp ? `Valido hasta el ${cupon.fechaExp}` : 'Sin fecha de caducidad';
        
        // Validamos el estado
        let estadoActual = cupon.estado || 'VIGENTE';
        let claseEstado = estadoActual === 'VIGENTE' ? 'badge-vigente' : 'badge-expirado';

        const fila = `
            <tr>
                <td class="py-3 text-center fw-medium" style="color: #4A4A4A;">${cupon.codigo}</td>
                <td class="py-3 text-center">${textoDescuento}</td>
                <td class="py-3 text-center text-muted">${textoFecha}</td>
                <td class="py-3 text-center">
                    <span class="badge-estado ${claseEstado}">${estadoActual}</span>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });
}