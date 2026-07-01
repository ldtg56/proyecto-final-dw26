// Variables globales
let precioBase = 0;
let productoActual = null; // NUEVA: Guardaremos el producto aquí

document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('prod_id');
    productoActual = catalogoDela[id]; // Lo guardamos en la variable global

    if (productoActual) {
        productoActual.id = id;
        precioBase = parseFloat(productoActual.precio.replace('S/', '').trim());

        // Inyectar datos
        document.getElementById('titulo-producto').innerText = productoActual.nombre;
        document.getElementById('foto-principal').src = productoActual.img;
        document.getElementById('foto-miniatura').src = productoActual.img;
        
        if (productoActual.masa) {
            document.getElementById('info-masa').innerText = productoActual.masa;
            document.getElementById('info-tiempo').innerText = productoActual.tiempo;
            document.getElementById('info-estilo').innerText = productoActual.estilo;
        }

        // Asignación de eventos usando la variable global
        document.getElementById('btn-pequena').onclick = () => actualizarPrecio('pequena');
        document.getElementById('btn-mediana').onclick = () => actualizarPrecio('mediana');
        
        // Carga inicial
        actualizarPrecio('pequena');
    }
});

// Función central corregida
function actualizarPrecio(tamano) {
    // Usamos productoActual en lugar de pasar el parámetro 'prod'
    const prod = productoActual; 
    if (!prod) return; // Seguridad extra

    const displayTotal = document.getElementById('precio-total');
    const displayPeso = document.getElementById('info-peso');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnPequena = document.getElementById('btn-pequena');
    const btnMediana = document.getElementById('btn-mediana');
    
    const extra = 20.00;
    let precioFinal = (tamano === 'pequena') ? precioBase : (precioBase + extra);
    let nombreFinal = `${prod.nombre} (${tamano === 'pequena' ? 'Pequeña' : 'Mediana'})`;
    
    // Ahora sí funcionará porque 'prod' ya no es undefined
    let pesoFinal = '';
    if (prod.id && prod.id.startsWith('10')) {
        pesoFinal = (tamano === 'pequena') ? '700 gr' : '1 kg';
    } else if (prod.id && prod.id.startsWith('50')) {
        pesoFinal = (tamano === 'pequena') ? '1 kg' : '1.5 kg';
    } else {
        pesoFinal = prod.peso || '---';
    }

    if (displayTotal) displayTotal.innerText = `S/ ${precioFinal.toFixed(2)}`;
    if (displayPeso) displayPeso.innerText = pesoFinal;

    if (btnAgregar) {
        btnAgregar.setAttribute('onclick', `agregarItemCarrito('${prod.id}', '${nombreFinal.replace(/'/g, "\\'")}', ${precioFinal.toFixed(2)}, '${prod.img}')`);
    }

    if (tamano === 'pequena') {
        btnPequena.className = 'btn btn-guinda btn-sm px-3';
        btnMediana.className = 'btn btn-outline-dark btn-sm px-3 border-guinda text-guinda fw-bold';
    } else {
        btnMediana.className = 'btn btn-guinda btn-sm px-3';
        btnPequena.className = 'btn btn-outline-dark btn-sm px-3 border-guinda text-guinda fw-bold';
    }
}