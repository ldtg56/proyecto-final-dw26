
const itemsPorPagina = 6;
let paginaActual = 1;
let prefijoActual = '10';
let filtroSaborActual = null;
let filtroColActual = null;
let ordenActual = 'predeterminado';
function cargarProductosPagina(prefijoId, paginaNum) {
    prefijoActual = prefijoId;
    paginaActual = paginaNum;

    const contenedor = document.getElementById('grilla-productos');
    let tarjetasHTML = '';

    const productosFiltrados = [];
    for (const id in catalogoDela) {
        if (id.startsWith(prefijoActual)) {
            const producto = catalogoDela[id];
            let pasaFiltro = true;
            const textoBusqueda = `${producto.nombre} ${producto.masa || ''} ${producto.estilo || ''}`.toLowerCase();

            if (filtroSaborActual) {
                if (filtroSaborActual === 'choco' && !textoBusqueda.includes('chocolate')) pasaFiltro = false;
                if (filtroSaborActual === 'vainilla' && !textoBusqueda.includes('vainilla')) pasaFiltro = false;
                if (filtroSaborActual === 'fresa' && !textoBusqueda.includes('fresa') && !textoBusqueda.includes('frutos rojos')) pasaFiltro = false;
            }

            if (pasaFiltro && filtroColActual) {
                if (filtroColActual === 'valentin' && !textoBusqueda.includes('amor') && !textoBusqueda.includes('valentín') && !textoBusqueda.includes('romántic')) pasaFiltro = false;
                if (filtroColActual === 'cumple' && !textoBusqueda.includes('birthday') && !textoBusqueda.includes('cumple') && !textoBusqueda.includes('infantil')) pasaFiltro = false; 
            }

            if (pasaFiltro) {
                productosFiltrados.push({ id: id, ...producto });
            }
        }
    }
    if (ordenActual === 'menor-mayor') {
        productosFiltrados.sort((a, b) => {
            const precioA = parseFloat(a.precio.replace('S/', '').trim());
            const precioB = parseFloat(b.precio.replace('S/', '').trim());
            return precioA - precioB; // De menor a mayor
        });
    } else if (ordenActual === 'mayor-menor') {
        productosFiltrados.sort((a, b) => {
            const precioA = parseFloat(a.precio.replace('S/', '').trim());
            const precioB = parseFloat(b.precio.replace('S/', '').trim());
            return precioB - precioA;
        });
    }
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const productosAMostrar = productosFiltrados.slice(inicio, fin);

    productosAMostrar.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio.replace('S/', '').trim());
        
        let etiquetaHTML = ''; 
        let bloquePrecioHTML = `<p class="text-danger fw-bold mb-3 fs-5">${producto.precio}</p>`;

        if (producto.id.startsWith('20')) {
            etiquetaHTML = `<div class="badge-combo">¡OFERTA!</div>`;
        } else if (producto.id.startsWith('30')) {
            etiquetaHTML = `<div class="badge-estrella">${producto.descuento}</div>`;
            bloquePrecioHTML = `
                <div class="mb-3">
                    <span class="text-muted text-decoration-line-through small me-2">${producto.precioAntiguo}</span>
                    <span class="text-dark fw-bold fs-5">${producto.precio}</span>
                </div>
            `;
        }

        let bloqueImagenHTML = '';
        if (producto.id.startsWith('10') || producto.id.startsWith('50')) {
            bloqueImagenHTML = `
                <a href="detalleProducto.html" onclick="localStorage.setItem('prod_id', '${producto.id}')">
                    <img src="${producto.img}" class="card-img-top p-3" style="height: 220px; object-fit: cover;" alt="${producto.nombre}">
                </a>
            `;
        } else {
            bloqueImagenHTML = `
                <img src="${producto.img}" class="card-img-top p-3" style="height: 220px; object-fit: cover;" alt="${producto.nombre}">
            `;
        }

        tarjetasHTML += `
            <div class="col">
                <div class="card card-producto h-100 shadow-sm border-guinda text-center">
                    
                    ${etiquetaHTML}
                    
                    ${bloqueImagenHTML}
                    
                    <div class="card-body d-flex flex-column justify-content-between">
                        <p class="fw-bold mb-2 small">${producto.nombre}</p>
                        
                        ${bloquePrecioHTML}
                        
                        <button class="btn btn-guinda w-100 mt-auto" 
                            onclick="agregarItemCarrito('${producto.id}', '${producto.nombre}', ${precioNumerico}, '${producto.img}')">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    if (contenedor) {
        contenedor.innerHTML = tarjetasHTML;
    }
}

function cambiarPagina(nuevaPagina) {
    if (nuevaPagina < 1) return; 
    cargarProductosPagina(prefijoActual, nuevaPagina);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function alternarPagina() {
    if (paginaActual === 1) {
        cambiarPagina(2);
    }
    else {
        cambiarPagina(1);
    }
}
document.addEventListener('DOMContentLoaded', () => {

    const selectOrden = document.getElementById('select-orden');
    if (selectOrden) {
        selectOrden.addEventListener('change', function() {
            ordenActual = this.value;
            cargarProductosPagina(prefijoActual, 1); 
        });
    }
});