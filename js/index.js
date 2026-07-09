document.addEventListener('DOMContentLoaded', () => {
    // SEGURO: Eliminar cualquier fondo gris fantasma que se haya duplicado
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open'); 
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

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
            backdrop: true 
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

    // Usamos Object.entries para extraer el ID ('101', '102') junto con los datos
    const productosArray = Object.entries(catalogoDela).slice(0, 9);
    
    let htmlCarrusel = '';

    for (let i = 0; i < productosArray.length; i += 3) {
        const grupo = productosArray.slice(i, i + 3);
        const claseActiva = i === 0 ? 'active' : '';

        htmlCarrusel += `
            <div class="carousel-item ${claseActiva}">
                <div class="row g-4 justify-content-center align-items-stretch">
        `;

        grupo.forEach(([id, producto], index) => {
            const clasesColumna = index === 0 ? 'col-4' : 'col-4 d-none d-md-block';
            
            htmlCarrusel += `
                    <div class="${clasesColumna}">
                        <div class="tarjeta-producto-mockup h-100" 
                             style="transition: transform 0.2s ease; cursor: pointer;" 
                             onclick="irADetalleDesdeIndex('${id}')"
                             onmouseover="this.style.transform='translateY(-3px)'" 
                             onmouseout="this.style.transform='translateY(0)'">
                            
                            <div class="contenedor-foto-producto">
                                <img src="${producto.img}" alt="${producto.nombre}">
                            </div>
                            <div class="info-producto-mockup text-start">
                                <p class="mb-2 text-dark font-weight-bold" style="font-size: 0.85rem;">
                                    ${producto.nombre}
                                </p>
                                <div class="text-end">
                                    <span class="precio-recuadro-mockup fw-bold">${producto.precio}</span>
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

// =========================================================================
// Función: Redirigir al detalle usando la lógica de localStorage
// =========================================================================
function irADetalleDesdeIndex(id) {
    // Guarda el ID exactamente con la llave que espera tu detalle.js
    localStorage.setItem('prod_id', id);
    // Redirige a la página
    window.location.href = 'detalleProducto.html';
}