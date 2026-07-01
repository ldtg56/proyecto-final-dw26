
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

    // 1. Filtrar y guardar todos los productos de la categoría en una lista
    // 1. Filtrar y guardar todos los productos de la categoría en una lista
    const productosFiltrados = [];
    for (const id in catalogoDela) {
        if (id.startsWith(prefijoActual)) {
            const producto = catalogoDela[id];
            let pasaFiltro = true; // Asumimos que pasa por defecto

            // Juntamos todo el texto del producto para buscar ahí dentro
            // Si es combo no tiene masa, por eso usamos (producto.masa || '')
            const textoBusqueda = `${producto.nombre} ${producto.masa || ''} ${producto.estilo || ''}`.toLowerCase();

            // APLICAMOS FILTRO DE SABOR
            if (filtroSaborActual) {
                if (filtroSaborActual === 'choco' && !textoBusqueda.includes('chocolate')) pasaFiltro = false;
                if (filtroSaborActual === 'vainilla' && !textoBusqueda.includes('vainilla')) pasaFiltro = false;
                if (filtroSaborActual === 'fresa' && !textoBusqueda.includes('fresa') && !textoBusqueda.includes('frutos rojos')) pasaFiltro = false;
            }

            // APLICAMOS FILTRO DE COLECCIÓN
            if (pasaFiltro && filtroColActual) {
                if (filtroColActual === 'valentin' && !textoBusqueda.includes('amor') && !textoBusqueda.includes('valentín') && !textoBusqueda.includes('romántic')) pasaFiltro = false;
                if (filtroColActual === 'cumple' && !textoBusqueda.includes('birthday') && !textoBusqueda.includes('cumple') && !textoBusqueda.includes('infantil')) pasaFiltro = false; 
            }

            // Si sobrevivió a los filtros, lo agregamos a la lista
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
            return precioB - precioA; // De mayor a menor
        });
    }
    // 2. Calcular el corte (Paginación)
    // Ejemplo si estás en la pag 2: inicio = 6, fin = 12
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const productosAMostrar = productosFiltrados.slice(inicio, fin);

    // 3. Generar el HTML solo para esa porción de productos
    // 3. Generar el HTML dinámico
    // ==========================================
    // GENERAR EL HTML DINÁMICO CON REDIRECCIÓN CONDICIONAL
    // ==========================================
    productosAMostrar.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio.replace('S/', '').trim());
        
        // 1. Control de etiquetas flotantes (Combos y Ofertas)
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

        // 2. LA CLAVE: Control de redirección según la categoría
        // Solo Tortas ('10') y Pedidos ('50') llevan el enlace <a> hacia el detalle
        let bloqueImagenHTML = '';
        if (producto.id.startsWith('10') || producto.id.startsWith('50')) {
            bloqueImagenHTML = `
                <a href="detalleProducto.html" onclick="localStorage.setItem('prod_id', '${producto.id}')">
                    <img src="${producto.img}" class="card-img-top p-3" style="height: 220px; object-fit: cover;" alt="${producto.nombre}">
                </a>
            `;
        } else {
            // Combos ('20'), Ofertas ('30') y Bocaditos ('40') muestran la imagen directa, sin link
            bloqueImagenHTML = `
                <img src="${producto.img}" class="card-img-top p-3" style="height: 220px; object-fit: cover;" alt="${producto.nombre}">
            `;
        }

        // 3. Armamos la tarjeta inyectando los bloques configurados
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

    // 4. Inyectar al HTML
    if (contenedor) {
        contenedor.innerHTML = tarjetasHTML;
    }
}

function cambiarPagina(nuevaPagina) {
    if (nuevaPagina < 1) return; // Evita ir a la página 0 o negativas
    cargarProductosPagina(prefijoActual, nuevaPagina);

    // Opcional: Subir la pantalla al inicio de los productos al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Función para la flecha '>'
function alternarPagina() {
    // Si estamos en la página 1, la flecha nos lleva a la 2
    if (paginaActual === 1) {
        cambiarPagina(2);
    }
    // Si estamos en la página 2 (o cualquier otra), nos regresa a la 1
    else {
        cambiarPagina(1);
    }
}
document.addEventListener('DOMContentLoaded', () => {

    const selectOrden = document.getElementById('select-orden');
    if (selectOrden) {
        selectOrden.addEventListener('change', function() {
            ordenActual = this.value; // Guardamos "menor-mayor" o "mayor-menor"
            cargarProductosPagina(prefijoActual, 1); // Recargamos desde la página 1
        });
    }
});