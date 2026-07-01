let precioBase = 0;
let productoActual = null;

document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('prod_id');
    productoActual = catalogoDela[id]; 

    if (productoActual) {
        productoActual.id = id;
        precioBase = parseFloat(productoActual.precio.replace('S/', '').trim());

        document.getElementById('titulo-producto').innerText = productoActual.nombre;
        document.getElementById('foto-principal').src = productoActual.img;
        document.getElementById('foto-miniatura').src = productoActual.img;
        
        if (productoActual.masa) {
            document.getElementById('info-masa').innerText = productoActual.masa;
            document.getElementById('info-tiempo').innerText = productoActual.tiempo;
            document.getElementById('info-estilo').innerText = productoActual.estilo;
        }

        document.getElementById('btn-pequena').onclick = () => actualizarPrecio('pequena');
        document.getElementById('btn-mediana').onclick = () => actualizarPrecio('mediana');
        
        actualizarPrecio('pequena');
        cargarTambienOfrecemos();
    }
});

function actualizarPrecio(tamano) {
    const prod = productoActual; 
    if (!prod) return;

    const displayTotal = document.getElementById('precio-total');
    const displayPeso = document.getElementById('info-peso');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnPequena = document.getElementById('btn-pequena');
    const btnMediana = document.getElementById('btn-mediana');
    
    const extra = 20.00;
    let precioFinal = (tamano === 'pequena') ? precioBase : (precioBase + extra);
    let nombreFinal = `${prod.nombre} (${tamano === 'pequena' ? 'Pequeña' : 'Mediana'})`;
    
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
function cargarTambienOfrecemos() {
    const contenedor = document.getElementById('contenedor-tambien-ofrecemos');
    if (!contenedor || !productoActual) return;

    const idActual = productoActual.id;

    // Tomamos las claves del catálogo, quitamos el producto actual, y cogemos las primeras 5
    const idsFiltrados = Object.keys(catalogoDela)
        .filter(id => id !== idActual)
        .slice(0, 5);

    contenedor.innerHTML = ''; // Limpiar por si acaso

    idsFiltrados.forEach(id => {
        const prod = catalogoDela[id];

        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card-complemento" style="cursor:pointer;">
                <img src="${prod.img}" class="img-fluid w-100" alt="${prod.nombre}">
                <p class="small m-0 fw-bold">${prod.nombre}</p>
            </div>
        `;

        // Click en la tarjeta (imagen o nombre) navega al detalle de ESE producto
        col.querySelector('img').addEventListener('click', () => irADetalleProducto(id));
        col.querySelector('p').addEventListener('click', () => irADetalleProducto(id));

        contenedor.appendChild(col);
    });
}

function irADetalleProducto(id) {
    localStorage.setItem('prod_id', id);
    location.reload(); // Como estamos en la misma página (producto.html), recargamos con el nuevo id
}