document.addEventListener('DOMContentLoaded', () => {
    // SEGURO: Eliminar cualquier fondo gris fantasma que se haya duplicado
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open'); 
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Ahora sí, ejecutamos las funciones limpiamente
    mostrarModalCTA();
    cargarProductosNuevos();
});

// =========================================================================
// Función: Mostrar CTA / Modal de Anuncio Emergente
// =========================================================================
function mostrarModalCTA() {
    const modalElement = document.getElementById('modalAnuncioCTA');
    
    if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement, {
            keyboard: true, 
            backdrop: true // Permite cerrar haciendo clic fuera de la imagen
        });
        
        myModal.show();
    }
}

// =========================================================================
// Función: Cargar productos en el carrusel de inicio
// =========================================================================
function cargarProductosNuevos() {
    const contenedorInner = document.getElementById('contenedor-carrusel-inner');
    
    if (!contenedorInner || typeof catalogoDela === 'undefined') return;

    // Convertimos el objeto en un arreglo y tomamos los primeros 9 productos (3 slides de 3)
    const productosArray = Object.values(catalogoDela).slice(0, 9);
    
    let htmlCarrusel = '';

    for (let i = 0; i < productosArray.length; i += 3) {
        const grupo = productosArray.slice(i, i + 3);
        const claseActiva = i === 0 ? 'active' : '';

        htmlCarrusel += `
            <div class="carousel-item ${claseActiva}">
                <div class="row g-4 justify-content-center align-items-stretch">
        `;

        grupo.forEach((producto, index) => {
            const clasesColumna = index === 0 ? 'col-4' : 'col-4 d-none d-md-block';
            
            htmlCarrusel += `
                    <div class="${clasesColumna}">
                        <div class="tarjeta-producto-mockup h-100">
                            <div class="contenedor-foto-producto">
                                <img src="${producto.img}" alt="${producto.nombre}">
                            </div>
                            <div class="info-producto-mockup text-start">
                                <p class="mb-2 text-dark font-weight-bold" style="font-size: 0.85rem;">
                                    ${producto.nombre}
                                </p>
                                <div class="text-end">
                                    <span class="precio-recuadro-mockup">${producto.precio}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });

        htmlCarrusel += `
                </div>
            </div>
        `;
    }

    contenedorInner.innerHTML = htmlCarrusel;
}

